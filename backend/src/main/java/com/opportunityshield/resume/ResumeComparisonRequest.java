package com.opportunityshield.resume;

import jakarta.validation.constraints.NotBlank;

public class ResumeComparisonRequest {

    @NotBlank(message = "Resume text is required")
    private String resumeText;

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    public ResumeComparisonRequest() {}

    public ResumeComparisonRequest(String resumeText, String jobDescription) {
        this.resumeText = resumeText;
        this.jobDescription = jobDescription;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}
