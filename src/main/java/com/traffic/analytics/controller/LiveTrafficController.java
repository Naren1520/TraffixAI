package com.traffic.analytics.controller;

import com.traffic.analytics.service.RealTimeTrafficMonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveTrafficController {

    private final RealTimeTrafficMonitorService monitorService;

    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startMonitoring() {
        monitorService.startMonitoring();
        return ResponseEntity.ok(Map.of("message", "Real-time traffic monitoring started."));
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, String>> stopMonitoring() {
        monitorService.stopMonitoring();
        return ResponseEntity.ok(Map.of("message", "Real-time traffic monitoring stopped."));
    }

    @PostMapping("/location")
    public ResponseEntity<Map<String, String>> setLocation(
            @RequestParam String name, 
            @RequestParam double lat, 
            @RequestParam double lon) {
        monitorService.updateLocation(name, lat, lon);
        return ResponseEntity.ok(Map.of("message", "Monitoring location updated to " + name));
    }
}
