package com.opportunityshield.applications;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserIdOrderByApplicationDateDesc(Long userId);

    List<JobApplication> findByUserIdAndStatusOrderByApplicationDateDesc(Long userId, ApplicationStatus status);

    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}
