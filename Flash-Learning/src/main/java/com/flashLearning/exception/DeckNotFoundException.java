package com.flashLearning.exception;


public class DeckNotFoundException extends RuntimeException {
    public DeckNotFoundException(String message) {
        super(message);
    }
}