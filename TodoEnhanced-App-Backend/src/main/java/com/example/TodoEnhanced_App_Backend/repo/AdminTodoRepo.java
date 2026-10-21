package com.example.TodoEnhanced_App_Backend.repo;

import com.example.TodoEnhanced_App_Backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminTodoRepo extends JpaRepository<Todo,Integer> {
}
