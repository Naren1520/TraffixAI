package com.traffic.analytics.service;

import com.traffic.analytics.dto.TrafficAlertDto;
import com.traffic.analytics.model.TrafficData;
import com.traffic.analytics.repository.TrafficDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
public class TrafficAlertService {

    private final TrafficDataRepository repository;

    public List<TrafficAlertDto> getTrafficAlerts(String city, String userId) {
        // Pull all high-load records first, then filter by user + city
        List<TrafficData> all = repository
                .findByVehicleCountGreaterThanOrAvgSpeedLessThan(120, 20.0);

        List<TrafficAlertDto> alerts = new ArrayList<>();

        for (TrafficData data : all) {
            // User isolation — skip records that belong to a different user
            if (userId != null && !userId.isEmpty()) {
                if (!userId.equals(data.getUserId())) continue;
            }

            // City filter
            if (city != null && !city.isEmpty() && data.getRoadId() != null) {
                if (!data.getRoadId().toLowerCase().contains(city.toLowerCase())) continue;
            }

            StringJoiner reason = new StringJoiner(" & ");
            if (data.getVehicleCount() > 120)
                reason.add("High vehicle count (" + data.getVehicleCount() + ")");
            if (data.getAvgSpeed() < 20)
                reason.add("Low average speed (" + String.format("%.2f", data.getAvgSpeed()) + " km/h)");

            alerts.add(TrafficAlertDto.builder()
                    .roadId(data.getRoadId())
                    .timestamp(data.getTimestamp())
                    .vehicleCount(data.getVehicleCount())
                    .avgSpeed(data.getAvgSpeed())
                    .alertReason(reason.toString())
                    .build());
        }
        return alerts;
    }
}
