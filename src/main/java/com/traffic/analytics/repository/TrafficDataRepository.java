package com.traffic.analytics.repository;

import com.traffic.analytics.model.TrafficData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficDataRepository extends MongoRepository<TrafficData, String> {

    // Find by exact roadId
    List<TrafficData> findByRoadId(String roadId);

    // City filter — roadId contains city name (case-insensitive via regex query)
    List<TrafficData> findByRoadIdContainingIgnoreCase(String city);

    // For alerts — high congestion or low speed
    List<TrafficData> findByVehicleCountGreaterThanOrAvgSpeedLessThan(int vehicleCount, double avgSpeed);

    // User-isolated queries
    List<TrafficData> findByUserId(String userId);
    List<TrafficData> findByUserIdAndRoadIdContainingIgnoreCase(String userId, String city);
    List<TrafficData> findByUserIdAndVehicleCountGreaterThanOrUserIdAndAvgSpeedLessThan(
            String userId1, int vehicleCount, String userId2, double avgSpeed);
}
