package com.example.TodoEnhanced_App_Backend.service;

import com.example.TodoEnhanced_App_Backend.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

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

    public String extractUserName(String token) {
        return extractClaim(token,Claims::getSubject);
    }

    // Extract User ID from claims
    public Integer extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        Number userIdNum = (Number) claims.get("userId");
        return userIdNum != null ? userIdNum.intValue() : null;
    }

    // Extract Role from claims
    public String extractUserRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    private <T> T extractClaim(String token, Function<Claims,T>claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token,Claims::getExpiration);
    }


}
