package com.traffic.analytics.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * AOP-based sliding window rate limiter.
 *
 * Each IP gets a token bucket. The bucket refills at 'requestsPerMinute' tokens
 * per 60-second window. If empty → 429 Too Many Requests.
 *
 * Thread-safe. No external dependencies — uses ConcurrentHashMap + timestamps.
 */
@Aspect
@Component
@Slf4j
public class RateLimitAspect {

    @Value("${rate.limit.requests-per-minute:60}")
    private int globalLimit;

    // key = "ip::endpoint", value = token bucket
    private final ConcurrentHashMap<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    @Around("@annotation(com.traffic.analytics.ratelimit.RateLimit)")
    public Object enforce(ProceedingJoinPoint pjp) throws Throwable {
        String ip = resolveClientIp();
        int limit = resolveLimit(pjp);
        String key = ip + "::" + pjp.getSignature().toShortString();

        TokenBucket bucket = buckets.computeIfAbsent(key, k -> new TokenBucket(limit));

        if (!bucket.tryConsume(limit)) {
            log.warn("Rate limit exceeded — IP: {}, endpoint: {}", ip, pjp.getSignature().getName());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of(
                            "error", "Too many requests. Please slow down.",
                            "retryAfterSeconds", 60
                    ));
        }

        return pjp.proceed();
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    private String resolveClientIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return "unknown";
            HttpServletRequest req = attrs.getRequest();

            // Respect X-Forwarded-For from Render/Cloudflare proxies
            String xff = req.getHeader("X-Forwarded-For");
            if (xff != null && !xff.isEmpty()) {
                return xff.split(",")[0].trim();
            }
            return req.getRemoteAddr();
        } catch (Exception e) {
            return "unknown";
        }
    }

    private int resolveLimit(ProceedingJoinPoint pjp) {
        try {
            MethodSignature sig = (MethodSignature) pjp.getSignature();
            Method method = sig.getMethod();
            RateLimit annotation = method.getAnnotation(RateLimit.class);
            int annotationLimit = annotation.requestsPerMinute();
            return annotationLimit > 0 ? annotationLimit : globalLimit;
        } catch (Exception e) {
            return globalLimit;
        }
    }

    // ── inner class: sliding-window token bucket ───────────────────────────────

    private static class TokenBucket {
        private final Object lock = new Object();
        private int tokens;
        private long windowStartMs;

        TokenBucket(int initialTokens) {
            this.tokens = initialTokens;
            this.windowStartMs = Instant.now().toEpochMilli();
        }

        /**
         * Returns true if the request is allowed, false if rate limited.
         * Refills the bucket every 60 seconds.
         */
        boolean tryConsume(int maxPerMinute) {
            synchronized (lock) {
                long now = Instant.now().toEpochMilli();
                long elapsed = now - windowStartMs;

                // Refill window every 60 seconds
                if (elapsed >= 60_000) {
                    tokens = maxPerMinute;
                    windowStartMs = now;
                }

                if (tokens > 0) {
                    tokens--;
                    return true;
                }
                return false;
            }
        }
    }
}
