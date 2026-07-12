package com.traffic.analytics.repository;

import com.traffic.analytics.model.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByGoogleId(String googleId);
    Optional<AppUser> findByEmail(String email);
}
