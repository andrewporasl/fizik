package com.andrewporasl.fizik.repository;

import com.andrewporasl.fizik.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
