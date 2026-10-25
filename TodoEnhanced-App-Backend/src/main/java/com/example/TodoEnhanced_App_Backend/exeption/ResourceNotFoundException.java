package com.example.TodoEnhanced_App_Backend.exeption;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message){
        super(message);
    }
}
