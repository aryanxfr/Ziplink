package com.aryan.ziplink.repository;

import com.aryan.ziplink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmailAndDeletedFalse(String email);
    List<User> findAllByDeletedTrueAndDeletedAtBefore(Instant cutoff);
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
