package com.example.backend.controller;

import com.example.backend.entity.Resident;
import com.example.backend.repository.ResidentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ResidentController {

    private final ResidentRepository residentRepository;

    public ResidentController(ResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    @PostMapping("/residents")
    public Resident createResident(@RequestBody Resident resident) {
        return residentRepository.save(resident);
    }
    @DeleteMapping("/residents/{id}")
    public void deleteResident(@PathVariable Long id) {
        residentRepository.deleteById(id);
    }

    @GetMapping("/residents")
    public List<Resident> getResidents() {
        return residentRepository.findAll();
    }

    @PutMapping("/residents/{id}")
    public Resident updateResident(
            @PathVariable Long id,
            @RequestBody Resident resident) {

        Resident existingResident = residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("入居者が見つかりません"));

        existingResident.setName(resident.getName());
        existingResident.setRoomNumber(resident.getRoomNumber());
        existingResident.setPhone(resident.getPhone());

        return residentRepository.save(existingResident);
    }
    @GetMapping("/residents/{id}")
    public Resident getResident(@PathVariable Long id) {
        return residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("入居者が見つかりません"));
    }
}