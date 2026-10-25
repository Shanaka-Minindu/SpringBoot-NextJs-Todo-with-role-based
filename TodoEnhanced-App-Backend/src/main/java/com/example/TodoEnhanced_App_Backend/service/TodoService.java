package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.exeption.ResourceNotFoundException;
import com.example.TodoEnhanced_App_Backend.model.Todo;
import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.model.dto.ResponseDto;
import com.example.TodoEnhanced_App_Backend.repo.TodoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
                .isDone(todo.isDone())
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

    @Transactional
    public Todo todoUpdate(Todo todo){

            return   todoRepo.save(todo);

    }

    @Transactional
    public void todoMarkDone(Integer userId, Integer todoId){
        System.out.println(todoId+"--------"+userId);
        Todo todo = todoRepo.findById(todoId)
                .orElseThrow(()->new ResourceNotFoundException("Todo Not Found"));
       if(!todo.getUser().getId().equals(userId)){
            throw new BadCredentialsException("You are not authorized to modify this todo");
       }
       todo.setDone(!todo.isDone());
        System.out.println(todo);
       todoRepo.save(todo);
    }

}
