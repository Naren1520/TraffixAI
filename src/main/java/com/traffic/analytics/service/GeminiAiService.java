package com.traffic.analytics.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiAiService {
    
    @Value("${gemini.api.key:}")
    private String geminiApiKey;
    
    private final RestTemplate restTemplate;
    
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    
    public String getRouteRecommendation(String startLocation, String endLocation, 
                                        List<String> heavyTrafficZones, 
                                        double congestionPercentage,
                                        double estimatedDelay) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return getDefaultRecommendation(startLocation, endLocation, heavyTrafficZones, 
                                           congestionPercentage, estimatedDelay);
        }
        
        try {
            String prompt = buildPrompt(startLocation, endLocation, heavyTrafficZones, 
                                       congestionPercentage, estimatedDelay);
            
            Map<String, Object> request = buildGeminiRequest(prompt);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            Map<String, Object> response = restTemplate.postForObject(
                GEMINI_API_URL + "?key=" + geminiApiKey,
                entity,
                Map.class
            );
            
            return extractTextFromResponse(response);
        } catch (Exception e) {
            return getDefaultRecommendation(startLocation, endLocation, heavyTrafficZones, 
                                           congestionPercentage, estimatedDelay);
        }
    }
    
    private String buildPrompt(String startLocation, String endLocation, 
                              List<String> heavyTrafficZones, 
                              double congestionPercentage,
                              double estimatedDelay) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a traffic navigation expert. Provide a brief, actionable recommendation for a driver.\n");
        prompt.append("Route: From ").append(startLocation).append(" to ").append(endLocation).append("\n");
        prompt.append("Heavy traffic zones on this route: ").append(String.join(", ", heavyTrafficZones)).append("\n");
        prompt.append("Overall congestion: ").append(String.format("%.1f%%", congestionPercentage)).append("\n");
        prompt.append("Estimated delay: ").append(String.format("%.0f minutes", estimatedDelay)).append("\n");
        prompt.append("Provide a brief recommendation (2-3 sentences) including:\n");
        prompt.append("1. Whether to take this route\n");
        prompt.append("2. Best time to travel\n");
        prompt.append("3. Alternative suggestion if applicable\n");
        prompt.append("Keep response practical and concise.");
        
        return prompt.toString();
    }
    
    private Map<String, Object> buildGeminiRequest(String prompt) {
        Map<String, Object> request = new HashMap<>();
        
        List<Map<String, Object>> contents = List.of(
            Map.of(
                "parts", List.of(
                    Map.of("text", prompt)
                )
            )
        );
        
        request.put("contents", contents);
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topP", 0.95);
        generationConfig.put("topK", 40);
        generationConfig.put("maxOutputTokens", 500);
        
        request.put("generationConfig", generationConfig);
        
        return request;
    }
    
    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        if (response == null) {
            return null;
        }
        
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
            if (content != null) {
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return parts.get(0).get("text");
                }
            }
        }
        
        return null;
    }
    
    private String getDefaultRecommendation(String startLocation, String endLocation, 
                                           List<String> heavyTrafficZones,
                                           double congestionPercentage,
                                           double estimatedDelay) {
        StringBuilder recommendation = new StringBuilder();
        
        if (congestionPercentage > 70) {
            recommendation.append("⚠️ High congestion expected on this route (").append(String.format("%.0f%%", congestionPercentage)).append("). ");
            recommendation.append("Heavy traffic zones: ").append(String.join(", ", heavyTrafficZones)).append(". ");
            recommendation.append("Expected delay: ").append(String.format("%.0f minutes", estimatedDelay)).append(". ");
            recommendation.append("Consider leaving earlier or using alternative routes if available. ");
            recommendation.append("Best time to travel: Before 8 AM or after 10 PM for optimal flow.");
        } else if (congestionPercentage > 40) {
            recommendation.append("⚡ Moderate traffic on this route (").append(String.format("%.0f%%", congestionPercentage)).append("). ");
            recommendation.append("Watch out near: ").append(String.join(", ", heavyTrafficZones)).append(". ");
            recommendation.append("Estimated additional delay: ").append(String.format("%.0f minutes", estimatedDelay)).append(". ");
            recommendation.append("Route is acceptable but allow extra time for your journey.");
        } else {
            recommendation.append("✅ Light traffic on this route (").append(String.format("%.0f%%", congestionPercentage)).append("). ");
            recommendation.append("This is an excellent time to travel. ");
            recommendation.append("Estimated smooth flow with minimal delays. ");
            recommendation.append("Safe travels!");
        }
        
        return recommendation.toString();
    }
}
