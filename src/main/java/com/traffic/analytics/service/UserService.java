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

    /**
     * Creates a new user or updates their login timestamp if they already exist.
     * Called every time a user successfully signs in with Google.
     */
    public User upsertUser(Map<String, Object> googleClaims) {
        String googleId = (String) googleClaims.get("sub");
        String email    = (String) googleClaims.get("email");
        String name     = (String) googleClaims.get("name");
        String picture  = (String) googleClaims.get("picture");

        return userRepository.findByGoogleId(googleId)
                .map(existing -> {
                    // Update mutable fields on each login
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
                            .createdAt(LocalDateTime.now())
                            .lastLoginAt(LocalDateTime.now())
                            .build();
                    log.info("New user registered: {}", email);
                    return userRepository.save(newUser);
                });
    }

    /**
     * Returns the last MAX_RECENT_SEARCHES searches for a user, most recent first.
     */
    public List<User.RecentSearch> getRecentSearches(String userId) {
        return userRepository.findById(userId)
                .map(User::getRecentSearches)
                .orElse(List.of());
    }

    /**
     * Saves a new city search for the user.
     * Deduplicates by city name (case-insensitive) and keeps the list capped.
     */
    public List<User.RecentSearch> saveSearch(String userId, String city, double lat, double lng) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        List<User.RecentSearch> searches = new ArrayList<>(user.getRecentSearches());

        // Remove any existing entry for the same city (case-insensitive) to avoid duplicates
        searches.removeIf(s -> s.getCity().equalsIgnoreCase(city));

        // Add new search at the front
        searches.add(0, User.RecentSearch.builder()
                .city(city)
                .lat(lat)
                .lng(lng)
                .searchedAt(LocalDateTime.now())
                .build());

        // Keep only the most recent N
        if (searches.size() > MAX_RECENT_SEARCHES) {
            searches = searches.subList(0, MAX_RECENT_SEARCHES);
        }

        user.setRecentSearches(searches);
        userRepository.save(user);
        return searches;
    }
}
