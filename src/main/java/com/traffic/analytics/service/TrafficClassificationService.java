package com.traffic.analytics.service;

import com.traffic.analytics.dto.TrafficDataDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrafficClassificationService {

    /**
     * Classifies a single TrafficDataDto object and sets the congestion level.
     */
    public void classify(TrafficDataDto data) {
        if (data == null) {
            return;
        }
        
        int count = data.getVehicleCount();
        if (count < 50) {
            data.setCongestionLevel("LOW");
        } else if (count <= 100) {
            data.setCongestionLevel("MEDIUM");
        } else {
            data.setCongestionLevel("HIGH");
        }
    }

    /**
     * Classifies a list of TrafficDataDto objects.
     */
    public List<TrafficDataDto> classifyList(List<TrafficDataDto> dataList) {
        if (dataList != null) {
            dataList.forEach(this::classify);
        }
        return dataList;
    }
}
