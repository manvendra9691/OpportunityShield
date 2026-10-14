package com.opportunityshield.safety;

public class SafetyCheckRequest {

    private String companyName;
    private String jobUrl;
    private String jobText;
    private String recruiterMessage;

    public SafetyCheckRequest() {}

    public SafetyCheckRequest(String companyName, String jobUrl, String jobText, String recruiterMessage) {
        this.companyName = companyName;
        this.jobUrl = jobUrl;
        this.jobText = jobText;
        this.recruiterMessage = recruiterMessage;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public String getJobText() {
        return jobText;
    }

    public void setJobText(String jobText) {
        this.jobText = jobText;
    }

    public String getRecruiterMessage() {
        return recruiterMessage;
    }

    public void setRecruiterMessage(String recruiterMessage) {
        this.recruiterMessage = recruiterMessage;
    }
}
