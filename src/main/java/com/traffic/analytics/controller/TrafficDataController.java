package com.traffic.analytics.controller;

import com.traffic.analytics.dto.RoadTrafficSummaryDto;
import com.traffic.analytics.dto.TrafficAlertDto;
import com.traffic.analytics.dto.TrafficDataDto;
import com.traffic.analytics.service.TrafficAlertService;
import com.traffic.analytics.service.TrafficAnalysisService;
import com.traffic.analytics.service.TrafficClassificationService;
import com.traffic.analytics.service.TrafficDataService;
import com.traffic.analytics.service.TrafficSortingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/traffic")
@RequiredArgsConstructor
public class TrafficDataController {

    private final TrafficDataService service;
    private final TrafficSortingService sortingService;
    private final TrafficClassificationService classificationService;
    private final TrafficAnalysisService analysisService;
    private final TrafficAlertService alertService;

    @PostMapping("/add")
    public ResponseEntity<TrafficDataDto> addTrafficData(@RequestBody TrafficDataDto trafficDataDto) {
        TrafficDataDto savedData = service.addTrafficData(trafficDataDto);
        classificationService.classify(savedData);
        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TrafficDataDto>> getAllTrafficData() {
        return ResponseEntity.ok(classificationService.classifyList(service.getAllTrafficData()));
    }

    @GetMapping("/road/{roadId}")
    public ResponseEntity<List<TrafficDataDto>> getTrafficDataByRoad(@PathVariable String roadId) {
        return ResponseEntity.ok(classificationService.classifyList(service.getTrafficDataByRoadId(roadId)));
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<TrafficDataDto>> getSortedTrafficData() {
        return ResponseEntity.ok(classificationService.classifyList(sortingService.getSortedTrafficData()));
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<Map<String, Object>> getPeakTrafficHours() {
        return ResponseEntity.ok(analysisService.getPeakTrafficHour());
    }

    @GetMapping("/top-roads")
    public ResponseEntity<List<RoadTrafficSummaryDto>> getTopBusiestRoads() {
        return ResponseEntity.ok(analysisService.getTopBusiestRoads());
    }

    @GetMapping("/least-roads")
    public ResponseEntity<List<RoadTrafficSummaryDto>> getLeastBusiestRoads() {
        return ResponseEntity.ok(analysisService.getLeastBusiestRoads());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<TrafficAlertDto>> getTrafficAlerts() {
        return ResponseEntity.ok(alertService.getTrafficAlerts());
    }
}
