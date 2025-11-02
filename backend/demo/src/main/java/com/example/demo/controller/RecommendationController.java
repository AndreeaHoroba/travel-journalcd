package com.example.demo.controller;

import com.example.demo.entity.Entry;
import com.example.demo.repository.EntryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final EntryRepository entryRepository;

    public RecommendationController(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    @GetMapping
    public List<Map<String, String>> getRecommendations() {
        List<Entry> entries = entryRepository.findAll();

        // 🔹 Collect tags and titles
        Set<String> allTags = new HashSet<>();
        List<String> visitedTitles = new ArrayList<>();

        for (Entry e : entries) {
            if (e.getTags() != null)
                allTags.addAll(Arrays.stream(e.getTags().split(","))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet()));

            if (e.getTitle() != null)
                visitedTitles.add(e.getTitle().toLowerCase());
        }

        List<Map<String, String>> recommendations = new ArrayList<>();

        // 🔹 Beach lovers
        if (allTags.contains("beach") || allTags.contains("sea")) {
            recommendations.add(Map.of(
                    "place", "Bali, Indonesia",
                    "reason", "You seem to love beaches and tropical vibes 🌴",
                    "imageUrl", "https://cdn.pixabay.com/photo/2015/03/26/10/07/beach-690034_1280.jpg"
            ));
            recommendations.add(Map.of(
                    "place", "Maldives",
                    "reason", "Crystal clear water and peaceful islands 🌊",
                    "imageUrl", "https://cdn.pixabay.com/photo/2018/01/12/07/51/maldives-3071782_1280.jpg"
            ));
        }

        // 🔹 Mountain lovers
        if (allTags.contains("mountain") || allTags.contains("hiking")) {
            recommendations.add(Map.of(
                    "place", "Swiss Alps, Switzerland",
                    "reason", "You enjoy mountains and outdoor adventures 🏔️",
                    "imageUrl", "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
            ));
            recommendations.add(Map.of(
                    "place", "Banff National Park, Canada",
                    "reason", "For breathtaking peaks and glacial lakes 🇨🇦",
                    "imageUrl", "https://cdn.pixabay.com/photo/2016/11/29/02/12/banff-1868521_1280.jpg"
            ));
        }

        // 🔹 City explorers
        if (allTags.contains("city") || allTags.contains("romantic")) {
            recommendations.add(Map.of(
                    "place", "Paris, France",
                    "reason", "You love urban exploration and romantic places 💕",
                    "imageUrl", "https://cdn.pixabay.com/photo/2015/03/26/09/54/eiffel-tower-690293_1280.jpg"
            ));
            recommendations.add(Map.of(
                    "place", "Venice, Italy",
                    "reason", "Perfect canals and classic romance 🇮🇹",
                    "imageUrl", "https://cdn.pixabay.com/photo/2015/03/26/09/41/venice-690245_1280.jpg"
            ));
        }

        // 🔹 Smart filtering — fuzzy match (if entry title *contains* place name)
        recommendations.removeIf(rec -> {
            String place = rec.get("place").toLowerCase();
            return visitedTitles.stream().anyMatch(title -> title.contains(place.split(",")[0]));
        });

        // 🔹 Fallback
        if (recommendations.isEmpty()) {
            recommendations.add(Map.of(
                    "place", "Tokyo, Japan",
                    "reason", "Explore something new and exciting ✨",
                    "imageUrl", "https://cdn.pixabay.com/photo/2016/11/19/14/00/tokyo-1838979_1280.jpg"
            ));
        }

        return recommendations;
    }
}
