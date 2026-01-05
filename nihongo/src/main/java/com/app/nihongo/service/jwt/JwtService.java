package com.app.nihongo.service.jwt;

import com.app.nihongo.entity.User;
import com.app.nihongo.service.user.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private UserService userService;

    // Tạo JWT dựa trên tên đang nhập
    public String generateToken(String username){
        Map<String, Object> claims = new HashMap<>();
        User user = userService.findByUsername(username);

        claims.put("id", user.getUserId());

        return createToken(claims, username);
    }

    // Tạo JWT với các claim đã chọn
    private  String createToken(Map<String, Object> claims, String username){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+30*60*1000000)) // JWT hết hạn sau 30000 phút
                .signWith(SignatureAlgorithm.HS256,getSignKey())
                .compact();
    }

    private Key getSignKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Trích xuất thông tin
    private Claims extractAllClaims(String token){
        return Jwts.parser().setSigningKey(getSignKey()).parseClaimsJws(token).getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsFunction.apply(claims);
    }

    // Kiểm tra tời gian hết hạn từ JWT
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    // Kiểm tra tời gian hết hạn từ JWT
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    // Kiểm tra cái JWT đã hết hạn
    private Boolean isTokenExpired(String token){
//        if(extractExpiration(token).before(new Date())){
//            System.out.println("Lỗi date ở check token");
//        }
        return extractExpiration(token).before(new Date());
    }

    // Kiểm tra tính hợp lệ
    public Boolean validateToken(String token, UserDetails userDetails){

        final String username = extractUsername(token);
//        System.out.println(username + " username " + userDetails.getUsername() + " validate token");
        return (username.equals(userDetails.getUsername())&&!isTokenExpired(token));
    }
    public Integer extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return (Integer) claims.get("id"); // Make sure the key matches the one used during token creation
    }

}
