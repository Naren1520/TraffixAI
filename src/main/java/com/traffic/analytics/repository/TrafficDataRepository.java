package com.traffic.analytics.repository;

import com.traffic.analytics.model.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficDataRepository extends JpaRepository<TrafficData, Long> {
    List<TrafficData> findByRoadId(String roadId);
    List<TrafficData> findByRoadIdContainingIgnoreCase(String city);
    List<TrafficData> findByVehicleCountGreaterThanOrAvgSpeedLessThan(int vehicleCount, double avgSpeed);
}
