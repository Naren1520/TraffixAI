package com.traffic.analytics.controller;

import com.traffic.analytics.service.RealTimeTrafficMonitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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
}
