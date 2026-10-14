package com.opportunityshield.safety;

import java.time.LocalDateTime;
import java.util.List;

public class SafetyCheckResponse {

    private String riskLevel; // 'WARNING_SIGNS_FOUND', 'NEEDS_VERIFICATION', 'NO_WARNINGS_FOUND'
    private int riskScore; // 0 to 100
    private String title;
    private String summary;
    private List<SafetyIndicatorDto> indicators;
    private List<String> supportingEvidence;
    private List<String> limitations;
    private List<String> suggestedSteps;
    private LocalDateTime analyzedAt;

    public SafetyCheckResponse() {}

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<SafetyIndicatorDto> getIndicators() {
        return indicators;
    }

    public void setIndicators(List<SafetyIndicatorDto> indicators) {
        this.indicators = indicators;
    }

    public List<String> getSupportingEvidence() {
        return supportingEvidence;
    }

    public void setSupportingEvidence(List<String> supportingEvidence) {
        this.supportingEvidence = supportingEvidence;
    }

    public List<String> getLimitations() {
        return limitations;
    }

    public void setLimitations(List<String> limitations) {
        this.limitations = limitations;
    }

    public List<String> getSuggestedSteps() {
        return suggestedSteps;
    }

    public void setSuggestedSteps(List<String> suggestedSteps) {
        this.suggestedSteps = suggestedSteps;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}
