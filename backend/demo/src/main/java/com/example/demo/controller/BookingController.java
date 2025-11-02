package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingRepository repo;

    public BookingController(BookingRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Booking> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getOne(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Booking create(@RequestBody Booking b) {
        return repo.save(b);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> update(@PathVariable Long id, @RequestBody Booking updated) {
        return repo.findById(id)
                .map(b -> {
                    b.setType(updated.getType());
                    b.setDestination(updated.getDestination());
                    b.setStartDate(updated.getStartDate());
                    b.setEndDate(updated.getEndDate());
                    b.setPrice(updated.getPrice());
                    b.setNotes(updated.getNotes());
                    return ResponseEntity.ok(repo.save(b));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repo.findById(id)
                .map(b -> {
                    repo.delete(b);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
