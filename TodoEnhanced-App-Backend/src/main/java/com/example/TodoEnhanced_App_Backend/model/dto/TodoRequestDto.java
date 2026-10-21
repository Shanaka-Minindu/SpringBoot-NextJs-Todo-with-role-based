package com.example.TodoEnhanced_App_Backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TodoRequestDto {

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 150, message = "Title must be under 150 characters")
    private String title;

    @NotBlank( message = "Authentication error")
    private Integer userId;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotBlank(message = "Set todo completion Date")
    private LocalDate doDate;

}
