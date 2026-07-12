package com.traffic.analytics.controller;

import com.traffic.analytics.model.User;
import com.traffic.analytics.ratelimit.RateLimit;
import com.traffic.analytics.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/user/profile
     * Returns full user profile: name, email, picture, defaultLocation, createdAt, recentSearches.
     */
    @RateLimit
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        User user = userService.getProfile(userId);

        return ResponseEntity.ok(Map.of(
                "id",            user.getId(),
                "name",          user.getName(),
                "email",         user.getEmail(),
                "picture",       user.getPicture() != null ? user.getPicture() : "",
                "defaultCity",   user.getDefaultCity() != null ? user.getDefaultCity() : "",
                "defaultLat",    user.getDefaultLat() != null ? user.getDefaultLat() : 0.0,
                "defaultLng",    user.getDefaultLng() != null ? user.getDefaultLng() : 0.0,
                "firstLogin",    user.isFirstLogin(),
                "createdAt",     user.getCreatedAt() != null ? user.getCreatedAt().toString() : "",
                "lastLoginAt",   user.getLastLoginAt() != null ? user.getLastLoginAt().toString() : ""
        ));
    }

    /**
     * PUT /api/user/default-location
     * Body: { "city": "Bangalore", "lat": 12.97, "lng": 77.59 }
     * Saves/updates the user's default city. Also clears the firstLogin flag.
     */
    @RateLimit
    @PutMapping("/default-location")
    public ResponseEntity<Map<String, Object>> saveDefaultLocation(
            Authentication auth,
            @RequestBody Map<String, Object> body) {

        String userId = (String) auth.getPrincipal();
        String city   = (String) body.get("city");
        double lat    = Double.parseDouble(body.get("lat").toString());
        double lng    = Double.parseDouble(body.get("lng").toString());

        if (city == null || city.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "city is required"));
        }

        User updated = userService.saveDefaultLocation(userId, city, lat, lng);
        return ResponseEntity.ok(Map.of(
                "defaultCity", updated.getDefaultCity(),
                "defaultLat",  updated.getDefaultLat(),
                "defaultLng",  updated.getDefaultLng(),
                "firstLogin",  updated.isFirstLogin()
        ));
    }

    /**
     * GET /api/user/searches
     */
    @RateLimit
    @GetMapping("/searches")
    public ResponseEntity<List<User.RecentSearch>> getRecentSearches(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.getRecentSearches(userId));
    }

    /**
     * POST /api/user/searches
     * Body: { "city": "Bangalore", "lat": 12.97, "lng": 77.59 }
     */
    @RateLimit
    @PostMapping("/searches")
    public ResponseEntity<List<User.RecentSearch>> saveSearch(
            Authentication auth,
            @RequestBody Map<String, Object> body) {

        String userId = (String) auth.getPrincipal();
        String city   = (String) body.get("city");
        double lat    = Double.parseDouble(body.get("lat").toString());
        double lng    = Double.parseDouble(body.get("lng").toString());

        if (city == null || city.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(userService.saveSearch(userId, city, lat, lng));
    }
}
