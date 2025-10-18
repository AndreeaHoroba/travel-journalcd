package com.example.demo.dto;


import lombok.Data;

@Data
public class EntryDTO {
    private String title;
    private String description;
    private String imageUrl;
    private String tags;
    private double rating;
    private boolean favorite;
}

