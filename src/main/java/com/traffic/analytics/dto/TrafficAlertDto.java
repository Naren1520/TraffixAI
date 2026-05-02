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
public class TrafficAlertDto {
    private String roadId;
    private LocalDateTime timestamp;
    private int vehicleCount;
    private double avgSpeed;
    private String alertReason;
}
