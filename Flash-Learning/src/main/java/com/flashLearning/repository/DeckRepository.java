package com.flashLearning.repository;

import com.flashLearning.model.Deck;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeckRepository extends MongoRepository<Deck, String> {
    List<Deck> findByParentDeckIsNull();
    List<Deck> findByParentDeckId(String parentDeckId);
}