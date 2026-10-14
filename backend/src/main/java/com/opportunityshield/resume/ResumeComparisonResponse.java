package com.opportunityshield.resume;

import java.time.LocalDateTime;
import java.util.List;

public class ResumeComparisonResponse {

    private int matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> recommendations;
    private int wordCountResume;
    private int wordCountJob;
    private LocalDateTime analyzedAt;

    public ResumeComparisonResponse() {}

    public ResumeComparisonResponse(int matchScore, List<String> matchedSkills, List<String> missingSkills,
                                    List<String> recommendations, int wordCountResume, int wordCountJob, LocalDateTime analyzedAt) {
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.recommendations = recommendations;
        this.wordCountResume = wordCountResume;
        this.wordCountJob = wordCountJob;
        this.analyzedAt = analyzedAt;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public int getWordCountResume() {
        return wordCountResume;
    }

    public void setWordCountResume(int wordCountResume) {
        this.wordCountResume = wordCountResume;
    }

    public int getWordCountJob() {
        return wordCountJob;
    }

    public void setWordCountJob(int wordCountJob) {
        this.wordCountJob = wordCountJob;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}
