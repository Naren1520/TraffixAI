package com.traffic.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteRequestDto {
    private double startLat;
    private double startLon;
    private double endLat;
    private double endLon;
    private String startLocation;
    private String endLocation;
    private String city;
}
