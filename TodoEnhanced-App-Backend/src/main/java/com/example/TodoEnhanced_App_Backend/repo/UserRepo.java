package com.example.TodoEnhanced_App_Backend.repo;

import com.example.TodoEnhanced_App_Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Integer> {
    User findByUserName(String userName);
}
