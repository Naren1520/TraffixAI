package com.traffic.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserResponseDto {
    private String id;
    private String email;
    private String name;
    private String pictureUrl;
    private String locale;
    private boolean emailVerified;
    private Instant createdAt;
    private Instant lastLogin;
}
