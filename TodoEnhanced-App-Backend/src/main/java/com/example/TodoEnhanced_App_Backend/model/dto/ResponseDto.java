package com.example.TodoEnhanced_App_Backend.model.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto {
    private Integer todoId;
    private String title;
    private String content;
    private LocalDate doDate;
    private boolean isDone;
}
