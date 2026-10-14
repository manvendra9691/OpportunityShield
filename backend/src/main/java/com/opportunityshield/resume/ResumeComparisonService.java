package com.opportunityshield.resume;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ResumeComparisonService {

    private static final List<String> KNOWN_SKILLS = Arrays.asList(
        // Languages
        "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "Bash",
        // Frontend
        "React", "Vue", "Angular", "Next.js", "Vite", "Tailwind CSS", "Redux", "HTML5", "CSS3", "WebSockets", "GraphQL", "REST API",
        // Backend & Cloud
        "Spring Boot", "Node.js", "Express", "Django", "FastAPI", "NestJS", "Microservices", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
        // Databases
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Flyway", "Hibernate", "JPA", "Elasticsearch",
        // Security & Best Practices
        "OAuth2", "JWT", "Spring Security", "SSRF Prevention", "OWASP", "Unit Testing", "CI/CD", "Git", "GitHub Actions",
        // System Design & Architecture
        "System Design", "Agile", "Scrum", "Kafka", "RabbitMQ", "Architecture", "OpenAPI", "Swagger"
    );

    public ResumeComparisonResponse compare(ResumeComparisonRequest request) {
        String resumeLower = request.getResumeText().toLowerCase();
        String jobLower = request.getJobDescription().toLowerCase();

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String skill : KNOWN_SKILLS) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(skill.toLowerCase()) + "\\b");
            boolean inJob = pattern.matcher(jobLower).find();
            boolean inResume = pattern.matcher(resumeLower).find();

            if (inJob && inResume) {
                matched.add(skill);
            } else if (inJob) {
                missing.add(skill);
            }
        }

        int totalJobSkills = matched.size() + missing.size();
        int score = totalJobSkills == 0 ? 0 : Math.round(((float) matched.size() / totalJobSkills) * 100);

        List<String> recommendations = new ArrayList<>();
        if (!missing.isEmpty()) {
            recommendations.add("Job description emphasizes keywords: " + String.join(", ", missing.subList(0, Math.min(5, missing.size())))
                    + ". If you possess genuine experience with any of these, consider explicitly describing projects or responsibilities utilizing them.");
        }
        if (!matched.isEmpty()) {
            recommendations.add("Strong alignment found on: " + String.join(", ", matched.subList(0, Math.min(6, matched.size())))
                    + ". Highlight measurable achievements and metrics associated with these competencies in your bullet points.");
        }
        recommendations.add("Honesty Principle: Never fabricate experience or copy-paste keywords you cannot defend in a technical interview.");
        recommendations.add("Privacy Guarantee (Zero Retention): Your resume and the job description are processed strictly in-memory and are not retained.");

        int wordCountResume = countWords(request.getResumeText());
        int wordCountJob = countWords(request.getJobDescription());

        return new ResumeComparisonResponse(score, matched, missing, recommendations, wordCountResume, wordCountJob, LocalDateTime.now());
    }

    private int countWords(String s) {
        if (s == null || s.trim().isEmpty()) return 0;
        return s.trim().split("\\s+").length;
    }
}
