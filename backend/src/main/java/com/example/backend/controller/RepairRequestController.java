package com.example.backend.controller;

import com.example.backend.entity.RepairRequest;
import com.example.backend.repository.RepairRequestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class RepairRequestController {

    private final RepairRequestRepository repairRequestRepository;

    public RepairRequestController(RepairRequestRepository repairRequestRepository) {
        this.repairRequestRepository = repairRequestRepository;
    }

    @PostMapping("/repair-requests")
    public RepairRequest createRepairRequest(@RequestBody RepairRequest repairRequest) {
        return repairRequestRepository.save(repairRequest);
    }

    @GetMapping("/repair-requests")
    public List<RepairRequest> getRepairRequests() {
        return repairRequestRepository.findAll();
    }

    @GetMapping("/repair-requests/{id}")
    public RepairRequest getRepairRequest(@PathVariable Long id) {
        return repairRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("修繕依頼が見つかりません"));
    }

    @GetMapping("/repair-requests/resident/{residentId}")
    public List<RepairRequest> getRepairRequestsByResident(
            @PathVariable Long residentId) {

        return repairRequestRepository.findByResidentId(residentId);
    }

    @PutMapping("/repair-requests/{id}/status")
    public RepairRequest updateStatus(
            @PathVariable Long id,
            @RequestBody RepairRequest repairRequest) {

        RepairRequest existingRequest = repairRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("修繕依頼が見つかりません"));

        existingRequest.setStatus(repairRequest.getStatus());

        return repairRequestRepository.save(existingRequest);
    }

    @DeleteMapping("/repair-requests/{id}")
    public void deleteRepairRequest(@PathVariable Long id) {

        if (!repairRequestRepository.existsById(id)) {
            throw new RuntimeException("修繕依頼が見つかりません");
        }

        repairRequestRepository.deleteById(id);
    }

    @PutMapping("/repair-requests/{id}")
    public RepairRequest updateRepairRequest(
            @PathVariable Long id,
            @RequestBody RepairRequest repairRequest) {

        RepairRequest existingRequest = repairRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("修繕依頼が見つかりません"));

        existingRequest.setCategory(repairRequest.getCategory());
        existingRequest.setDescription(repairRequest.getDescription());

        return repairRequestRepository.save(existingRequest);
    }

}