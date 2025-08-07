package com.nerdsoncall.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Component
public class JwtUtil {

    private final String secret;
    private final Long expiration;

    public JwtUtil(@Value("${JWT_SECRET}") String secret) {
        this.secret = secret;
        this.expiration = 86400000L; // 24 hours in milliseconds
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    public String generateToken(String username, Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }

            if (userDetails == null || userDetails.getUsername() == null) {
                return false;
            }

            final String username = extractUsername(token);
            return (username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token));

        } catch (ExpiredJwtException e) {
            log.warn("JWT token has expired for user: {}", userDetails.getUsername());
            return false;
        } catch (MalformedJwtException e) {
            log.warn("Malformed JWT token for user: {}", userDetails.getUsername());
            return false;
        } catch (SignatureException e) {
            log.warn("Invalid JWT signature for user: {}", userDetails.getUsername());
            return false;
        } catch (Exception e) {
            log.error("Unexpected error validating JWT token for user: {}", userDetails.getUsername(), e);
            return false;
        }
    }

    public Boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }

            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;

        } catch (ExpiredJwtException e) {
            log.debug("JWT token has expired");
            return false;
        } catch (MalformedJwtException e) {
            log.debug("Malformed JWT token");
            return false;
        } catch (SignatureException e) {
            log.debug("Invalid JWT signature");
            return false;
        } catch (JwtException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            log.debug("JWT token compact is invalid");
            return false;
        } catch (Exception e) {
            log.error("Unexpected error validating JWT token", e);
            return false;
        }
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
}