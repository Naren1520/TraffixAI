package com.traffic.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoadTrafficSummaryDto {
    private String roadId;
    private int totalVehicleCount;
}
