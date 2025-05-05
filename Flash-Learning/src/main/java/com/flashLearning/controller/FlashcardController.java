package com.flashLearning.controller;

import com.flashLearning.dto.FlashcardResponseDTO;
import com.flashLearning.model.Flashcard;
import com.flashLearning.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/api/decks/{deckId}/flashcards")
public class FlashcardController {
    Logger logger = LoggerFactory.getLogger(FlashcardController.class);
    @Autowired
    private FlashcardService flashcardService;

    @GetMapping
    public ResponseEntity<List<Flashcard>> getFlashcards(@PathVariable String deckId) {
        return ResponseEntity.ok(flashcardService.getFlashcardsByDeckId(deckId));
    }

    @PostMapping
    public ResponseEntity<FlashcardResponseDTO> createFlashcard(
        @PathVariable String deckId, 
        @RequestBody Flashcard flashcard
    ) {
        logger.info("Creating flashcard with question: " + flashcard);
        Flashcard createdFlashcard = flashcardService.createFlashcard(flashcard, deckId);
        return ResponseEntity.ok(new FlashcardResponseDTO(createdFlashcard));
    }

    @PostMapping("/import")
    public ResponseEntity<List<Flashcard>> importFlashcards(@RequestParam("file") MultipartFile file, 
                                                         @PathVariable String deckId) throws IOException {
        return ResponseEntity.ok(flashcardService.importFlashcardsFromCSV(file, deckId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flashcard> getFlashcard(@PathVariable String deckId, 
                                                @PathVariable String id) {
        return ResponseEntity.ok(flashcardService.getFlashcardById(id)
            .orElseThrow(() -> new RuntimeException("Flashcard not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable String deckId, 
                                             @PathVariable String id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.noContent().build();
    }
}