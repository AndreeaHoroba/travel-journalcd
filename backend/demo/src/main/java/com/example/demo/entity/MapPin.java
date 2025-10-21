package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "map_pins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MapPin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // ex: “Paris” sau “Trip to Tokyo”
    private Double lat;
    private Double lng;

    private String color; // optional – dacă vrei diferite culori pentru tipuri de pinuri

    private boolean visited; // pentru wishlist vs locuri vizitate
}
