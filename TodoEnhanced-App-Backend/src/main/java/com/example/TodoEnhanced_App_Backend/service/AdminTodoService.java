package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.model.Todo;
import com.example.TodoEnhanced_App_Backend.model.dto.ResponseDto;
import com.example.TodoEnhanced_App_Backend.repo.AdminTodoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminTodoService {

    @Autowired
    private AdminTodoRepo adminTodoRepo;

    @Transactional(readOnly = true)
    public List<ResponseDto> getAllTodos(){
        List<Todo> todos = adminTodoRepo.findAll();
        List<ResponseDto> repList= new ArrayList<>();
        for(Todo todo : todos){
            ResponseDto res = ResponseDto.builder()
                    .todoId(todo.getId())
                    .title(todo.getTitle())
                    .content(todo.getContent())
                    .doDate(todo.getTargetDate())
                    .build();

            repList.add(res);
        }

        return repList;
    }


}
