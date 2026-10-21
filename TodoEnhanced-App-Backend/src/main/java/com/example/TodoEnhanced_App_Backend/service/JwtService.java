package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.model.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class JwtService {
    private String securityKey ="T3BlblNlcmlhbGl6YXRpb25Db250cm9sUGFzmlhbGl6YXRpb25Db250cm9sUGFzmlhbGl6YXRpb25Db250cm9sUGFzmlhbGl6YXRpb25Db250cm9sUGFz";

    public String generateToken(Integer id, String userName, Role role){
        Map<String, Object> claims = new HashMap<>();

        claims.put("role",role.name());
        claims.put("userId",id);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*3))
                .signWith(getKey(), SignatureAlgorithm.HS256).compact();


    }

private Key getKey(){
        byte[] keyBytes = Decoders.BASE64.decode(securityKey);
        return Keys.hmacShaKeyFor(keyBytes);
}

}
