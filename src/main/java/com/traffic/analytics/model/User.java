package com.traffic.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String googleId;

    @Indexed(unique = true)
    private String email;

    private String name;
    private String picture;

    @Builder.Default
    private List<RecentSearch> recentSearches = new ArrayList<>();

    // Default city set by user in Settings
    private String defaultCity;
    private Double defaultLat;
    private Double defaultLng;

    // True on first login — cleared after user sets their default location
    @Builder.Default
    private boolean firstLogin = true;

    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentSearch {
        private String city;
        private double lat;
        private double lng;
        private LocalDateTime searchedAt;
    }
}
