package com.opportunityshield.safety;

import com.opportunityshield.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/safety")
@Tag(name = "Safety Checker", description = "Rule-based employment scam evaluation engine")
public class SafetyController {

    private final SafetyCheckerService safetyService;

    public SafetyController(SafetyCheckerService safetyService) {
        this.safetyService = safetyService;
    }

    @PostMapping("/analyze")
    @Operation(summary = "Analyze job offer or recruiter message against known warning signs")
    public ResponseEntity<ApiResponse<SafetyCheckResponse>> analyzeJobOffer(@RequestBody SafetyCheckRequest request) {
        SafetyCheckResponse result = safetyService.evaluate(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Safety evaluation completed"));
    }
}
