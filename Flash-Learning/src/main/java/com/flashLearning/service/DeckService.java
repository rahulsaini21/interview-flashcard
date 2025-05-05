package com.flashLearning.service;


import com.flashLearning.exception.DeckNotFoundException;
import com.flashLearning.model.Deck;
import com.flashLearning.repository.DeckRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Service
public class DeckService {

    Logger logger = LoggerFactory.getLogger(DeckService.class);

    @Autowired
    private DeckRepository deckRepository;
    
    public List<Deck> getAllRootDecks() {
        logger.info("Fetching all root decks");
        return deckRepository.findByParentDeckIsNull();
    }
    
    public List<Deck> getSubDecks(String parentDeckId) {
        logger.info("Fetching sub-decks for parent deck ID: " + parentDeckId);
        if (!deckRepository.existsById(parentDeckId)) {
            throw new DeckNotFoundException("Parent deck with ID " + parentDeckId + " not found");
        }
        return deckRepository.findByParentDeckId(parentDeckId);
    }
    
    public Deck createDeck(Deck deck, String parentDeckId) {
        logger.info("Creating deck with name: " + deck.getName());
        logger.info("Parent deck ID: " + parentDeckId);
        if (parentDeckId != null) {
            Deck parentDeck = deckRepository.findById(parentDeckId)
                .orElseThrow(() -> new DeckNotFoundException("Parent deck with ID " + parentDeckId + " not found"));
            
            // Save the new deck first to generate an ID
            deck.setParentDeck(parentDeck);
            Deck savedDeck = deckRepository.save(deck);

            
            logger.info("Adding deck to parent deck: " + parentDeck.getName());
            parentDeck.addSubDeck(savedDeck);
            deckRepository.save(parentDeck);
            return savedDeck;
        }
        return deckRepository.save(deck);
    }
    
    public Deck getDeckById(String id) {
        logger.info("Fetching deck with ID: " + id);
        return deckRepository.findById(id)
            .orElseThrow(() -> new DeckNotFoundException("Deck with ID " + id + " not found"));
    }
    
    public void deleteDeck(String id) {
        logger.info("Deleting deck with ID: " + id);
        if (!deckRepository.existsById(id)) {
            throw new DeckNotFoundException("Deck with ID " + id + " not found");
        }
    
        // Fetch the deck to be deleted
        Deck deckToDelete = deckRepository.findById(id).orElseThrow(() -> new DeckNotFoundException("Deck with ID " + id + " not found"));
    
        // If the deck has a parent, remove it from the parent's sub-decks
        if (deckToDelete.getParentDeck() != null) {
            Deck parentDeck = deckToDelete.getParentDeck();
            parentDeck.getSubDecks().remove(deckToDelete);
            deckRepository.save(parentDeck);
        }
    
        // Delete the deck
        deckRepository.deleteById(id);
    }
}