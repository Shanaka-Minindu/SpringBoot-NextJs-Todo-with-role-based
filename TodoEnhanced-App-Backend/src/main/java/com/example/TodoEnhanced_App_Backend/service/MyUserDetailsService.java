package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.model.UserPrincipal;
import com.example.TodoEnhanced_App_Backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepo.findByUserName(username);
        if(user==null){
            throw new UsernameNotFoundException("This user not found");
        }

        return new UserPrincipal(user);


    }
}
