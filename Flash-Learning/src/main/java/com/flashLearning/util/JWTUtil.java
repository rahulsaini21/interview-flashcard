package com.flashLearning.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JWTUtil {

    private static final Logger logger = LoggerFactory.getLogger(JWTUtil.class);

    private static final String SECRET_KEY = "VGhpcyBpcyBhIHNlY3JldCBrZXkgZm9yIEpXVCAzMiBjaGFyYWN0ZXJzIGxvbmc=";
    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));


    // Updated JWT generation and validation methods to address deprecations
    public String generateToken(String username, long expiryMinutes) {
        return Jwts.builder()
                .claim("sub", username) // Replaced setSubject with claim for "sub"
                .claim("iat", System.currentTimeMillis() / 1000) // Replaced setIssuedAt with claim for "iat"
                .claim("exp", (System.currentTimeMillis() + expiryMinutes * 60 * 1000) / 1000) // Replaced setExpiration with claim for "exp"
                .signWith(key) // Updated to use only the key
                .compact();
    }

    public String validateAndExtractUsername(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parse(token);
            logger.info("Token is valid: {}", token);
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            logger.info("Claims: {}", claims);
            String username = claims.get("sub", String.class); // Extracted "sub" claim as username
            logger.info("Extracted username: {}", username);
            return username; // Check if username is not null or empty
        } catch (JwtException e) {
            return null; // Invalid or expired JWT
        }
    }
}


