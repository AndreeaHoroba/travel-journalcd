package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private String category;

    private LocalDate date;

    // ✅ Link each expense to a specific Entry
    @ManyToOne
    @JoinColumn(name = "entry_id")
    private Entry entry;
}
