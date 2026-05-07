package com.traffic.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteAnalysisDto {
    private String routeId;
    private String routeName;
    private double distance; // in km
    private double estimatedTime; // in minutes
    private double estimatedDelay; // in minutes
    private String congestionLevel; // LOW, MEDIUM, HIGH
    private List<String> heavyTrafficZones;
    private List<String> alternativeRoutes;
    private double routeScore; // 0-100, higher is better
    private String recommendation; // AI generated
    private boolean isOptimal;
}
