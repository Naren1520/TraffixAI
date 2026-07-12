package com.traffic.analytics.service;

import com.traffic.analytics.dto.TrafficDataDto;
import com.traffic.analytics.model.TrafficData;
import com.traffic.analytics.repository.TrafficDataRepository;
import com.traffic.analytics.mapper.TrafficMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrafficDataService {

    private final TrafficDataRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final TrafficMapper mapper;

    /**
     * Saves a traffic data point. userId tags the record to a specific user session.
     * Pass null for the global/shared monitor (unauthenticated fallback).
     */
    public TrafficDataDto addTrafficData(TrafficDataDto dto) {
        TrafficData data = mapper.toEntity(dto);
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        TrafficData saved = repository.save(data);
        TrafficDataDto savedDto = mapper.toDto(saved);

        // Broadcast to all WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/traffic", savedDto);
        return savedDto;
    }

    /**
     * Returns all traffic data, optionally filtered by city name in roadId.
     * If userId is provided, only returns that user's data.
     */
    public List<TrafficDataDto> getAllTrafficData(String city, String userId) {
        List<TrafficData> data;

        if (userId != null && !userId.isEmpty()) {
            data = (city != null && !city.isEmpty())
                    ? repository.findByUserIdAndRoadIdContainingIgnoreCase(userId, city)
                    : repository.findByUserId(userId);
        } else {
            data = (city != null && !city.isEmpty())
                    ? repository.findByRoadIdContainingIgnoreCase(city)
                    : repository.findAll();
        }

        return data.stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public List<TrafficDataDto> getTrafficDataByRoadId(String roadId) {
        return repository.findByRoadId(roadId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}
