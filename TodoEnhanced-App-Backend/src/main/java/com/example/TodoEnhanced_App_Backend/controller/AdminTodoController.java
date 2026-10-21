package com.example.TodoEnhanced_App_Backend.controller;

import com.example.TodoEnhanced_App_Backend.model.dto.ResponseDto;
import com.example.TodoEnhanced_App_Backend.service.AdminTodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/")
public class AdminTodoController{

    @Autowired
    private AdminTodoService adminTodoService;

    @GetMapping("todos")
    public ResponseEntity<List<ResponseDto>> getAllTodos(){

        List<ResponseDto> data = adminTodoService.getAllTodos();

       return new ResponseEntity<>(data, HttpStatus.OK);
    }

}
