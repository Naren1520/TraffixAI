package com.traffic.analytics.service;

import com.traffic.analytics.dto.RouteAnalysisDto;
import com.traffic.analytics.dto.RouteRequestDto;
import com.traffic.analytics.dto.RouteResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {
    
    private final TrafficDataService trafficDataService;
    private final GeminiAiService geminiAiService;
    
    public RouteResponseDto analyzeRoute(RouteRequestDto request) {
        // Generate route alternatives
        List<RouteAnalysisDto> routes = generateRoutes(request);
        
        // Find best route based on analysis
        RouteAnalysisDto bestRoute = routes.stream()
            .max(Comparator.comparingDouble(RouteAnalysisDto::getRouteScore))
            .orElse(routes.get(0));
        
        // Get AI recommendation
        double congestionPercentage = calculateCongestionPercentage(bestRoute);
        String aiRecommendation = geminiAiService.getRouteRecommendation(
            request.getStartLocation(),
            request.getEndLocation(),
            bestRoute.getHeavyTrafficZones(),
            congestionPercentage,
            bestRoute.getEstimatedDelay()
        );
        
        return RouteResponseDto.builder()
            .startLocation(request.getStartLocation())
            .endLocation(request.getEndLocation())
            .routes(routes)
            .bestRoute(bestRoute)
            .aiRecommendation(aiRecommendation)
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    private List<RouteAnalysisDto> generateRoutes(RouteRequestDto request) {
        List<RouteAnalysisDto> routes = new ArrayList<>();
        
        // Route 1: Direct route
        routes.add(RouteAnalysisDto.builder()
            .routeId("route_direct_" + System.currentTimeMillis())
            .routeName("Direct Route")
            .distance(calculateDistance(request.getStartLat(), request.getStartLon(), 
                                       request.getEndLat(), request.getEndLon()))
            .estimatedTime(45.0)
            .estimatedDelay(analyzeTrafficDelay(request, "direct"))
            .congestionLevel(classifyCongestion(analyzeTrafficDelay(request, "direct")))
            .heavyTrafficZones(identifyHeavyTrafficZones(request))
            .alternativeRoutes(List.of("Route A", "Route B"))
            .routeScore(calculateRouteScore(analyzeTrafficDelay(request, "direct")))
            .isOptimal(false)
            .build());
        
        // Route 2: Alternative route avoiding main highway
        routes.add(RouteAnalysisDto.builder()
            .routeId("route_alt1_" + System.currentTimeMillis())
            .routeName("Scenic Route (Via Local Roads)")
            .distance(calculateDistance(request.getStartLat(), request.getStartLon(), 
                                       request.getEndLat(), request.getEndLon()) * 1.15)
            .estimatedTime(50.0)
            .estimatedDelay(analyzeTrafficDelay(request, "alternate1"))
            .congestionLevel(classifyCongestion(analyzeTrafficDelay(request, "alternate1")))
            .heavyTrafficZones(List.of())
            .alternativeRoutes(List.of("Route C", "Route D"))
            .routeScore(calculateRouteScore(analyzeTrafficDelay(request, "alternate1")))
            .isOptimal(true)
            .build());
        
        // Route 3: Bypass route
        routes.add(RouteAnalysisDto.builder()
            .routeId("route_bypass_" + System.currentTimeMillis())
            .routeName("Bypass Route (Longer but Faster)")
            .distance(calculateDistance(request.getStartLat(), request.getStartLon(), 
                                       request.getEndLat(), request.getEndLon()) * 1.25)
            .estimatedTime(42.0)
            .estimatedDelay(analyzeTrafficDelay(request, "bypass"))
            .congestionLevel(classifyCongestion(analyzeTrafficDelay(request, "bypass")))
            .heavyTrafficZones(List.of("MG Road intersection"))
            .alternativeRoutes(List.of("Route E", "Route F"))
            .routeScore(calculateRouteScore(analyzeTrafficDelay(request, "bypass")))
            .isOptimal(false)
            .build());
        
        return routes;
    }
    
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula for distance calculation
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
    
    private double analyzeTrafficDelay(RouteRequestDto request, String routeType) {
        // In production, this would analyze actual traffic data
        // For now, returning simulated delays based on time of day
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        double baseDelay = 0;
        
        if (hour >= 8 && hour <= 10) { // Morning rush
            baseDelay = routeType.equals("direct") ? 25 : (routeType.equals("alternate1") ? 8 : 15);
        } else if (hour >= 17 && hour <= 19) { // Evening rush
            baseDelay = routeType.equals("direct") ? 30 : (routeType.equals("alternate1") ? 10 : 18);
        } else {
            baseDelay = routeType.equals("direct") ? 5 : (routeType.equals("alternate1") ? 2 : 4);
        }
        
        return baseDelay;
    }
    
    private String classifyCongestion(double delay) {
        if (delay > 20) return "HIGH";
        if (delay > 10) return "MEDIUM";
        return "LOW";
    }
    
    private double calculateRouteScore(double delay) {
        // Score based on delay (higher is better)
        // Max score 100 when delay is 0, decreases with more delay
        return Math.max(0, 100 - (delay * 2));
    }
    
    private List<String> identifyHeavyTrafficZones(RouteRequestDto request) {
        // In production, this would analyze traffic data
        // For now, returning simulated zones
        List<String> zones = new ArrayList<>();
        
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour >= 8 && hour <= 10) {
            zones.addAll(List.of("MG Road", "Balmatta", "Falnir Road"));
        } else if (hour >= 17 && hour <= 19) {
            zones.addAll(List.of("Konebettu Junction", "Hampankatta", "Main Bridge"));
        }
        
        return zones;
    }
    
    private double calculateCongestionPercentage(RouteAnalysisDto route) {
        if ("HIGH".equals(route.getCongestionLevel())) return 75.0;
        if ("MEDIUM".equals(route.getCongestionLevel())) return 50.0;
        return 25.0;
    }
}
