package com.opportunityshield.reminders;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReminderResponse {

    private Long id;
    private Long applicationId;
    private String company;
    private String title;
    private LocalDate dueDate;
    private ReminderType type;
    private boolean completed;
    private String notes;
    private boolean isSampleData;
    private LocalDateTime createdAt;

    public ReminderResponse() {}

    public static ReminderResponse fromEntity(Reminder entity) {
        ReminderResponse res = new ReminderResponse();
        res.setId(entity.getId());
        if (entity.getApplication() != null) {
            res.setApplicationId(entity.getApplication().getId());
        }
        res.setCompany(entity.getCompany());
        res.setTitle(entity.getTitle());
        res.setDueDate(entity.getDueDate());
        res.setType(entity.getType());
        res.setCompleted(entity.isCompleted());
        res.setNotes(entity.getNotes());
        res.setIsSampleData(entity.isSampleData());
        res.setCreatedAt(entity.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isIsSampleData() {
        return isSampleData;
    }

    public void setIsSampleData(boolean sampleData) {
        isSampleData = sampleData;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
