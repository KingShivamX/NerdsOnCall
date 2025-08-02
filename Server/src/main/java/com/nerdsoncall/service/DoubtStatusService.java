package com.nerdsoncall.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nerdsoncall.entity.Doubt;
import com.nerdsoncall.repository.DoubtRepository;

import java.util.Optional;

@Service
public class DoubtStatusService {

    @Autowired
    private DoubtRepository doubtRepository;

    public Doubt updateDoubtStatus(Long doubtId, Doubt.Status status) {
        Doubt doubt = doubtRepository.findById(doubtId)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));
        doubt.setStatus(status);
        return doubtRepository.save(doubt);
    }

    public Optional<Doubt> findById(Long id) {
        return doubtRepository.findById(id);
    }
}