package com.thiet_thi.project_one.controllers;

import com.nimbusds.jose.JOSEException;
import com.thiet_thi.project_one.dtos.ApiResponse;
import com.thiet_thi.project_one.dtos.AuthenticationDTO;
import com.thiet_thi.project_one.dtos.IntrospectDTO;
import com.thiet_thi.project_one.dtos.RegisterDTO;
import com.thiet_thi.project_one.responses.AuthenticationResponse;
import com.thiet_thi.project_one.responses.IntrospectResponse;
import com.thiet_thi.project_one.services.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.Arrays;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

    AuthenticationService authenticationService;

    // ==================== LOGIN ====================
    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(
            @RequestBody AuthenticationDTO dto,
            HttpServletResponse response) {

        var authResponse = authenticationService.authenticationResponse(dto);

        // SET REFRESH TOKEN VÀO COOKIE
        Cookie refreshCookie = new Cookie("refresh_token", authResponse.getRefreshToken());
        refreshCookie.setHttpOnly(true);           // JS không đọc được
        refreshCookie.setSecure(false);            // TODO: true khi HTTPS
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) authenticationService.getRefreshableDuration());
        refreshCookie.setAttribute("SameSite", "Strict");

        response.addCookie(refreshCookie);

        // XÓA refreshToken khỏi response body
        return ApiResponse.<AuthenticationResponse>builder()
                .result(AuthenticationResponse.builder()
                        .token(authResponse.getToken())
                        .authenticated(true)
                        .build())
                .build();
    }

    // ==================== REFRESH ====================
    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) throws ParseException, JOSEException {

        // ĐỌC REFRESH TOKEN TỪ COOKIE
        String refreshToken = Arrays.stream(request.getCookies() != null ? request.getCookies() : new Cookie[0])
                .filter(c -> "refresh_token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        var authResponse = authenticationService.refreshToken(refreshToken);

        // CẤP REFRESH TOKEN MỚI + SET COOKIE
        Cookie newCookie = new Cookie("refresh_token", authResponse.getRefreshToken());
        newCookie.setHttpOnly(true);
        newCookie.setSecure(false); // TODO: true khi HTTPS
        newCookie.setPath("/");
        newCookie.setMaxAge((int) authenticationService.getRefreshableDuration());
        newCookie.setAttribute("SameSite", "Strict");
        response.addCookie(newCookie);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(AuthenticationResponse.builder()
                        .token(authResponse.getToken())
                        .authenticated(true)
                        .build())
                .build();
    }

    // ==================== LOGOUT ====================
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        // XÓA COOKIE
        Cookie cookie = new Cookie("refresh_token", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ApiResponse.<Void>builder().build();
    }

    // ==================== INTROSPECT ====================
    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(
            @RequestBody IntrospectDTO dto) throws ParseException, JOSEException {

        var result = authenticationService.introspectResponse(dto);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/register")
    public ApiResponse<AuthenticationResponse> register(@RequestBody RegisterDTO dto) {

        // Gọi service
        var authResponse = authenticationService.register(dto);

        // Trả về kết quả
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authResponse)
                .message("Đăng ký thành công! Vui lòng chờ quản trị viên duyệt.")
                .build();
    }
}