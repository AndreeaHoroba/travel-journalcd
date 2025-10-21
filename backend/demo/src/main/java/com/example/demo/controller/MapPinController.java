package com.example.demo.controller;

import com.example.demo.entity.MapPin;
import com.example.demo.repository.MapPinRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pins")
@CrossOrigin(origins = "http://localhost:3000")
public class MapPinController {

    private final MapPinRepository mapPinRepository;

    public MapPinController(MapPinRepository mapPinRepository) {
        this.mapPinRepository = mapPinRepository;
    }

    @GetMapping
    public List<MapPin> getAllPins() {
        return mapPinRepository.findAll();
    }

    @PostMapping
    public MapPin addPin(@RequestBody MapPin pin) {
        return mapPinRepository.save(pin);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePin(@PathVariable Long id) {
        if (mapPinRepository.existsById(id)) {
            mapPinRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
