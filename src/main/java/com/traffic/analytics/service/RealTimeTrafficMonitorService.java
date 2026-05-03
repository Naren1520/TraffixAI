package com.traffic.analytics.service;

import com.traffic.analytics.dto.TrafficDataDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RealTimeTrafficMonitorService {

    private final TrafficDataService trafficDataService;
    private final RestTemplate restTemplate = new RestTemplate();
    private boolean isMonitoring = false;

    @Value("${tomtom.api.key}")
    private String apiKey;

    // Mangalore road coordinates
    private final Map<String, String> mangaloreRoads = Map.of(
            "MG Road", "12.8711,74.8427",
            "Hampankatta", "12.8702,74.8451",
            "Kankanady", "12.8687,74.8436",
            "Panambur", "12.8809,74.8239"
    );

    public void startMonitoring() {
        this.isMonitoring = true;
    }

    public void stopMonitoring() {
        this.isMonitoring = false;
    }

    @Scheduled(fixedRate = 15000)
    public void fetchRealTrafficData() {
        if (!isMonitoring) return;

        for (Map.Entry<String, String> entry : mangaloreRoads.entrySet()) {
            try {
                String roadId = entry.getKey();
                String coordinates = entry.getValue();
                
                String url = String.format("https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=%s&unit=KMPH&key=%s", coordinates, apiKey);
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                
                if (response != null && response.containsKey("flowSegmentData")) {
                    Map<String, Object> flowData = (Map<String, Object>) response.get("flowSegmentData");
                    double currentSpeed = Double.parseDouble(flowData.get("currentSpeed").toString());
                    int travelTime = Integer.parseInt(flowData.get("currentTravelTime").toString());
                    
                    // Estimate vehicle count inversely proportional to speed
                    int vehicleCount = (int) Math.max(10, 150 - currentSpeed);

                    TrafficDataDto dto = TrafficDataDto.builder()
                            .roadId(roadId)
                            .vehicleCount(vehicleCount)
                            .avgSpeed(currentSpeed)
                            .timestamp(LocalDateTime.now())
                            .build();

                    trafficDataService.addTrafficData(dto);
                    System.out.println("Live TomTom Data updated: " + roadId + " | Speed: " + currentSpeed + " km/h");
                }
            } catch (Exception e) {
                System.err.println("Error fetching TomTom data for " + entry.getKey() + ": " + e.getMessage());
            }
        }
    }
}
