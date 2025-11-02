package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String description;

    // 🔗 Leagă activitatea de un entry (jurnal)
    @ManyToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private Entry entry;
}
