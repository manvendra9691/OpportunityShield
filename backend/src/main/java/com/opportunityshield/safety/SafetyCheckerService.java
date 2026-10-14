package com.opportunityshield.safety;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SafetyCheckerService {

    private static class Rule {
        String id;
        String category;
        String severity;
        String title;
        String description;
        Pattern pattern;
        String recommendation;

        Rule(String id, String category, String severity, String title, String description, String regex, String recommendation) {
            this.id = id;
            this.category = category;
            this.severity = severity;
            this.title = title;
            this.description = description;
            this.pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
            this.recommendation = recommendation;
        }
    }

    private final List<Rule> rules = Arrays.asList(
        new Rule(
            "FEE_CHECK_EQUIPMENT", "FINANCIAL", "HIGH",
            "Fake Check / Equipment Purchase Demand",
            "Mentions sending a check to purchase home office equipment, software, or supplies from an authorized vendor.",
            "(fake check|send (you )?(a )?(?:cashier(?:'s|s)? )?check|cashier(?:'s|s)? check|mobile deposit|purchase (?:your own |home office )?(?:equipment|materials|laptop|supplies)|authorized vendor|deposit (the|this) check|reimburse (via|through) (zelle|wire|crypto))",
            "Legitimate employers provide equipment directly or pay vendors directly. Never deposit an unexpected check and wire funds."
        ),
        new Rule(
            "FEE_APPLICATION_TRAINING", "FINANCIAL", "HIGH",
            "Upfront Payment or Application Fee",
            "Requires payment for training, background checks, registration, or software onboarding.",
            "(pay (an?|the) (application|registration|processing|training|onboarding) fee|upfront (fee|payment|cost)|pay for (your )?(background check|certification)|non-refundable deposit)",
            "Legitimate employers cover recruitment, onboarding, and standard screening costs."
        ),
        new Rule(
            "PAYMENT_CRYPTO_WIRE", "FINANCIAL", "HIGH",
            "Irreversible Payment Methods Mentioned",
            "References cryptocurrency, gift cards, MoneyGram, Western Union, or Zelle transfers.",
            "(cryptocurrency|bitcoin|usdt|ethereum|gift card|apple gift card|western union|moneygram|cash app|wire transfer to)",
            "Employment offers should never involve sending or receiving money through cryptocurrency or retail gift cards."
        ),
        new Rule(
            "COMM_TELEGRAM_WHATSAPP", "COMMUNICATION", "HIGH",
            "Interview via Chat App (Telegram / WhatsApp / Signal)",
            "Directs the candidate to conduct text-only interviews or submit documents over chat platforms.",
            "(interview via (telegram|whatsapp|signal|google chat|skype text)|download telegram|contact (our|the) hiring manager on telegram|connect on whatsapp)",
            "Corporate hiring teams use official enterprise email domains, ATS portals, or structured video/in-person meetings."
        ),
        new Rule(
            "COMM_FREE_EMAIL_DOMAIN", "COMMUNICATION", "MEDIUM",
            "Free Webmail Address for Company Hiring",
            "Recruiter uses a free webmail domain (@gmail.com, @yahoo.com) instead of corporate domain.",
            "(@gmail\\.com|@yahoo\\.com|@outlook\\.com|@hotmail\\.com|@mail\\.com|@protonmail\\.com)",
            "Verify whether sender actually matches the official domain of the company they claim to represent."
        ),
        new Rule(
            "COMP_UNREALISTIC_PAY", "COMPENSATION", "MEDIUM",
            "Disproportionate Compensation for Low/No Experience",
            "Offers extreme hourly/weekly pay ($60-$120+/hr) for entry-level, data entry, or typing.",
            "(\\$(?:[6-9]\\d|1\\d\\d)\\s*(?:/|\\s*per\\s*)hr|\\$(?:3000|4000|5000|6000)\\s*(?:/|\\s*per\\s*)week|no experience required.{0,40}\\$(?:[5-9]\\d|1\\d\\d)|earn \\$[1-9]\\d{3,4}\\s*(daily|weekly))",
            "Compare typical market salaries for this job title on verified platforms."
        ),
        new Rule(
            "PROC_IMMEDIATE_OFFER", "PROCEDURE", "HIGH",
            "Immediate Job Offer Without Substantive Interview",
            "Claims you are already hired without a multi-stage technical or behavioral interview.",
            "(you have been (selected|hired) immediately|immediate employment|no interview (needed|required)|hired on the spot|congratulations you are hired)",
            "Genuine companies require multi-stage interviews and formal written offer letters before hiring."
        ),
        new Rule(
            "IDENTITY_PREMATURE_SSN_BANK", "IDENTITY", "HIGH",
            "Premature Request for Banking or SSN Information",
            "Requests direct deposit bank account details or SSN prior to contract signing.",
            "(provide (your )?(ssn|social security number|bank account|direct deposit info|routing number) (to receive|for the offer|immediately)|send picture of your id and bank)",
            "Never disclose banking or tax identity details until you independently verify the employer and review an official contract."
        )
    );

    public SafetyCheckResponse evaluate(SafetyCheckRequest request) {
        String combinedText = String.join("\n",
                request.getCompanyName() != null ? request.getCompanyName() : "",
                request.getJobText() != null ? request.getJobText() : "",
                request.getRecruiterMessage() != null ? request.getRecruiterMessage() : "",
                request.getJobUrl() != null ? request.getJobUrl() : ""
        );

        List<SafetyIndicatorDto> detected = new ArrayList<>();
        List<String> evidence = new ArrayList<>();
        int scoreSum = 0;

        for (Rule rule : rules) {
            Matcher matcher = rule.pattern.matcher(combinedText);
            if (matcher.find()) {
                String match = matcher.group();
                detected.add(new SafetyIndicatorDto(
                        rule.id,
                        rule.category,
                        rule.severity,
                        rule.title,
                        rule.description + " Recommendation: " + rule.recommendation,
                        "\"..." + match + "...\""
                ));
                evidence.add("Triggered [" + rule.title + "]: Found \"" + match + "\" in submitted content.");
                scoreSum += "HIGH".equals(rule.severity) ? 35 : "MEDIUM".equals(rule.severity) ? 20 : 10;
            }
        }

        // Static URL heuristic check (SSRF Safe - No outbound network calls made)
        if (request.getJobUrl() != null && !request.getJobUrl().trim().isEmpty()) {
            checkUrlHeuristics(request.getJobUrl().trim(), detected, evidence);
        }

        int normalizedScore = Math.min(100, scoreSum);
        String riskLevel = "NO_WARNINGS_FOUND";
        String title = "No Configured Warning Signs Found";
        String summary = "None of our configured red-flag patterns were detected in the submitted text. However, scammers frequently evolve techniques. Always perform standard verification.";

        if (normalizedScore >= 35 || detected.stream().anyMatch(i -> "HIGH".equals(i.getSeverity()))) {
            riskLevel = "WARNING_SIGNS_FOUND";
            title = "Warning Signs Found";
            summary = "Multiple high-risk indicators or known recruitment scam patterns were detected. Exercise extreme caution before proceeding.";
        } else if (!detected.isEmpty() || normalizedScore > 0) {
            riskLevel = "NEEDS_VERIFICATION";
            title = "Needs Verification";
            summary = "Some elements warrant scrutiny before sharing sensitive personal details or making commitments. Follow the suggested verification checklist.";
        }

        SafetyCheckResponse response = new SafetyCheckResponse();
        response.setRiskLevel(riskLevel);
        response.setRiskScore(normalizedScore);
        response.setTitle(title);
        response.setSummary(summary);
        response.setIndicators(detected);
        response.setSupportingEvidence(evidence);
        response.setSuggestedSteps(generateSteps(detected, request.getCompanyName()));
        response.setLimitations(Arrays.asList(
                "Automated rule matching evaluates text patterns and cannot verify real-world legal incorporation or offline credentials.",
                "Scammers may spoof legitimate company names and official logos.",
                "No automated tool can definitively declare an employer to be 100% genuine or 100% fraudulent.",
                "Submitted URLs are analyzed using static heuristics. Live fetching across external or private networks is disabled to prevent SSRF vulnerabilities."
        ));
        response.setAnalyzedAt(LocalDateTime.now());
        return response;
    }

    private void checkUrlHeuristics(String url, List<SafetyIndicatorDto> detected, List<String> evidence) {
        try {
            URI uri = URI.create(url.startsWith("http") ? url : "https://" + url);
            String host = uri.getHost();
            if (host != null) {
                if (host.matches(".*\\.(xyz|top|work|click|loan|gq|cf|ml|tk|fit|rest)$")) {
                    detected.add(new SafetyIndicatorDto(
                            "URL_SUSPICIOUS_TLD", "IDENTITY", "MEDIUM",
                            "Unusual Top-Level Domain (.xyz, .top, .work)",
                            "The domain \"" + host + "\" uses a TLD frequently associated with temporary phishing links.",
                            host
                    ));
                    evidence.add("URL Warning: Detected suspicious TLD in " + host);
                }
                if (host.matches("^(\\d{1,3}\\.){3}\\d{1,3}$") || "localhost".equalsIgnoreCase(host)) {
                    detected.add(new SafetyIndicatorDto(
                            "URL_RAW_IP_OR_LOCAL", "IDENTITY", "HIGH",
                            "Suspicious IP Address or Local Hostname",
                            "URL points to a raw IP address or localhost rather than a registered enterprise corporate domain.",
                            host
                    ));
                    evidence.add("URL Warning: Direct IP host address detected.");
                }
            }
        } catch (Exception e) {
            // Malformed URL heuristic
            detected.add(new SafetyIndicatorDto(
                    "URL_INVALID_FORMAT", "IDENTITY", "LOW",
                    "Malformed URL",
                    "The provided URL could not be parsed as a standard web domain.",
                    url
            ));
        }
    }

    private List<String> generateSteps(List<SafetyIndicatorDto> indicators, String company) {
        List<String> steps = new ArrayList<>();
        steps.add("Search the official company website directly: navigate to the company's verified primary domain and check their active 'Careers' portal.");
        steps.add("Cross-reference the recruiter: Search for the recruiter on LinkedIn and confirm they actively work at " + (company != null ? company : "the company") + ".");
        steps.add("Verify sender domain: Ensure correspondence comes from @company.com, not free webmail (@gmail) or slight lookalikes.");
        steps.add("Refuse upfront payments: Never purchase equipment via check, wire, cryptocurrency, or gift cards under any circumstances.");
        steps.add("Protect personal data: Never provide Social Security numbers, banking details, or passport scans before verifying a written contract.");

        if (indicators.stream().anyMatch(i -> "FINANCIAL".equals(i.getCategory()))) {
            steps.add(0, "CRITICAL: Cease any financial transactions. Report fake check or wire instructions to your bank immediately.");
        }
        if (indicators.stream().anyMatch(i -> "COMM_TELEGRAM_WHATSAPP".equals(i.getId()))) {
            steps.add(0, "Insist on communicating through verified corporate email and schedule a live video or in-person interview.");
        }
        return steps;
    }
}
