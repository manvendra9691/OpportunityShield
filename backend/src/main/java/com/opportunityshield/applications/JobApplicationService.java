package com.opportunityshield.applications;

import com.opportunityshield.auth.User;
import com.opportunityshield.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplicationResponse> getAllApplications(User user, ApplicationStatus status) {
        List<JobApplication> list;
        if (status != null) {
            list = repository.findByUserIdAndStatusOrderByApplicationDateDesc(user.getId(), status);
        } else {
            list = repository.findByUserIdOrderByApplicationDateDesc(user.getId());
        }
        return list.stream()
                .map(JobApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse getApplicationById(Long id, User user) {
        JobApplication application = repository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id));
        return JobApplicationResponse.fromEntity(application);
    }

    @Transactional
    public JobApplicationResponse createApplication(JobApplicationRequest request, User user) {
        JobApplication app = new JobApplication();
        app.setUser(user);
        mapRequestToEntity(request, app);
        app.setCreatedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());

        JobApplication saved = repository.save(app);
        return JobApplicationResponse.fromEntity(saved);
    }

    @Transactional
    public JobApplicationResponse updateApplication(Long id, JobApplicationRequest request, User user) {
        JobApplication app = repository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id));

        mapRequestToEntity(request, app);
        app.setUpdatedAt(LocalDateTime.now());

        JobApplication saved = repository.save(app);
        return JobApplicationResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteApplication(Long id, User user) {
        JobApplication app = repository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with ID: " + id));
        repository.delete(app);
    }

    private void mapRequestToEntity(JobApplicationRequest request, JobApplication app) {
        app.setCompany(request.getCompany().trim());
        app.setJobTitle(request.getJobTitle().trim());
        app.setSourceUrl(request.getSourceUrl() != null ? request.getSourceUrl().trim() : null);
        app.setApplicationDate(request.getApplicationDate());
        app.setStatus(request.getStatus());
        app.setDeadline(request.getDeadline());
        app.setInterviewDate(request.getInterviewDate());
        app.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        app.setNextFollowUp(request.getNextFollowUp());
        app.setSalary(request.getSalary() != null ? request.getSalary().trim() : null);
        app.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        app.setSafetyFlag(request.getSafetyFlag() != null ? request.getSafetyFlag() : "SAFE");
        app.setSampleData(request.getIsSampleData() != null ? request.getIsSampleData() : false);
    }
}
