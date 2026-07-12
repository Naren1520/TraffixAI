package com.traffic.analytics.ratelimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Apply to any controller method to enforce per-IP rate limiting.
 * Default limit comes from rate.limit.requests-per-minute in application.properties.
 * Override per-endpoint with the requestsPerMinute attribute.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    /**
     * 0 means "use the global default from config".
     */
    int requestsPerMinute() default 0;
}
