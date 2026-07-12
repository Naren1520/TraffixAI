package com.traffic.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    private String id;

    private String googleId;
    private String email;
    private String name;
    private String pictureUrl;
    private String locale;
    private boolean emailVerified;
    private Instant createdAt;
    private Instant lastLogin;
}
