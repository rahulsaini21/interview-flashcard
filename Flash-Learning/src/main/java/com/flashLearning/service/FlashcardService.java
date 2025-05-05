package com.flashLearning.service;


import com.flashLearning.model.Deck;
import com.flashLearning.model.Flashcard;
import com.flashLearning.repository.DeckRepository;
import com.flashLearning.repository.FlashcardRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FlashcardService {

    Logger logger = LoggerFactory.getLogger(DeckService.class);

    @Autowired
    private FlashcardRepository flashcardRepository;
    
    @Autowired
    private DeckRepository deckRepository;
    
    public List<Flashcard> getFlashcardsByDeckId(String deckId) {
        logger.info("Fetching flashcards for deck ID: " + deckId);
        return flashcardRepository.findByDeckId(deckId);
    }
    
    public Flashcard createFlashcard(Flashcard flashcard, String deckId) {
        logger.info("Creating flashcard with question: " + flashcard.getQuestion());
        Deck deck = deckRepository.findById(deckId)
            .orElseThrow(() -> new RuntimeException("Deck not found"));
        deck.addFlashcard(flashcard);

        logger.info("Flashcard added to deck: " + deck.getName());
        flashcardRepository.save(flashcard);
        deckRepository.save(deck);
        logger.info("Flashcard created and added to deck: " + deck.getName());
        return flashcard;
    }
    
    public List<Flashcard> importFlashcardsFromCSV(MultipartFile file, String deckId) throws IOException {
        logger.info("Importing flashcards from CSV for deck ID: " + deckId);
        Deck deck = deckRepository.findById(deckId)
            .orElseThrow(() -> new RuntimeException("Deck not found"));
        
        try (BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(fileReader, 
                CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).setIgnoreHeaderCase(true).setTrim(true).build())) {
            
            List<CSVRecord> records = csvParser.getRecords();
            List<Flashcard> flashcards = records.stream()
                .map(record -> {
                    Flashcard flashcard = new Flashcard();
                    flashcard.setQuestion(record.get("question"));
                    flashcard.setAnswer(record.get("answer"));
                    flashcard.setDescription(record.get("description"));
                    deck.addFlashcard(flashcard);
                    return flashcard;
                })
                .toList();
            
            return flashcardRepository.saveAll(flashcards);
        }
    }
    
    public Optional<Flashcard> getFlashcardById(String id) {
        logger.info("Fetching flashcard with ID: " + id);
        return flashcardRepository.findById(id);
    }
    
    public void deleteFlashcard(String id) {
        logger.info("Deleting flashcard with ID: " + id);

        // Fetch the flashcard to be deleted
        Flashcard flashcardToDelete = flashcardRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        logger.info("Flashcard question: " + flashcardToDelete.getQuestion());
        // Remove the flashcard from the parent deck's flashcards subarray
        Deck parentDeck = flashcardToDelete.getDeck();
        logger.info("Parent deck ID: " + (parentDeck != null ? parentDeck.getId() : "No parent deck"));
        if (parentDeck != null) {
            logger.info("Removing flashcard from parent deck: " + parentDeck.getName());
            parentDeck.getFlashcards().remove(flashcardToDelete);
            deckRepository.save(parentDeck);
        }

        // Delete the flashcard
        flashcardRepository.deleteById(id);
        logger.info("Flashcard deleted successfully");
    }
}