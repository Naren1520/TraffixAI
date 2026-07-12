package com.traffic.analytics.controller;

import com.traffic.analytics.ratelimit.RateLimit;
import com.traffic.analytics.service.RealTimeTrafficMonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveTrafficController {

    private final RealTimeTrafficMonitorService monitorService;

    @RateLimit
    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startMonitoring(Authentication auth) {
        String userId = (auth != null && auth.isAuthenticated()) ? (String) auth.getPrincipal() : null;
        monitorService.startMonitoring(userId);
        return ResponseEntity.ok(Map.of("message", "Real-time traffic monitoring started."));
    }

    @RateLimit
    @PostMapping("/stop")
    public ResponseEntity<Map<String, String>> stopMonitoring() {
        monitorService.stopMonitoring();
        return ResponseEntity.ok(Map.of("message", "Real-time traffic monitoring stopped."));
    }

    @RateLimit
    @PostMapping("/location")
    public ResponseEntity<Map<String, String>> setLocation(
            @RequestParam String name,
            @RequestParam double lat,
            @RequestParam double lon) {
        monitorService.updateLocation(name, lat, lon);
        return ResponseEntity.ok(Map.of("message", "Monitoring location updated to " + name));
    }
}
