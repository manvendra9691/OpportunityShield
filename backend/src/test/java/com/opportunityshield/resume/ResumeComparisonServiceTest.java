package com.opportunityshield.resume;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ResumeComparisonServiceTest {

    private ResumeComparisonService service;

    @BeforeEach
    void setUp() {
        service = new ResumeComparisonService();
    }

    @Test
    @DisplayName("Should extract overlapping skills and detect omitted keywords")
    void testSkillMatching() {
        ResumeComparisonRequest request = new ResumeComparisonRequest(
                "Full-stack engineer with React, TypeScript, and SQL background.",
                "Seeking an engineer proficient in React, TypeScript, Spring Boot, MySQL, and Docker."
        );

        ResumeComparisonResponse response = service.compare(request);

        assertTrue(response.getMatchedSkills().contains("React"));
        assertTrue(response.getMatchedSkills().contains("TypeScript"));
        assertTrue(response.getMissingSkills().contains("Spring Boot"));
        assertTrue(response.getMissingSkills().contains("MySQL"));
        assertTrue(response.getMissingSkills().contains("Docker"));
        assertTrue(response.getMatchScore() > 0 && response.getMatchScore() < 100);
        assertTrue(response.getRecommendations().stream().anyMatch(r -> r.contains("Honesty Principle")));
    }

    @Test
    @DisplayName("Should handle empty job description with 0 score gracefully")
    void testEmptyDescription() {
        ResumeComparisonRequest request = new ResumeComparisonRequest(
                "Java developer with Spring Boot.",
                ""
        );

        ResumeComparisonResponse response = service.compare(request);
        assertEquals(0, response.getMatchScore());
        assertTrue(response.getMatchedSkills().isEmpty());
    }
}
