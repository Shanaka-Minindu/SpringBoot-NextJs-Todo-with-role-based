package com.example.TodoEnhanced_App_Backend.controller;


import com.example.TodoEnhanced_App_Backend.exeption.UsernameNotFoundException;
import com.example.TodoEnhanced_App_Backend.model.Role;
import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.model.UserPrincipal;
import com.example.TodoEnhanced_App_Backend.model.dto.UserReqDto;
import com.example.TodoEnhanced_App_Backend.model.dto.UserResponseDto;
import com.example.TodoEnhanced_App_Backend.service.JwtService;
import com.example.TodoEnhanced_App_Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;


@PostMapping("register")
    public ResponseEntity<UserResponseDto> userRegister(@RequestBody UserReqDto userReqDto){

            User user = userService.registerUser(userReqDto.getUserName(),userReqDto.getPassword());

            UserResponseDto userResponse = UserResponseDto.builder()
                    .role(user.getRole())
                    .token("")

                    .userName(user.getUserName())
                    .message("User Registration Success")
                    .build();
            return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
}


@PostMapping("login")
    public ResponseEntity<UserResponseDto> userLogin(@RequestBody UserReqDto userReq){
    Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userReq.getUserName(),userReq.getPassword()));

    if(authentication.isAuthenticated()){

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        String uname = userPrincipal.getUsername();
        Role role = userPrincipal.getUser().getRole();


        String JwtToken = jwtService.generateToken(userPrincipal.getUser().getId(),uname,role);

        UserResponseDto userResponseDto = UserResponseDto.builder()
                .role(role)
                .userName(uname)
                .token(JwtToken)
                .message("Logging Success")
                .build();
        return new  ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }

    throw new  UsernameNotFoundException("Please check your credentials");
}



}
