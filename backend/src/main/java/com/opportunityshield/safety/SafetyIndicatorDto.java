package com.opportunityshield.safety;

public class SafetyIndicatorDto {

    private String id;
    private String category;
    private String severity; // HIGH, MEDIUM, LOW
    private String title;
    private String description;
    private String matchedEvidence;

    public SafetyIndicatorDto() {}

    public SafetyIndicatorDto(String id, String category, String severity, String title, String description, String matchedEvidence) {
        this.id = id;
        this.category = category;
        this.severity = severity;
        this.title = title;
        this.description = description;
        this.matchedEvidence = matchedEvidence;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMatchedEvidence() {
        return matchedEvidence;
    }

    public void setMatchedEvidence(String matchedEvidence) {
        this.matchedEvidence = matchedEvidence;
    }
}
