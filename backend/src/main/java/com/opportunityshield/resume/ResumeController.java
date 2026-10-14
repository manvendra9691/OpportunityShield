package com.opportunityshield.resume;

import com.opportunityshield.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resume")
@Tag(name = "Resume Matcher", description = "Transparent resume-to-job description skill matcher")
public class ResumeController {

    private final ResumeComparisonService service;

    public ResumeController(ResumeComparisonService service) {
        this.service = service;
    }

    @PostMapping("/compare")
    @Operation(summary = "Compare resume against job description in-memory")
    public ResponseEntity<ApiResponse<ResumeComparisonResponse>> compare(
            @Valid @RequestBody ResumeComparisonRequest request) {
        ResumeComparisonResponse result = service.compare(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Resume comparison completed"));
    }
}
