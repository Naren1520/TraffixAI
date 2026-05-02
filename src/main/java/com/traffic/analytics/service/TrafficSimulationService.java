package com.traffic.analytics.service;

import com.traffic.analytics.dto.TrafficDataDto;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TrafficSimulationService {

    private final TrafficDataService trafficDataService;
    private boolean isRunning = false;

    private final List<String> predefinedRoads = List.of(
            "ROAD_NORTH", "ROAD_SOUTH", "ROAD_EAST", "ROAD_WEST", "HIGHWAY_1"
    );
    private final Random random = new Random();

    public void startSimulation() {
        this.isRunning = true;
    }

    public void stopSimulation() {
        this.isRunning = false;
    }

    @Scheduled(fixedRate = 3000)
    public void simulateTrafficData() {
        if (!isRunning) {
            return;
        }

        String roadId = predefinedRoads.get(random.nextInt(predefinedRoads.size()));
        int vehicleCount = 10 + random.nextInt(141);
        double avgSpeed = 20 + (40 * random.nextDouble());

        TrafficDataDto dto = TrafficDataDto.builder()
                .roadId(roadId)
                .vehicleCount(vehicleCount)
                .avgSpeed(avgSpeed)
                .timestamp(LocalDateTime.now())
                .build();

        trafficDataService.addTrafficData(dto);
        System.out.println("Simulated Data saved: " + roadId + " | Count: " + vehicleCount);
    }
}
