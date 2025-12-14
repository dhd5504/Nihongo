package com.app.nihongo.controller;

import com.app.nihongo.dao.UserRepository;
import com.app.nihongo.entity.User;
import com.app.nihongo.security.JwtResponse;
import com.app.nihongo.security.LoginRequest;
import com.app.nihongo.service.account.IAccountService;
import com.app.nihongo.service.jwt.JwtService;
import com.app.nihongo.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private IAccountService accountService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<?> dangKyNguoiDung(@RequestBody User user) {
        ResponseEntity<?> response = accountService.dangKyNguoiDung(user);
        return response;
    }

    @GetMapping("/active")
    public ResponseEntity<?> dangKyNguoiDung(@RequestParam String email, @RequestParam String activeNumber) {
        ResponseEntity<?> response = accountService.kichHoatTaiKHoan(email, activeNumber);
        return response;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie clearToken = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        ResponseCookie clearUid = ResponseCookie.from("uid", "")
                .httpOnly(false)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, clearToken.toString());
        headers.add(HttpHeaders.SET_COOKIE, clearUid.toString());
        return ResponseEntity.ok().headers(headers).body("Logged out");
    }

    @PostMapping("/login")
    public ResponseEntity<?> dangNhap(@RequestBody LoginRequest loginRequest) {

        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        if (!user.isActived()) {
            return ResponseEntity.badRequest().body("Tài khoản chưa được kích hoạt.");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            if (authentication.isAuthenticated()) {
                final String jwt = jwtService.generateToken(loginRequest.getUsername());
                ResponseCookie tokenCookie = ResponseCookie.from("token", jwt)
                        .httpOnly(true)
                        .secure(false) // set true in production with https
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(24 * 60 * 60)
                        .build();
                ResponseCookie userIdCookie = ResponseCookie.from("uid", String.valueOf(user.getUserId()))
                        .httpOnly(false)
                        .secure(false) // set true in production with https
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(24 * 60 * 60)
                        .build();
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.SET_COOKIE, tokenCookie.toString());
                headers.add(HttpHeaders.SET_COOKIE, userIdCookie.toString());
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(new JwtResponse(jwt));
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        return ResponseEntity.badRequest().body("Xác thực không thành công.");
    }
}
