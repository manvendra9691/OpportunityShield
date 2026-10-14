package com.opportunityshield.reminders;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReminderRequest {

    private Long applicationId;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotNull(message = "Type is required")
    private ReminderType type;

    private Boolean completed;
    private String notes;
    private Boolean isSampleData;

    public ReminderRequest() {}

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public ReminderType getType() {
        return type;
    }

    public void setType(ReminderType type) {
        this.type = type;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getIsSampleData() {
        return isSampleData;
    }

    public void setIsSampleData(Boolean isSampleData) {
        this.isSampleData = isSampleData;
    }
}
