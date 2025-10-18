package com.example.demo.service;



import  com.example.demo.dto.EntryDTO;
import  com.example.demo.entity.Entry;
import  com.example.demo.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntryService {

    @Autowired
    private EntryRepository entryRepository;

    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    public Entry createEntry(EntryDTO dto) {
        Entry entry = new Entry();
        entry.setTitle(dto.getTitle());
        entry.setDescription(dto.getDescription());
        entry.setImageUrl(dto.getImageUrl());
        entry.setTags(dto.getTags());
        entry.setRating(dto.getRating());
        entry.setFavorite(dto.isFavorite());
        return entryRepository.save(entry);
    }

    public List<Entry> searchByTag(String tag) {
        return entryRepository.findByTagsContainingIgnoreCase(tag);
    }
}

