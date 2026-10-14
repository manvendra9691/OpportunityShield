package com.opportunityshield.applications;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobApplicationRequest {

    @NotBlank(message = "Company name is required")
    private String company;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String sourceUrl;

    @NotNull(message = "Application date is required")
    private LocalDate applicationDate;

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;

    private LocalDate deadline;
    private LocalDateTime interviewDate;
    private String notes;
    private LocalDate nextFollowUp;
    private String salary;
    private String location;
    private String safetyFlag;
    private Boolean isSampleData;

    public JobApplicationRequest() {}

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

    public Boolean getIsSampleData() {
        return isSampleData;
    }

    public void setIsSampleData(Boolean isSampleData) {
        this.isSampleData = isSampleData;
    }
}
