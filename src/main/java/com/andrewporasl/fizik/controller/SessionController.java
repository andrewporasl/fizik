package com.andrewporasl.fizik.controller;

import com.andrewporasl.fizik.model.Session;
import com.andrewporasl.fizik.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class SessionController {

    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping
    public Session createWorkout(@RequestBody Session session) {
        return sessionRepository.save(session);
    }

    @GetMapping
    public List<Session> getAllWorkouts() {
        return sessionRepository.findAll();
    }


}
