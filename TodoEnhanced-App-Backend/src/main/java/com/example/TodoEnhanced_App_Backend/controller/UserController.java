package com.example.TodoEnhanced_App_Backend.controller;


import com.example.TodoEnhanced_App_Backend.exeption.UsernameNotFoundException;
import com.example.TodoEnhanced_App_Backend.model.Role;
import com.example.TodoEnhanced_App_Backend.model.User;
import com.example.TodoEnhanced_App_Backend.model.UserPrincipal;
import com.example.TodoEnhanced_App_Backend.model.dto.RefreshRequestDto;
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

    String accessToken = jwtService.generateToken(user.getId(), user.getUserName(), user.getRole());
    String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getUserName(), user.getRole());
            UserResponseDto userResponse = UserResponseDto.builder()
                    .role(user.getRole())
                    .token(accessToken)
                    .refreshToken(refreshToken)
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
        Integer userId = userPrincipal.getUser().getId();

        String accessToken = jwtService.generateToken(userId, uname, role);
        String refreshToken = jwtService.generateRefreshToken(userId, uname, role);

        UserResponseDto userResponseDto = UserResponseDto.builder()
                .role(role)
                .userName(uname)
                .token(accessToken)
                .refreshToken(refreshToken)
                .message("Logging Success")
                .build();
        return new  ResponseEntity<>(userResponseDto, HttpStatus.OK);
    }

    throw new  UsernameNotFoundException("Please check your credentials");
}

    @PostMapping("/refresh-token")
    public ResponseEntity<UserResponseDto> refreshToken(@RequestBody RefreshRequestDto requestDto) {
        String refreshToken = requestDto.getRefreshToken();

        if (refreshToken != null && jwtService.isRefreshToken(refreshToken)) {
            String userName = jwtService.extractUserName(refreshToken);
            Integer userId = jwtService.extractUserId(refreshToken);
            String roleStr = jwtService.extractUserRole(refreshToken);
            Role role = Role.valueOf(roleStr);

            // Generate a brand new short-lived Access Token
            String newAccessToken = jwtService.generateToken(userId, userName, role);

            UserResponseDto responseDto = UserResponseDto.builder()
                    .userName(userName)
                    .role(role)
                    .token(newAccessToken)
                    .refreshToken(refreshToken) // Return existing refresh token or rotate a new one
                    .message("Token Refreshed Successfully")
                    .build();

            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }



}
