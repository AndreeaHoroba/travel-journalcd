package com.example.demo.controller;

import com.example.demo.entity.Wishlist;
import com.example.demo.repository.WishlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000") // allow React access
public class WishlistController {

    private final WishlistRepository wishlistRepository;

    public WishlistController(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @GetMapping
    public List<Wishlist> getAll() {
        return wishlistRepository.findAll();
    }

    @PostMapping
    public Wishlist addDestination(@RequestBody Wishlist wishlist) {
        return wishlistRepository.save(wishlist);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Wishlist> updateDestination(@PathVariable Long id, @RequestBody Wishlist updated) {
        return wishlistRepository.findById(id)
                .map(existing -> {
                    if (updated.getName() != null) existing.setName(updated.getName());
                    existing.setVisited(updated.isVisited());
                    if (updated.getTags() != null) existing.setTags(updated.getTags());
                    existing.setLinkedEntry(updated.getLinkedEntry());
                    return ResponseEntity.ok(wishlistRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {
        return wishlistRepository.findById(id)
                .map(item -> {
                    wishlistRepository.delete(item);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
