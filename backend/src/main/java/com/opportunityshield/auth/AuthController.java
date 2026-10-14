package com.opportunityshield.auth;

import com.opportunityshield.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Registration, login, and profile endpoints")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Log in with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Registration successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        AuthResponse response = new AuthResponse(
                null,
                currentUser.getId(),
                currentUser.getEmail(),
                currentUser.getFullName(),
                currentUser.getRole()
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/account")
    @Operation(summary = "Delete user account and all associated applications")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@AuthenticationPrincipal User currentUser) {
        authService.deleteAccount(currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Account and all associated records deleted successfully"));
    }
}
