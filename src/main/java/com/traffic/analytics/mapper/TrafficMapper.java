package com.traffic.analytics.mapper;

import com.traffic.analytics.dto.TrafficDataDto;
import com.traffic.analytics.model.TrafficData;
import org.springframework.stereotype.Component;

@Component
public class TrafficMapper {

    public TrafficDataDto toDto(TrafficData entity) {
        if (entity == null) {
            return null;
        }
        return TrafficDataDto.builder()
                .id(entity.getId())
                .roadId(entity.getRoadId())
                .vehicleCount(entity.getVehicleCount())
                .avgSpeed(entity.getAvgSpeed())
                .timestamp(entity.getTimestamp())
                .build();
    }

    public TrafficData toEntity(TrafficDataDto dto) {
        if (dto == null) {
            return null;
        }
        return TrafficData.builder()
                .id(dto.getId())
                .roadId(dto.getRoadId())
                .vehicleCount(dto.getVehicleCount())
                .avgSpeed(dto.getAvgSpeed())
                .timestamp(dto.getTimestamp())
                .build();
    }
}
