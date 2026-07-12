package com.traffic.analytics.controller;

import com.traffic.analytics.dto.GoogleAuthRequestDto;
import com.traffic.analytics.dto.UserResponseDto;
import com.traffic.analytics.service.GoogleAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<UserResponseDto> authenticateGoogle(@RequestBody GoogleAuthRequestDto request) {
        UserResponseDto userResponse = googleAuthService.authenticate(request);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }
}
