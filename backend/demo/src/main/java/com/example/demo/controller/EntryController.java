package com.example.demo.controller;

import com.example.demo.entity.Entry;
import com.example.demo.repository.EntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class EntryController {

    private final EntryRepository entryRepository;

    public EntryController(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    // ✅ Get all entries
    @GetMapping
    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    // ✅ Get entry by ID
    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById(@PathVariable Long id) {
        return entryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create new entry (with location)
    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody Entry entry) {
        try {
            Entry savedEntry = entryRepository.save(entry);
            return ResponseEntity.ok(savedEntry);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ✅ Update an existing entry (including coordinates)
    @PutMapping("/{id}")
    public ResponseEntity<Entry> updateEntry(@PathVariable Long id, @RequestBody Entry updatedEntry) {
        return entryRepository.findById(id)
                .map(entry -> {
                    entry.setTitle(updatedEntry.getTitle());
                    entry.setDescription(updatedEntry.getDescription());
                    entry.setImageUrl(updatedEntry.getImageUrl());
                    entry.setTags(updatedEntry.getTags());
                    entry.setRating(updatedEntry.getRating());
                    entry.setFavorite(updatedEntry.isFavorite());
                    entry.setLat(updatedEntry.getLat());
                    entry.setLng(updatedEntry.getLng());
                    return ResponseEntity.ok(entryRepository.save(entry));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete entry
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        return entryRepository.findById(id)
                .map(entry -> {
                    entryRepository.delete(entry);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
