package com.example.TodoEnhanced_App_Backend.repo;

import com.example.TodoEnhanced_App_Backend.model.Todo;
import com.example.TodoEnhanced_App_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepo extends JpaRepository<Todo,Integer> {
    List<Todo> findByUserId(Integer userId);
    void deleteByIdAndUser(Integer id, User user);

}
