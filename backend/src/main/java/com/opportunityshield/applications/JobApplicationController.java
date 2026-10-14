package com.opportunityshield.applications;

import com.opportunityshield.auth.User;
import com.opportunityshield.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Job Applications", description = "CRUD operations for user job applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List all applications for the authenticated user")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getAllApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @AuthenticationPrincipal User currentUser) {
        List<JobApplicationResponse> list = service.getAllApplications(currentUser, status);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single application by ID")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        JobApplicationResponse response = service.getApplicationById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    @Operation(summary = "Create a new job application")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> createApplication(
            @Valid @RequestBody JobApplicationRequest request,
            @AuthenticationPrincipal User currentUser) {
        JobApplicationResponse response = service.createApplication(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Application created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing job application")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request,
            @AuthenticationPrincipal User currentUser) {
        JobApplicationResponse response = service.updateApplication(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Application updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an application record")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        service.deleteApplication(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Application deleted successfully"));
    }
}
