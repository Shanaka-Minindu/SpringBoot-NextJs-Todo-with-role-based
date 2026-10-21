package com.example.TodoEnhanced_App_Backend.exeption;

public class IdentifierMismatchException extends RuntimeException{
    public IdentifierMismatchException(String message) {
        super(message);
    }
}
