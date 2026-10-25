package com.example.TodoEnhanced_App_Backend.controller;


import com.example.TodoEnhanced_App_Backend.exeption.IdentifierMismatchException;
import com.example.TodoEnhanced_App_Backend.model.Todo;
import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.model.UserPrincipal;
import com.example.TodoEnhanced_App_Backend.model.dto.ResponseDto;
import com.example.TodoEnhanced_App_Backend.model.dto.TodoRequestDto;
import com.example.TodoEnhanced_App_Backend.service.TodoService;
import org.hibernate.context.TenantIdentifierMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/todos") // if i remove this line i can access this resources like with post and get requests http://localhost:8001/todo
public class TodoController {

    @Autowired
    private TodoService todoService;

    @PostMapping
    public ResponseEntity<ResponseDto> createTodo(@RequestBody TodoRequestDto todoRequest, @AuthenticationPrincipal UserPrincipal userPrincipal){
        User user= userPrincipal.getUser();



        Todo todo = new Todo();
        todo.setTitle(todoRequest.getTitle());
        todo.setContent(todoRequest.getContent());
        todo.setUser(user);
        todo.setDone(false);
        todo.setTargetDate(todoRequest.getDoDate());

        Todo addedTodo = todoService.craeteTodo(todo);

      ResponseDto responseDto= ResponseDto.builder()
              .todoId(addedTodo.getId())
              .title(addedTodo.getTitle())
              .content(addedTodo.getContent())
              .doDate(addedTodo.getTargetDate())
              .isDone(addedTodo.isDone())
              .build();

      return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ResponseDto>> getUserTodos(@AuthenticationPrincipal UserPrincipal userPrincipal){
       User user = userPrincipal.getUser();

        List<Todo> todos = todoService.getUserTodos(user.getId());
        List<ResponseDto> repList = new ArrayList<>();
        for(Todo todo : todos){
            ResponseDto res = ResponseDto.builder()
                    .todoId(todo.getId())
                    .title(todo.getTitle())
                    .content(todo.getContent())
                    .doDate(todo.getTargetDate())
                    .isDone(todo.isDone())
                    .build();

            repList.add(res);
        }

        return new ResponseEntity<>(repList,HttpStatus.OK);
    }

    @DeleteMapping({"/{todoId}"})
public ResponseEntity<Void> deleteTodo(@PathVariable Integer todoId , @AuthenticationPrincipal UserPrincipal userPrincipal){
        User user = userPrincipal.getUser();
        todoService.deleteTodo(todoId,user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping({"/{todoId}"})
    public ResponseEntity<ResponseDto> updateTodo(
            @PathVariable Integer todoId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody TodoRequestDto todoReq
            ){
        User user =userPrincipal.getUser();
        Todo todo = new Todo();
        todo.setId(todoId);
        todo.setTitle(todoReq.getTitle());
        todo.setContent(todoReq.getContent());
        todo.setUser(user);
        todo.setDone(false);
        todo.setTargetDate(todoReq.getDoDate());
        Todo newTodo = todoService.todoUpdate(todo);

        ResponseDto res = ResponseDto.builder()
                .todoId(newTodo.getId())
                .title(newTodo.getTitle())
                .doDate(newTodo.getTargetDate())
                .content(newTodo.getContent())
                .isDone(newTodo.isDone())
                .build();

        return new ResponseEntity<>(res,HttpStatus.OK);


    }


    @PostMapping("/isDone/{todoId}")
    public ResponseEntity<Void> todoIsDone(@PathVariable Integer todoId, @AuthenticationPrincipal UserPrincipal userPrincipal){
        System.out.println(todoId);
            todoService.todoMarkDone(userPrincipal.getUser().getId(),todoId);
            return new ResponseEntity<>(HttpStatus.OK);
    }

}

