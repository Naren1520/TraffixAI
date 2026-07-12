package com.traffic.analytics.service;

import com.traffic.analytics.dto.GoogleAuthRequestDto;
import com.traffic.analytics.dto.UserResponseDto;
import com.traffic.analytics.model.AppUser;
import com.traffic.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private static final String TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token={idToken}";

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;

    @Value("${GOOGLE_AUTH_CLIENT_ID:}")
    private String googleClientId;

    public UserResponseDto authenticate(GoogleAuthRequestDto request) {
        Map<String, Object> tokenInfo;
        try {
            tokenInfo = restTemplate.getForObject(TOKEN_INFO_URL, Map.class, request.getIdToken());
        } catch (RestClientException ex) {
            throw new IllegalArgumentException("Invalid Google id token", ex);
        }

        if (tokenInfo == null || tokenInfo.isEmpty()) {
            throw new IllegalArgumentException("Invalid Google id token");
        }

        String issuer = String.valueOf(tokenInfo.get("iss"));
        if (!"accounts.google.com".equals(issuer) && !"https://accounts.google.com".equals(issuer)) {
            throw new IllegalArgumentException("Invalid token issuer");
        }

        if (googleClientId != null && !googleClientId.isBlank()) {
            String audience = String.valueOf(tokenInfo.get("aud"));
            if (!googleClientId.equals(audience)) {
                throw new IllegalArgumentException("Token audience does not match client id");
            }
        }

        String googleId = String.valueOf(tokenInfo.get("sub"));
        String email = String.valueOf(tokenInfo.get("email"));
        String name = String.valueOf(tokenInfo.get("name"));
        String picture = String.valueOf(tokenInfo.get("picture"));
        String locale = String.valueOf(tokenInfo.get("locale"));
        boolean emailVerified = Boolean.parseBoolean(String.valueOf(tokenInfo.get("email_verified")));

        if (googleId == null || googleId.isBlank()) {
            throw new IllegalArgumentException("Google token missing user id");
        }

        AppUser appUser = userRepository.findByGoogleId(googleId)
            .orElse(AppUser.builder()
                .googleId(googleId)
                .email(email)
                .build());

        appUser.setName(name);
        appUser.setPictureUrl(picture);
        appUser.setLocale(locale);
        appUser.setEmail(email);
        appUser.setEmailVerified(emailVerified);
        appUser.setLastLogin(Instant.now());

        if (appUser.getCreatedAt() == null) {
            appUser.setCreatedAt(Instant.now());
        }

        appUser = userRepository.save(appUser);

        return UserResponseDto.builder()
                .id(appUser.getId())
                .email(appUser.getEmail())
                .name(appUser.getName())
                .pictureUrl(appUser.getPictureUrl())
                .locale(appUser.getLocale())
                .emailVerified(appUser.isEmailVerified())
                .createdAt(appUser.getCreatedAt())
                .lastLogin(appUser.getLastLogin())
                .build();
    }
}
