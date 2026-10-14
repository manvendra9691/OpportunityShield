package com.opportunityshield.reminders;

import com.opportunityshield.applications.JobApplication;
import com.opportunityshield.applications.JobApplicationRepository;
import com.opportunityshield.auth.User;
import com.opportunityshield.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final JobApplicationRepository applicationRepository;

    public ReminderService(ReminderRepository reminderRepository, JobApplicationRepository applicationRepository) {
        this.reminderRepository = reminderRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<ReminderResponse> getReminders(User user) {
        return reminderRepository.findByUserIdOrderByDueDateAsc(user.getId())
                .stream()
                .map(ReminderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReminderResponse createReminder(ReminderRequest request, User user) {
        Reminder reminder = new Reminder();
        reminder.setUser(user);
        reminder.setCompany(request.getCompany().trim());
        reminder.setTitle(request.getTitle().trim());
        reminder.setDueDate(request.getDueDate());
        reminder.setType(request.getType());
        reminder.setCompleted(request.getCompleted() != null ? request.getCompleted() : false);
        reminder.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        reminder.setSampleData(request.getIsSampleData() != null ? request.getIsSampleData() : false);
        reminder.setCreatedAt(LocalDateTime.now());

        if (request.getApplicationId() != null) {
            JobApplication app = applicationRepository.findByIdAndUserId(request.getApplicationId(), user.getId())
                    .orElse(null);
            reminder.setApplication(app);
        }

        Reminder saved = reminderRepository.save(reminder);
        return ReminderResponse.fromEntity(saved);
    }

    @Transactional
    public ReminderResponse toggleCompletion(Long id, User user) {
        Reminder reminder = reminderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with ID: " + id));

        reminder.setCompleted(!reminder.isCompleted());
        Reminder saved = reminderRepository.save(reminder);
        return ReminderResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteReminder(Long id, User user) {
        Reminder reminder = reminderRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with ID: " + id));
        reminderRepository.delete(reminder);
    }
}
