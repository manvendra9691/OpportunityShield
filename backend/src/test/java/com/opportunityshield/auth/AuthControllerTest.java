package com.opportunityshield.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        userRepository.findByEmail("candidate1@opportunityshield.org").ifPresentOrElse(
                u -> {
                    u.setPasswordHash(passwordEncoder.encode("Password123!"));
                    userRepository.save(u);
                },
                () -> userRepository.save(new User("candidate1@opportunityshield.org", passwordEncoder.encode("Password123!"), "Candidate One", "ROLE_USER"))
        );
    }

    @Test
    @DisplayName("POST /api/auth/register should register a user and return a JWT token")
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest("Sam Developer", "sam.test@example.com", "SecurePass123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.email").value("sam.test@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login should authenticate seeded user and issue JWT token")
    void testLoginSuccess() throws Exception {
        // 'candidate1@opportunityshield.org' is seeded in V1 Flyway migration with password 'Password123!'
        AuthRequest request = new AuthRequest("candidate1@opportunityshield.org", "Password123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isString())
                .andExpect(jsonPath("$.data.email").value("candidate1@opportunityshield.org"));
    }

    @Test
    @DisplayName("POST /api/auth/login with wrong password should return 401 Unauthorized")
    void testLoginWrongPassword() throws Exception {
        AuthRequest request = new AuthRequest("candidate1@opportunityshield.org", "WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}
