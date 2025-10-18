package com.example.demo.controller;



import com.example.demo.dto.EntryDTO;
import com.example.demo.entity.Entry;
import com.example.demo.service.EntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "http://localhost:3000")
public class EntryController {

    @Autowired
    private EntryService entryService;

    @GetMapping
    public List<Entry> getAllEntries() {
        return entryService.getAllEntries();
    }

    @PostMapping
    public Entry createEntry(@RequestBody EntryDTO entryDTO) {
        return entryService.createEntry(entryDTO);
    }

    @GetMapping("/search")
    public List<Entry> searchEntries(@RequestParam String tag) {
        return entryService.searchByTag(tag);
    }
}

