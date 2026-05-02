package com.traffic.analytics.controller;

import com.traffic.analytics.service.TrafficSimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/sim")
@RequiredArgsConstructor
public class SimulationController {

    private final TrafficSimulationService simulationService;

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startSimulation() {
        simulationService.startSimulation();
        return ResponseEntity.ok(Map.of("message", "Traffic simulation started. Generating data every 3 seconds."));
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, String>> stopSimulation() {
        simulationService.stopSimulation();
        return ResponseEntity.ok(Map.of("message", "Traffic simulation stopped."));
    }
}
