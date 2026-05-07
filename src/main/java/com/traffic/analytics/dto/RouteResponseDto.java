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
public class RouteResponseDto {
    private String startLocation;
    private String endLocation;
    private List<RouteAnalysisDto> routes;
    private RouteAnalysisDto bestRoute;
    private String aiRecommendation;
    private long timestamp;
}
