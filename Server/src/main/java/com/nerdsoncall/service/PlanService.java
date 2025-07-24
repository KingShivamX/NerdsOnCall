package com.nerdsoncall.service;

import com.nerdsoncall.dto.CreatePlanRequest;
import com.nerdsoncall.dto.PlanResponse;
import com.nerdsoncall.dto.UpdatePlanRequest;
import com.nerdsoncall.entity.Plan;
import com.nerdsoncall.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {
    @Autowired
    private PlanRepository planRepository;

    public PlanResponse createPlan(CreatePlanRequest request) {
        if (planRepository.existsByName(request.getName())) {
            throw new RuntimeException("Plan with this name already exists");
        }
        Plan plan = new Plan();
        plan.setName(request.getName());
        plan.setPrice(request.getPrice());
        plan.setSessionsLimit(request.getSessionsLimit());
        plan.setDescription(request.getDescription());
        plan.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        Plan saved = planRepository.save(plan);
        return toResponse(saved);
    }

    public PlanResponse updatePlan(Long id, UpdatePlanRequest request) {
        Plan plan = planRepository.findById(id).orElseThrow(() -> new RuntimeException("Plan not found"));
        if (request.getName() != null) plan.setName(request.getName());
        if (request.getPrice() != null) plan.setPrice(request.getPrice());
        if (request.getSessionsLimit() != null) plan.setSessionsLimit(request.getSessionsLimit());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        if (request.getIsActive() != null) plan.setIsActive(request.getIsActive());
        Plan saved = planRepository.save(plan);
        return toResponse(saved);
    }

    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan not found");
        }
        planRepository.deleteById(id);
    }

    public Optional<PlanResponse> getPlan(Long id) {
        return planRepository.findById(id).map(this::toResponse);
    }

    public Optional<Plan> getPlanEntity(Long id) {
        return planRepository.findById(id);
    }

    public List<PlanResponse> getAllPlans() {
        return planRepository.findAll().stream().map(this::toResponse).toList();
    }

    private PlanResponse toResponse(Plan plan) {
        PlanResponse resp = new PlanResponse();
        resp.setId(plan.getId());
        resp.setName(plan.getName());
        resp.setPrice(plan.getPrice());
        resp.setSessionsLimit(plan.getSessionsLimit());
        resp.setDescription(plan.getDescription());
        resp.setIsActive(plan.getIsActive());
        resp.setCreatedAt(plan.getCreatedAt());
        resp.setUpdatedAt(plan.getUpdatedAt());
        return resp;
    }
} 