package com.app.nihongo.controller;


import com.app.nihongo.dao.UserRepository;
import com.app.nihongo.entity.User;
import com.app.nihongo.security.JwtResponse;
import com.app.nihongo.security.LoginRequest;
import com.app.nihongo.service.account.IAccountService;
import com.app.nihongo.service.jwt.JwtService;
import com.app.nihongo.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.annotation.Validated;
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
    public ResponseEntity<?> dangKyNguoiDung ( @RequestBody User user){

        ResponseEntity<?> response = accountService.dangKyNguoiDung(user);
        return response;
    }

    @GetMapping("/active")
    public ResponseEntity<?> dangKyNguoiDung ( @RequestParam String email, @RequestParam String activeNumber){

        ResponseEntity<?> response = accountService.kichHoatTaiKHoan(email,activeNumber);
        return response;
    }
    @PostMapping("/login")
    public ResponseEntity<?> dangNhap(@RequestBody LoginRequest loginRequest){

        User user = userRepository.findByUsername(loginRequest.getUsername());
        if(!user.isActived()){
            return ResponseEntity.badRequest().body("Tài khoản chưa được kích hoạt.");
        }
        // Xác thực người dùng bằng tên đăng nhập và mật khẩu
        try {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            // Nếu xác thực thành công, tạo token JWT
            if(authentication.isAuthenticated()){
                final String jwt = jwtService.generateToken(loginRequest.getUsername());
                return ResponseEntity.ok(new JwtResponse(jwt));
            }
        }catch (AuthenticationException e){
            // Xác thực không thành công, trả về lỗi hoặc thông báo
            return ResponseEntity.badRequest().body("Tên đăng nhập hặc mật khẩu không chính xác.");
        }

        return ResponseEntity.badRequest().body("Xác thực không thành công.");
    }
}
