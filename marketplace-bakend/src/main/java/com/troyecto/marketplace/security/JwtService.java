package com.troyecto.marketplace.security;
//import io.github.cdimascio.dotenv.Dotenv; //ANTERIOR: Usaba .env
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

/**
 * JwtService
 * -----------------------------------------------------
 * ✔ Genera y valida tokens JWT
 * ✔ Carga la clave desde application.properties
 * ✔ Extrae claims, usuario y expiración
 */
@Service
public class JwtService {
    
    // ACTUAL: Lee desde application.properties
    @Value("${jwt.secret}")
    private String jwtSecret;

    // ANTERIOR: Usaba Dotenv para leer .env
    // private final Dotenv dotenv = Dotenv.configure()
    //         .ignoreIfMissing()
    //         .load();

    private Key key;

    /**
     * ✅ Inicializa la clave al iniciar el servicio
     */
    @PostConstruct
    public void initKey() {
        // ACTUAL: Validación desde @Value
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("❌ jwt.secret no está configurado en application.properties");
        }

        // ANTERIOR: Intentaba leer desde .env y variables de entorno
        // String secret = null;
        // try {
        //     secret = dotenv.get("JWT_SECRET");
        // } catch (Exception ignored) {}
        // if (secret == null || secret.isBlank()) {
        //     secret = System.getenv("JWT_SECRET");
        // }
        // if (secret == null || secret.isBlank()) {
        //     throw new IllegalStateException("❌ No se encontró JWT_SECRET");
        // }

        // Decodificar y validar tamaño mínimo para HS512 (512 bits = 64 bytes)
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret.trim());
        if (keyBytes.length < 64) {
            throw new IllegalStateException("❌ La clave jwt.secret es demasiado corta para HS512. Debe ser ≥ 512 bits (64 bytes en Base64)");
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
    }
    private Key getSignInKey() {
        if (key == null) {
            initKey(); // fallback si no fue inicializado
        }
        return key;
    }
    // ✅ Extrae el username (subject)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ✅ Extrae un claim genérico
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ✅ Parse completo del token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Genera token con claims extra y roles
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());



        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000)) // 2 horas
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    // 🔁 Genera un refresh token con expiración más larga (ej. 7 días)
    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(
                        new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000) // 7 días
                )
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }


    // ✅ Valida token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
