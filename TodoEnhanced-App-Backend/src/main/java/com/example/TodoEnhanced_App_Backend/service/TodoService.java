package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.model.Todo;
import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.model.dto.ResponseDto;
import com.example.TodoEnhanced_App_Backend.repo.TodoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepo todoRepo;

    @Transactional
    public Todo craeteTodo(Todo todo){

        Todo todoData = Todo.builder()
                .title(todo.getTitle())
                .content(todo.getContent())
                .targetDate(todo.getTargetDate())
                .user(todo.getUser())
                .build();

      return   todoRepo.save(todoData);
    }


@Transactional(readOnly = true)
    public List<Todo> getUserTodos(Integer userId){
        return todoRepo.findByUserId(userId);
    }

    @Transactional
    public void deleteTodo(Integer todoId, User user){
        todoRepo.deleteByIdAndUser(todoId,user);
    }

}
