package com.traffic.analytics.controller;

import com.traffic.analytics.model.User;
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
     * GET /api/user/searches
     * Returns the current user's recent city searches.
     * Requires Authorization: Bearer <jwt>
     */
    @GetMapping("/searches")
    public ResponseEntity<List<User.RecentSearch>> getRecentSearches(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.getRecentSearches(userId));
    }

    /**
     * POST /api/user/searches
     * Body: { "city": "Bangalore", "lat": 12.97, "lng": 77.59 }
     * Saves a city search to the user's history.
     * Requires Authorization: Bearer <jwt>
     */
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
