package com.example.TodoEnhanced_App_Backend.model.dto;


import com.example.TodoEnhanced_App_Backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String token;
    private String refreshToken;
    private String userName;
    private Role role;
    private String message;
}
