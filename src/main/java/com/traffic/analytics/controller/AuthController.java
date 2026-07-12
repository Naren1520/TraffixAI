package com.traffic.analytics.controller;

import com.traffic.analytics.model.User;
import com.traffic.analytics.ratelimit.RateLimit;
import com.traffic.analytics.security.GoogleTokenVerifier;
import com.traffic.analytics.security.JwtUtil;
import com.traffic.analytics.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final GoogleTokenVerifier googleTokenVerifier;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * POST /api/auth/google
     * Body: { "idToken": "<Google ID token from frontend>" }
     *
     * Verifies the Google ID token, upserts the user in MongoDB,
     * and returns a TraffixAI JWT + user profile.
     */
    @RateLimit(requestsPerMinute = 10)
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idToken = body.get("idToken");

        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "idToken is required"));
        }

        try {
            // 1. Verify the token with Google
            Map<String, Object> claims = googleTokenVerifier.verify(idToken);

            // 2. Upsert user in MongoDB
            User user = userService.upsertUser(claims);

            // 3. Issue our own JWT
            String jwt = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName());

            // 4. Return JWT + user profile
            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "user", Map.of(
                            "id",      user.getId(),
                            "email",   user.getEmail(),
                            "name",    user.getName(),
                            "picture", user.getPicture() != null ? user.getPicture() : ""
                    )
            ));

        } catch (IllegalArgumentException e) {
            log.warn("Google login failed: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error during Google login", e);
            return ResponseEntity.status(500).body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }
}
