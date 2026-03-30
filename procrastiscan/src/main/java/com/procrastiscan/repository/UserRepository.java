package com.procrastiscan.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.procrastiscan.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}