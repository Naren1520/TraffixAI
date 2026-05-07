package com.traffic.analytics.controller;

import com.traffic.analytics.dto.RouteRequestDto;
import com.traffic.analytics.dto.RouteResponseDto;
import com.traffic.analytics.service.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/route")
@RequiredArgsConstructor
public class RouteController {
    
    private final RouteService routeService;
    
    @PostMapping("/analyze")
    public ResponseEntity<RouteResponseDto> analyzeRoute(@RequestBody RouteRequestDto request) {
        try {
            log.info("Analyzing route from {} to {}", request.getStartLocation(), request.getEndLocation());
            RouteResponseDto response = routeService.analyzeRoute(request);
            log.info("Route analysis completed successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error analyzing route", e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Route Analysis Service is running");
    }
}
