package com.opportunityshield.applications;

import com.opportunityshield.auth.User;
import com.opportunityshield.auth.UserRepository;
import com.opportunityshield.common.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class JobApplicationAccessControlTest {

    @Autowired
    private JobApplicationService service;

    @Autowired
    private UserRepository userRepository;

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = userRepository.save(new User("candidate.alpha@example.com", "hash1", "Candidate Alpha", "ROLE_USER"));
        user2 = userRepository.save(new User("candidate.beta@example.com", "hash2", "Candidate Beta", "ROLE_USER"));
    }

    @Test
    @DisplayName("User 1 creates an application; User 2 cannot access or delete it (Strict BOLA isolation)")
    void testMultiUserAccessIsolation() {
        // 1. User 1 creates application
        JobApplicationRequest request = new JobApplicationRequest();
        request.setCompany("Acme Cloud Corp");
        request.setJobTitle("Staff Software Engineer");
        request.setApplicationDate(LocalDate.now());
        request.setStatus(ApplicationStatus.Applied);
        request.setSalary("$160,000");

        JobApplicationResponse created = service.createApplication(request, user1);
        assertNotNull(created.getId());
        assertEquals("Acme Cloud Corp", created.getCompany());

        // 2. User 1 can view their own application
        JobApplicationResponse user1View = service.getApplicationById(created.getId(), user1);
        assertEquals(created.getId(), user1View.getId());

        // 3. User 2 cannot view User 1's application (Throws ResourceNotFoundException)
        assertThrows(ResourceNotFoundException.class, () -> {
            service.getApplicationById(created.getId(), user2);
        });

        // 4. User 2's list does NOT contain User 1's application
        List<JobApplicationResponse> user2List = service.getAllApplications(user2, null);
        assertTrue(user2List.stream().noneMatch(a -> a.getId().equals(created.getId())));

        // 5. User 2 cannot delete User 1's application
        assertThrows(ResourceNotFoundException.class, () -> {
            service.deleteApplication(created.getId(), user2);
        });

        // 6. User 1 can update and delete their own application
        request.setSalary("$175,000");
        JobApplicationResponse updated = service.updateApplication(created.getId(), request, user1);
        assertEquals("$175,000", updated.getSalary());

        service.deleteApplication(created.getId(), user1);
        assertThrows(ResourceNotFoundException.class, () -> {
            service.getApplicationById(created.getId(), user1);
        });
    }
}
