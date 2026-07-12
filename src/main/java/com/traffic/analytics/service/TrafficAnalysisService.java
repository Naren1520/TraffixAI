package com.traffic.analytics.service;

import com.traffic.analytics.dto.RoadTrafficSummaryDto;
import com.traffic.analytics.model.TrafficData;
import com.traffic.analytics.repository.TrafficDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrafficAnalysisService {

    private final TrafficDataRepository repository;
    private final TrafficSortingService sortingService;

    // ── helpers ────────────────────────────────────────────────────────────────

    private List<TrafficData> fetch(String city, String userId) {
        if (userId != null && !userId.isEmpty()) {
            return (city != null && !city.isEmpty())
                    ? repository.findByUserIdAndRoadIdContainingIgnoreCase(userId, city)
                    : repository.findByUserId(userId);
        }
        return (city != null && !city.isEmpty())
                ? repository.findByRoadIdContainingIgnoreCase(city)
                : repository.findAll();
    }

    // ── public API ─────────────────────────────────────────────────────────────

    public Map<String, Object> getPeakTrafficHour(String city, String userId) {
        List<TrafficData> data = fetch(city, userId);
        if (data == null || data.isEmpty()) {
            return Map.of("message", "No traffic data available");
        }

        LocalDate today = LocalDate.now();
        Map<Integer, Integer> byHour = data.stream()
                .filter(d -> d.getTimestamp() != null
                        && d.getTimestamp().toLocalDate().isEqual(today))
                .collect(Collectors.groupingBy(
                        d -> d.getTimestamp().getHour(),
                        Collectors.summingInt(TrafficData::getVehicleCount)
                ));

        if (byHour.isEmpty()) {
            return Map.of("message", "No timestamp data available to calculate peak hours");
        }

        return byHour.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> Map.<String, Object>of(
                        "peakHour", e.getKey(),
                        "totalVehicleCount", e.getValue()))
                .orElse(Map.of("message", "Could not calculate peak hour"));
    }

    public List<RoadTrafficSummaryDto> getTopBusiestRoads(String city, String userId) {
        return buildSummaries(fetch(city, userId), false);
    }

    public List<RoadTrafficSummaryDto> getLeastBusiestRoads(String city, String userId) {
        return buildSummaries(fetch(city, userId), true);
    }

    // ── private ────────────────────────────────────────────────────────────────

    private List<RoadTrafficSummaryDto> buildSummaries(List<TrafficData> data, boolean ascending) {
        if (data == null || data.isEmpty()) return new ArrayList<>();

        List<RoadTrafficSummaryDto> summaries = data.stream()
                .filter(d -> d.getRoadId() != null)
                .collect(Collectors.groupingBy(TrafficData::getRoadId,
                        Collectors.summingInt(TrafficData::getVehicleCount)))
                .entrySet().stream()
                .map(e -> new RoadTrafficSummaryDto(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        List<RoadTrafficSummaryDto> sorted = sortingService.mergeSortSummaries(summaries);
        if (ascending) Collections.reverse(sorted);
        return sorted.stream().limit(5).collect(Collectors.toList());
    }
}
