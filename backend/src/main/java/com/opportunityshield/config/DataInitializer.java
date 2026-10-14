package com.opportunityshield.config;

import com.opportunityshield.applications.ApplicationStatus;
import com.opportunityshield.applications.JobApplication;
import com.opportunityshield.applications.JobApplicationRepository;
import com.opportunityshield.auth.User;
import com.opportunityshield.auth.UserRepository;
import com.opportunityshield.reminders.Reminder;
import com.opportunityshield.reminders.ReminderRepository;
import com.opportunityshield.reminders.ReminderType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobApplicationRepository applicationRepository;
    private final ReminderRepository reminderRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           JobApplicationRepository applicationRepository,
                           ReminderRepository reminderRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.reminderRepository = reminderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure candidate1 demo user exists with valid BCrypt hash
        User user1 = userRepository.findByEmail("candidate1@opportunityshield.org").orElseGet(() -> {
            User u = new User("candidate1@opportunityshield.org", passwordEncoder.encode("Password123!"), "Alex Morgan (Demo User 1)", "ROLE_USER");
            return userRepository.save(u);
        });
        user1.setPasswordHash(passwordEncoder.encode("Password123!"));
        userRepository.save(user1);

        // Ensure candidate2 demo user exists with valid BCrypt hash
        User user2 = userRepository.findByEmail("candidate2@opportunityshield.org").orElseGet(() -> {
            User u = new User("candidate2@opportunityshield.org", passwordEncoder.encode("Password123!"), "Jordan Taylor (Demo User 2)", "ROLE_USER");
            return userRepository.save(u);
        });
        user2.setPasswordHash(passwordEncoder.encode("Password123!"));
        userRepository.save(user2);

        // Seed realistic sample applications for candidate1 if none exist
        if (applicationRepository.findByUserIdOrderByApplicationDateDesc(user1.getId()).isEmpty()) {
            JobApplication app1 = new JobApplication();
            app1.setUser(user1);
            app1.setCompany("Acme Cloud Solutions");
            app1.setJobTitle("Senior Full-Stack Engineer");
            app1.setSourceUrl("https://careers.acmecloud.example/jobs/9482");
            app1.setApplicationDate(LocalDate.now().minusDays(12));
            app1.setStatus(ApplicationStatus.Applied);
            app1.setDeadline(LocalDate.now().plusDays(10));
            app1.setNextFollowUp(LocalDate.now().plusDays(4));
            app1.setSalary("$145,000 - $165,000");
            app1.setLocation("Remote (US)");
            app1.setNotes("Referral from former colleague. Tech stack: React, TypeScript, Spring Boot, MySQL.");
            app1.setSafetyFlag("SAFE");
            app1.setSampleData(true);
            applicationRepository.save(app1);

            JobApplication app2 = new JobApplication();
            app2.setUser(user1);
            app2.setCompany("FinTech Vanguard");
            app2.setJobTitle("Frontend Platform Specialist");
            app2.setSourceUrl("https://fintechvanguard.example/join");
            app2.setApplicationDate(LocalDate.now().minusDays(16));
            app2.setStatus(ApplicationStatus.Interview);
            app2.setDeadline(LocalDate.now().plusDays(6));
            app2.setInterviewDate(LocalDateTime.now().plusDays(2).withHour(14).withMinute(0));
            app2.setSalary("$160,000 - $180,000");
            app2.setLocation("Hybrid (New York, NY)");
            app2.setNotes("Round 2 System Architecture & Component Design interview with Staff Engineer.");
            app2.setSafetyFlag("SAFE");
            app2.setSampleData(true);
            applicationRepository.save(app2);

            JobApplication app3 = new JobApplication();
            app3.setUser(user1);
            app3.setCompany("Apex Global Logistics (Unverified)");
            app3.setJobTitle("Remote Data Processor - $95/hr");
            app3.setSourceUrl("https://apex-careers-fastjobs.work/apply");
            app3.setApplicationDate(LocalDate.now().minusDays(3));
            app3.setStatus(ApplicationStatus.Saved);
            app3.setDeadline(LocalDate.now().plusDays(2));
            app3.setSalary("$95/hr ($190,000/yr)");
            app3.setLocation("Remote anywhere");
            app3.setNotes("Received unsolicited outreach. Recruiter insisted on Telegram interview and offered cashier check for home office setup. Flagged as high-risk scam.");
            app3.setSafetyFlag("SUSPICIOUS");
            app3.setSampleData(true);
            applicationRepository.save(app3);

            // Reminders
            Reminder rem1 = new Reminder();
            rem1.setUser(user1);
            rem1.setApplication(app2);
            rem1.setCompany("FinTech Vanguard");
            rem1.setTitle("Round 2 Technical Interview (System Architecture)");
            rem1.setDueDate(LocalDate.now().plusDays(2));
            rem1.setType(ReminderType.INTERVIEW);
            rem1.setCompleted(false);
            rem1.setNotes("Prepare whiteboard designs for high-throughput WebSocket feeds.");
            rem1.setSampleData(true);
            reminderRepository.save(rem1);
        }
    }
}
