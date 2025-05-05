package com.flashLearning.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "decks")
@Data
public class Deck {
    private static final Logger logger = LoggerFactory.getLogger(Deck.class);
    @Id
    private String id;
    
    private String name;
    
    @JsonBackReference
    @DBRef
    private Deck parentDeck;
    
    @JsonManagedReference
    @DBRef
    private List<Deck> subDecks = new ArrayList<>();
    
    @JsonManagedReference
    @DBRef
    private List<Flashcard> flashcards = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public void addSubDeck(Deck subDeck) {
        subDecks.add(subDeck);
        
        subDeck.setParentDeck(this);
    }
    
    public void addFlashcard(Flashcard flashcard) {
        logger.info("Adding flashcard to deck: " + this.name);
        logger.info("Flashcard question: " + flashcard.getQuestion());
        flashcards.add(flashcard);
        flashcard.setDeck(this);
    }
}