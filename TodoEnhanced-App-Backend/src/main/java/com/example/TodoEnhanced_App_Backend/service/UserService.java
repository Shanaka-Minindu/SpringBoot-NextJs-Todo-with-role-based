package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.exeption.UserAlreadyExistsException;
import com.example.TodoEnhanced_App_Backend.model.Role;
import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User registerUser(String userName, String password){
        User findUsr = userRepo.findByUserName(userName);

        if(findUsr != null){
            throw new UserAlreadyExistsException("User already signed up with userName : "+userName);
        }

        User newUser = new User();
        newUser.setUserName(userName);
        newUser.setRole(Role.User);
        newUser.setPassword(encoder.encode(password));

        return userRepo.save(newUser);
    }

}
