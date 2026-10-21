package com.example.TodoEnhanced_App_Backend.exeption;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleUserNotFound(UsernameNotFoundException ex){
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,Object>> handleUserNotFound(BadCredentialsException ex){
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(IdentifierMismatchException.class)
    public ResponseEntity<Map<String,Object>> IdentifierMismatchException(IdentifierMismatchException ex){
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String ,Object>> ExpiredJwtException (ExpiredJwtException ex){
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    private ResponseEntity<Map<String,Object>> buildErrorResponse(HttpStatus status, String message){
        Map<String,Object> error  = new HashMap<>();
        error.put("timestamo",LocalDateTime.now());
        error.put("status",status.value());
        error.put("message", message);
        return new ResponseEntity<>(error,status);
    }


}