package com.opportunityshield.reminders;

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
@RequestMapping("/api/reminders")
@Tag(name = "Reminders", description = "Follow-up and interview milestones management")
public class ReminderController {

    private final ReminderService service;

    public ReminderController(ReminderService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List all reminders for authenticated user")
    public ResponseEntity<ApiResponse<List<ReminderResponse>>> getReminders(@AuthenticationPrincipal User currentUser) {
        List<ReminderResponse> list = service.getReminders(currentUser);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    @Operation(summary = "Create a new reminder")
    public ResponseEntity<ApiResponse<ReminderResponse>> createReminder(
            @Valid @RequestBody ReminderRequest request,
            @AuthenticationPrincipal User currentUser) {
        ReminderResponse response = service.createReminder(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Reminder created successfully"));
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle reminder completed status")
    public ResponseEntity<ApiResponse<ReminderResponse>> toggleReminder(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        ReminderResponse response = service.toggleCompletion(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response, "Reminder status updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a reminder")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        service.deleteReminder(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Reminder deleted successfully"));
    }
}
