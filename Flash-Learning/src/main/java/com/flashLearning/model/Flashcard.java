package com.flashLearning.model;


import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Document(collection = "flashcards")
@Data
public class Flashcard {
    @Id
    private String id;
    
    private String question;
    
    private String answer;
    
    private String description;
    
    @JsonBackReference
    @DBRef
    private Deck deck;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Removed the unimplemented orElseThrow method to avoid conflicts
    // with Optional.orElseThrow in the service layer.
}