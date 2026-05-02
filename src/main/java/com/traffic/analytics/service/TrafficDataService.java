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

    public TrafficDataDto addTrafficData(TrafficDataDto dto) {
        TrafficData data = mapper.toEntity(dto);
        if (data.getTimestamp() == null) {
            data.setTimestamp(LocalDateTime.now());
        }
        TrafficData savedData = repository.save(data);
        TrafficDataDto savedDto = mapper.toDto(savedData);
        
        // Broadcast the newly added data to all subscribers listening to /topic/traffic
        messagingTemplate.convertAndSend("/topic/traffic", savedDto);
        
        return savedDto;
    }

    public List<TrafficDataDto> getAllTrafficData() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public List<TrafficDataDto> getTrafficDataByRoadId(String roadId) {
        return repository.findByRoadId(roadId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}
