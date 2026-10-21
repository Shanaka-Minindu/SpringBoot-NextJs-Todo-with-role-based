package com.example.TodoEnhanced_App_Backend.exeption;

public class ExpiredJwtException extends RuntimeException{
    public ExpiredJwtException(String message){
        super(message);
    }
}
