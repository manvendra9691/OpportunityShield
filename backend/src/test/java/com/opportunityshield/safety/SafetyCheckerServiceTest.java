package com.opportunityshield.safety;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SafetyCheckerServiceTest {

    private SafetyCheckerService service;

    @BeforeEach
    void setUp() {
        service = new SafetyCheckerService();
    }

    @Test
    @DisplayName("Should detect fake check equipment purchasing scam as HIGH risk")
    void testFakeCheckDetection() {
        SafetyCheckRequest request = new SafetyCheckRequest(
                "Apex Global Logistics",
                "http://apex-jobs.work",
                "Remote data processor. $85/hr.",
                "We will send you a cashier check to deposit and purchase your home office equipment."
        );

        SafetyCheckResponse response = service.evaluate(request);

        assertEquals("WARNING_SIGNS_FOUND", response.getRiskLevel());
        assertTrue(response.getRiskScore() >= 35);
        assertTrue(response.getIndicators().stream().anyMatch(i -> "FEE_CHECK_EQUIPMENT".equals(i.getId())));
        assertFalse(response.getSuggestedSteps().isEmpty());
    }

    @Test
    @DisplayName("Should detect text-only Telegram interview as HIGH risk")
    void testTelegramInterviewDetection() {
        SafetyCheckRequest request = new SafetyCheckRequest(
                "Innovate Labs",
                "",
                "Entry level coder.",
                "Please download Telegram and connect with our hiring manager on Telegram at @InnovateRecruiter."
        );

        SafetyCheckResponse response = service.evaluate(request);

        assertEquals("WARNING_SIGNS_FOUND", response.getRiskLevel());
        assertTrue(response.getIndicators().stream().anyMatch(i -> "COMM_TELEGRAM_WHATSAPP".equals(i.getId())));
    }

    @Test
    @DisplayName("Should flag upfront application or training fees")
    void testUpfrontFeeDetection() {
        SafetyCheckRequest request = new SafetyCheckRequest(
                "FastHire Inc",
                "",
                "Junior Analyst. Please pay an onboarding fee of $50 for background certification.",
                ""
        );

        SafetyCheckResponse response = service.evaluate(request);

        assertEquals("WARNING_SIGNS_FOUND", response.getRiskLevel());
        assertTrue(response.getIndicators().stream().anyMatch(i -> "FEE_APPLICATION_TRAINING".equals(i.getId())));
    }

    @Test
    @DisplayName("Should evaluate legitimate corporate postings with no red flags as NO_WARNINGS_FOUND")
    void testLegitimatePosting() {
        SafetyCheckRequest request = new SafetyCheckRequest(
                "Stripe",
                "https://stripe.com/jobs/senior-dev",
                "Senior Backend Engineer. 5+ years experience in Java, Spring Boot, and MySQL.",
                "Hello, please view the role on stripe.com and connect with our team through our official portal."
        );

        SafetyCheckResponse response = service.evaluate(request);

        assertEquals("NO_WARNINGS_FOUND", response.getRiskLevel());
        assertEquals(0, response.getRiskScore());
        assertTrue(response.getIndicators().isEmpty());
        assertFalse(response.getLimitations().isEmpty());
    }
}
