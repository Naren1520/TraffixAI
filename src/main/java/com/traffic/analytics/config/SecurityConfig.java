package com.traffic.analytics.config;

import com.traffic.analytics.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF — stateless JWT API
            .csrf(AbstractHttpConfigurer::disable)

            // Stateless session
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Public endpoints — all existing traffic/route/live APIs remain open
                .requestMatchers(
                    "/api/traffic/**",
                    "/api/live/**",
                    "/api/route/**",
                    "/ws-traffic/**",
                    "/h2-console/**",
                    "/api/auth/**"     // login endpoint is public
                ).permitAll()

                // User-specific endpoints require a valid JWT
                .requestMatchers("/api/user/**").authenticated()

                // Everything else is open (future-proofing)
                .anyRequest().permitAll()
            )

            // Allow H2 console frames
            .headers(headers -> headers.frameOptions(fo -> fo.sameOrigin()))

            // Add JWT filter before the default username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
