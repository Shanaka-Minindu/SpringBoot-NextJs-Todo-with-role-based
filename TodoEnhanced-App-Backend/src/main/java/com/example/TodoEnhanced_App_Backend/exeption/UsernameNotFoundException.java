package com.example.TodoEnhanced_App_Backend.exeption;

public class UsernameNotFoundException extends RuntimeException {
    public UsernameNotFoundException(String message){
        super(message);
    }
}
