package com.traffic.analytics.service;

import com.traffic.analytics.model.User;
import com.traffic.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private static final int MAX_RECENT_SEARCHES = 10;

    // ── Auth ───────────────────────────────────────────────────────────────────

    public User upsertUser(Map<String, Object> googleClaims) {
        String googleId = (String) googleClaims.get("sub");
        String email    = (String) googleClaims.get("email");
        String name     = (String) googleClaims.get("name");
        String picture  = (String) googleClaims.get("picture");

        return userRepository.findByGoogleId(googleId)
                .map(existing -> {
                    existing.setName(name);
                    existing.setPicture(picture);
                    existing.setLastLoginAt(LocalDateTime.now());
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .name(name)
                            .picture(picture)
                            .recentSearches(new ArrayList<>())
                            .firstLogin(true)   // will show location picker on frontend
                            .createdAt(LocalDateTime.now())
                            .lastLoginAt(LocalDateTime.now())
                            .build();
                    log.info("New user registered: {}", email);
                    return userRepository.save(newUser);
                });
    }

    // ── Profile ────────────────────────────────────────────────────────────────

    public User getProfile(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    // ── Default location ───────────────────────────────────────────────────────

    public User saveDefaultLocation(String userId, String city, double lat, double lng) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        user.setDefaultCity(city);
        user.setDefaultLat(lat);
        user.setDefaultLng(lng);
        user.setFirstLogin(false); // clear the first-login flag once location is set
        return userRepository.save(user);
    }

    // ── Recent searches ────────────────────────────────────────────────────────

    public List<User.RecentSearch> getRecentSearches(String userId) {
        return userRepository.findById(userId)
                .map(User::getRecentSearches)
                .orElse(List.of());
    }

    public List<User.RecentSearch> saveSearch(String userId, String city, double lat, double lng) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        List<User.RecentSearch> searches = new ArrayList<>(user.getRecentSearches());
        searches.removeIf(s -> s.getCity().equalsIgnoreCase(city));
        searches.add(0, User.RecentSearch.builder()
                .city(city)
                .lat(lat)
                .lng(lng)
                .searchedAt(LocalDateTime.now())
                .build());

        if (searches.size() > MAX_RECENT_SEARCHES) {
            searches = searches.subList(0, MAX_RECENT_SEARCHES);
        }

        user.setRecentSearches(searches);
        userRepository.save(user);
        return searches;
    }
}
