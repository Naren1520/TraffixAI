package com.traffic.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficDataDto {
    private String id;          // String now (MongoDB ObjectId)
    private String userId;      // which user's session this belongs to
    private String roadId;
    private int vehicleCount;
    private double avgSpeed;
    private LocalDateTime timestamp;
    private String congestionLevel;
}
