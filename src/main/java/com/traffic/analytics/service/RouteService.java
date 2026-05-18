package com.traffic.analytics.service;

import com.traffic.analytics.dto.RouteAnalysisDto;
import com.traffic.analytics.dto.RouteRequestDto;
import com.traffic.analytics.dto.RouteResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {
    
    private final TrafficDataService trafficDataService;
    private final GeminiAiService geminiAiService;
    private final RestTemplate restTemplate;
    
    @Value("${tomtom.api.key:}")
    private String tomtomApiKey;
    
    public RouteResponseDto analyzeRoute(RouteRequestDto request) {
        // Fetch only real routes from TomTom - no mock data
        List<RouteAnalysisDto> routes = fetchTomTomRoutes(request);
        
        // Find best route based on score
        RouteAnalysisDto bestRoute = routes.stream()
            .max(Comparator.comparingDouble(RouteAnalysisDto::getRouteScore))
            .orElseThrow(() -> new RuntimeException("No valid routes available"));
        
        bestRoute.setOptimal(true); // Mark the best route as optimal
        
        // Get AI recommendation from Gemini using real route data
        double congestionPercentage = calculateCongestionPercentage(bestRoute);
        String aiRecommendation = geminiAiService.getRouteRecommendation(
            request.getStartLocation(),
            request.getEndLocation(),
            bestRoute.getHeavyTrafficZones(),
            congestionPercentage,
            bestRoute.getEstimatedDelay()
        );
        
        bestRoute.setRecommendation(aiRecommendation);
        
        return RouteResponseDto.builder()
            .startLocation(request.getStartLocation())
            .endLocation(request.getEndLocation())
            .routes(routes)
            .bestRoute(bestRoute)
            .aiRecommendation(aiRecommendation)
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    private List<RouteAnalysisDto> fetchTomTomRoutes(RouteRequestDto request) {
        if (tomtomApiKey == null || tomtomApiKey.isEmpty()) {
            throw new RuntimeException("TomTom API key is not configured. Set TOMTOM_API_KEY environment variable.");
        }
        
        List<String> routeTypes = List.of("fastest", "shortest", "eco");
        List<RouteAnalysisDto> routes = new ArrayList<>();
        
        for (String routeType : routeTypes) {
            RouteAnalysisDto route = fetchTomTomRoute(request, routeType);
            if (route != null) {
                routes.add(route);
            }
        }
        
        if (routes.isEmpty()) {
            throw new RuntimeException("Failed to fetch routes from TomTom API. Please check your coordinates and TomTom API key.");
        }
        
        return routes;
    }
    
    @SuppressWarnings("unchecked")
    private RouteAnalysisDto fetchTomTomRoute(RouteRequestDto request, String routeType) {
        try {
            String url = String.format(java.util.Locale.US,
                "https://api.tomtom.com/routing/1/calculateRoute/%f,%f:%f,%f/json?travelMode=car&routeType=%s&traffic=true&computeTravelTimeFor=all&key=%s",
                request.getStartLat(), request.getStartLon(),
                request.getEndLat(), request.getEndLon(),
                routeType,
                tomtomApiKey
            );
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null) {
                return null;
            }
            List<Map<String, Object>> tomTomRoutes = (List<Map<String, Object>>) response.get("routes");
            if (tomTomRoutes == null || tomTomRoutes.isEmpty()) {
                return null;
            }
            Map<String, Object> route = tomTomRoutes.get(0);
            Map<String, Object> summary = (Map<String, Object>) route.get("summary");
            if (summary == null) {
                return null;
            }
            double lengthKm = ((Number) summary.get("lengthInMeters")).doubleValue() / 1000.0;
            double travelTimeMin = ((Number) summary.get("travelTimeInSeconds")).doubleValue() / 60.0;
            double delayMin = 0;
            if (summary.containsKey("trafficDelayInSeconds")) {
                delayMin = ((Number) summary.get("trafficDelayInSeconds")).doubleValue() / 60.0;
            } else if (summary.containsKey("freeFlowTravelTimeInSeconds")) {
                double freeFlowMin = ((Number) summary.get("freeFlowTravelTimeInSeconds")).doubleValue() / 60.0;
                delayMin = Math.max(0, travelTimeMin - freeFlowMin);
            }
            
            String congestionLevel = classifyCongestion(travelTimeMin, delayMin);
            return RouteAnalysisDto.builder()
                .routeId("route_" + routeType + "_" + System.currentTimeMillis())
                .routeName(mapRouteTypeLabel(routeType))
                .distance(Math.round(lengthKm * 10.0) / 10.0)
                .estimatedTime(Math.round(travelTimeMin * 10.0) / 10.0)
                .estimatedDelay(Math.round(delayMin * 10.0) / 10.0)
                .congestionLevel(congestionLevel)
                .heavyTrafficZones(buildHeavyTrafficZones(delayMin, routeType))
                .alternativeRoutes(getAlternativeRouteNames(routeType))
                .routeScore(calculateRouteScore(travelTimeMin, delayMin))
                .isOptimal(false)
                .build();
        } catch (Exception e) {
            System.err.println("Error fetching route from TomTom API: " + e.getMessage());
            return null;
        }
    }
    
    private String mapRouteTypeLabel(String routeType) {
        return switch (routeType) {
            case "shortest" -> "Shortest Route";
            case "eco" -> "Eco Route";
            default -> "Fastest Route";
        };
    }
    
    private String classifyCongestion(double travelTime, double delay) {
        if (delay > 20 || (travelTime > 0 && delay / travelTime > 0.25)) return "HIGH";
        if (delay > 10 || (travelTime > 0 && delay / travelTime > 0.15)) return "MEDIUM";
        return "LOW";
    }
    
    private double calculateRouteScore(double travelTime, double delay) {
        return Math.max(0, 100 - (delay * 2) - (travelTime * 0.15));
    }
    
    private double calculateCongestionPercentage(RouteAnalysisDto route) {
        if ("HIGH".equals(route.getCongestionLevel())) return 75.0;
        if ("MEDIUM".equals(route.getCongestionLevel())) return 50.0;
        return 25.0;
    }

    private List<String> buildHeavyTrafficZones(double delayMin, String routeType) {
        List<String> zones = new ArrayList<>();
        if (delayMin > 5) {
            zones.add("Major intersection delay detected");
        }
        if (delayMin > 15) {
            zones.add("Severe congestion on primary road");
        }
        return zones;
    }

    private List<String> getAlternativeRouteNames(String routeType) {
        return List.of();
    }
}
