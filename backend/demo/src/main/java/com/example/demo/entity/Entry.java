package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "LONGTEXT") // suport pentru imagini Base64 mari
    private String imageUrl;

    private String tags;  // Comma-separated tags (e.g. "beach,adventure")

    private double rating;

    private boolean favorite;

    // ✅ NEW — geographic coordinates for map markers
    private Double lat;

    private Double lng;
}
