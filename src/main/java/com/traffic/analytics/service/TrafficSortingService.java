package com.traffic.analytics.service;

import com.traffic.analytics.dto.RoadTrafficSummaryDto;
import com.traffic.analytics.dto.TrafficDataDto;
import com.traffic.analytics.mapper.TrafficMapper;
import com.traffic.analytics.model.TrafficData;
import com.traffic.analytics.repository.TrafficDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrafficSortingService {

    private final TrafficDataRepository repository;
    private final TrafficMapper mapper;

    public List<TrafficDataDto> getSortedTrafficData(String city) {
        List<TrafficData> data = (city != null && !city.isEmpty()) ? 
                repository.findByRoadIdContainingIgnoreCase(city) : repository.findAll();
        if (data == null || data.isEmpty()) {
            return new ArrayList<>();
        }
        List<TrafficDataDto> dtos = data.stream().map(mapper::toDto).collect(Collectors.toList());
        return mergeSort(dtos);
    }

    public List<TrafficDataDto> mergeSort(List<TrafficDataDto> list) {
        if (list.size() <= 1) {
            return list;
        }

        int mid = list.size() / 2;
        List<TrafficDataDto> left = new ArrayList<>(list.subList(0, mid));
        List<TrafficDataDto> right = new ArrayList<>(list.subList(mid, list.size()));

        left = mergeSort(left);
        right = mergeSort(right);

        return merge(left, right);
    }

    private List<TrafficDataDto> merge(List<TrafficDataDto> left, List<TrafficDataDto> right) {
        List<TrafficDataDto> merged = new ArrayList<>(left.size() + right.size());
        int i = 0, j = 0;

        while (i < left.size() && j < right.size()) {
            if (left.get(i).getVehicleCount() >= right.get(j).getVehicleCount()) {
                merged.add(left.get(i));
                i++;
            } else {
                merged.add(right.get(j));
                j++;
            }
        }

        while (i < left.size()) {
            merged.add(left.get(i));
            i++;
        }

        while (j < right.size()) {
            merged.add(right.get(j));
            j++;
        }

        return merged;
    }

    public List<RoadTrafficSummaryDto> mergeSortSummaries(List<RoadTrafficSummaryDto> list) {
        if (list.size() <= 1) {
            return list;
        }

        int mid = list.size() / 2;
        List<RoadTrafficSummaryDto> left = new ArrayList<>(list.subList(0, mid));
        List<RoadTrafficSummaryDto> right = new ArrayList<>(list.subList(mid, list.size()));

        left = mergeSortSummaries(left);
        right = mergeSortSummaries(right);

        return mergeSummaries(left, right);
    }

    private List<RoadTrafficSummaryDto> mergeSummaries(List<RoadTrafficSummaryDto> left, List<RoadTrafficSummaryDto> right) {
        List<RoadTrafficSummaryDto> merged = new ArrayList<>(left.size() + right.size());
        int i = 0, j = 0;

        while (i < left.size() && j < right.size()) {
            if (left.get(i).getTotalVehicleCount() >= right.get(j).getTotalVehicleCount()) {
                merged.add(left.get(i));
                i++;
            } else {
                merged.add(right.get(j));
                j++;
            }
        }

        while (i < left.size()) {
            merged.add(left.get(i));
            i++;
        }

        while (j < right.size()) {
            merged.add(right.get(j));
            j++;
        }

        return merged;
    }
}
