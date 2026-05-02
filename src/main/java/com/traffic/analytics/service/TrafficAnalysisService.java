package com.traffic.analytics.service;

import com.traffic.analytics.dto.RoadTrafficSummaryDto;
import com.traffic.analytics.dto.TrafficDataDto;
import com.traffic.analytics.model.TrafficData;
import com.traffic.analytics.repository.TrafficDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrafficAnalysisService {

    private final TrafficDataRepository repository;
    private final TrafficSortingService sortingService;

    /**
     * Calculates the peak traffic hour.
     */
    public Map<String, Object> getPeakTrafficHour() {
        List<TrafficData> data = repository.findAll();

        if (data == null || data.isEmpty()) {
            return Map.of("message", "No traffic data available");
        }

        Map<Integer, Integer> trafficByHour = data.stream()
                .filter(d -> d.getTimestamp() != null)
                .collect(Collectors.groupingBy(
                        d -> d.getTimestamp().getHour(),
                        Collectors.summingInt(TrafficData::getVehicleCount)
                ));

        if (trafficByHour.isEmpty()) {
            return Map.of("message", "No timestamp data available to calculate peak hours");
        }

        Map.Entry<Integer, Integer> peakHourEntry = trafficByHour.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        if (peakHourEntry != null) {
            return Map.of(
                    "peakHour", peakHourEntry.getKey(),
                    "totalVehicleCount", peakHourEntry.getValue()
            );
        }

        return Map.of("message", "Could not calculate peak hour");
    }

    /**
     * Groups data by road, calculates total vehicles, sorts using Merge Sort, and returns top 5.
     */
    public List<RoadTrafficSummaryDto> getTopBusiestRoads() {
        List<TrafficData> data = repository.findAll();

        if (data == null || data.isEmpty()) {
            return new ArrayList<>();
        }

        Map<String, Integer> trafficByRoad = data.stream()
                .filter(d -> d.getRoadId() != null)
                .collect(Collectors.groupingBy(
                        TrafficData::getRoadId,
                        Collectors.summingInt(TrafficData::getVehicleCount)
                ));

        List<RoadTrafficSummaryDto> summaries = trafficByRoad.entrySet().stream()
                .map(entry -> new RoadTrafficSummaryDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        List<RoadTrafficSummaryDto> sortedSummaries = sortingService.mergeSortSummaries(summaries);

        return sortedSummaries.stream()
                .limit(5)
                .collect(Collectors.toList());
    }
}
