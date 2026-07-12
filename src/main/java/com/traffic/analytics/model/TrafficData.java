package com.traffic.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

/**
 * Traffic data point captured from TomTom API every 15 seconds.
 *
 * TTL index: MongoDB auto-deletes documents 24 hours after 'timestamp'.
 * userId: isolates each user's monitoring session — null for unauthenticated/shared data.
 */
@Document(collection = "traffic_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrafficData {

    @Id
    private String id;

    // Which user triggered this monitoring session (null = global/shared)
    @Indexed
    private String userId;

    private String roadId;
    private int vehicleCount;
    private double avgSpeed;

    // TTL index — MongoDB deletes this document 86400 seconds (24h) after this field
    @Indexed(expireAfterSeconds = 86400)
    private LocalDateTime timestamp;
}
