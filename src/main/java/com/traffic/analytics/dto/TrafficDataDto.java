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
    private Long id;
    private String roadId;
    private int vehicleCount;
    private double avgSpeed;
    private LocalDateTime timestamp;
    private String congestionLevel;
}
