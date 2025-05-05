package com.flashLearning.controller;


import com.flashLearning.model.Deck;
import com.flashLearning.service.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    Logger logger = LoggerFactory.getLogger(DeckController.class);

    @Autowired
    private DeckService deckService;

    @GetMapping
    public ResponseEntity<List<Deck>> getAllDecks(@RequestHeader Map<String, String> headers) {
        logger.info("Fetching all root decks");
        logger.info("Request headers: {}", headers);
        return ResponseEntity.ok(deckService.getAllRootDecks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deck> getDeck(@PathVariable String id) {
        return ResponseEntity.ok(deckService.getDeckById(id));
    }

    @PostMapping
    public ResponseEntity<Deck> createDeck(@RequestBody Deck deck, 
                                           @RequestParam(required = false) String parentId,
                                           @RequestHeader Map<String, String> headers) {
        logger.info("Request headers: {}", headers);
        logger.info("Request body: {}", deck);
        return ResponseEntity.ok(deckService.createDeck(deck, parentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeck(@PathVariable String id) {
        deckService.deleteDeck(id);
        return ResponseEntity.noContent().build();
    }
}