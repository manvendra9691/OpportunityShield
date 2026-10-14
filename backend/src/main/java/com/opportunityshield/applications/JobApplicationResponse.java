package com.opportunityshield.applications;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobApplicationResponse {

    private Long id;
    private String company;
    private String jobTitle;
    private String sourceUrl;
    private LocalDate applicationDate;
    private ApplicationStatus status;
    private LocalDate deadline;
    private LocalDateTime interviewDate;
    private String notes;
    private LocalDate nextFollowUp;
    private String salary;
    private String location;
    private String safetyFlag;
    private boolean isSampleData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobApplicationResponse() {}

    public static JobApplicationResponse fromEntity(JobApplication entity) {
        JobApplicationResponse res = new JobApplicationResponse();
        res.setId(entity.getId());
        res.setCompany(entity.getCompany());
        res.setJobTitle(entity.getJobTitle());
        res.setSourceUrl(entity.getSourceUrl());
        res.setApplicationDate(entity.getApplicationDate());
        res.setStatus(entity.getStatus());
        res.setDeadline(entity.getDeadline());
        res.setInterviewDate(entity.getInterviewDate());
        res.setNotes(entity.getNotes());
        res.setNextFollowUp(entity.getNextFollowUp());
        res.setSalary(entity.getSalary());
        res.setLocation(entity.getLocation());
        res.setSafetyFlag(entity.getSafetyFlag());
        res.setIsSampleData(entity.isSampleData());
        res.setCreatedAt(entity.getCreatedAt());
        res.setUpdatedAt(entity.getUpdatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public LocalDateTime getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDateTime interviewDate) {
        this.interviewDate = interviewDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getNextFollowUp() {
        return nextFollowUp;
    }

    public void setNextFollowUp(LocalDate nextFollowUp) {
        this.nextFollowUp = nextFollowUp;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSafetyFlag() {
        return safetyFlag;
    }

    public void setSafetyFlag(String safetyFlag) {
        this.safetyFlag = safetyFlag;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
