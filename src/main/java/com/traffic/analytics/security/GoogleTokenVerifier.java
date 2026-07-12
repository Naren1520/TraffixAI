package com.traffic.analytics.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Verifies a Google ID token by calling Google's tokeninfo endpoint.
 * This is the simplest, dependency-light approach — no Google API client library needed.
 */
@Component
@Slf4j
public class GoogleTokenVerifier {

    private static final String GOOGLE_TOKEN_INFO_URL =
            "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @Value("${google.client.id}")
    private String expectedClientId;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Verifies the ID token and returns its claims map, or throws if invalid.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> verify(String idToken) {
        try {
            Map<String, Object> claims = restTemplate.getForObject(
                    GOOGLE_TOKEN_INFO_URL + idToken,
                    Map.class
            );

            if (claims == null) {
                throw new IllegalArgumentException("Empty response from Google token verification");
            }

            // Log claims for debugging (remove in production)
            log.info("Google token claims: aud={}, azp={}, email={}, exp={}",
                    claims.get("aud"), claims.get("azp"),
                    claims.get("email"), claims.get("exp"));

            // Validate audience — Google can put client ID in either aud or azp
            String aud = (String) claims.get("aud");
            String azp = (String) claims.get("azp");

            boolean audMatch = expectedClientId.equals(aud) || expectedClientId.equals(azp);
            if (!audMatch) {
                throw new IllegalArgumentException(
                        "Token audience mismatch. Expected: " + expectedClientId
                        + ", got aud=" + aud + ", azp=" + azp);
            }

            // Validate token is not expired
            long exp = Long.parseLong(claims.get("exp").toString());
            if (exp < System.currentTimeMillis() / 1000) {
                throw new IllegalArgumentException("Google ID token has expired");
            }

            return claims;

        } catch (IllegalArgumentException e) {
            // Re-throw our own validation errors directly
            log.error("Google token verification failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            // Wrap unexpected errors (network, parsing, etc.)
            log.error("Google token verification unexpected error: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new IllegalArgumentException("Google token verification failed: " + e.getMessage(), e);
        }
    }
}
