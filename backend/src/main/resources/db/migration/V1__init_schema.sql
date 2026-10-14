-- ============================================================
-- OpportunityShield V1 Flyway Migration: Initial Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company VARCHAR(200) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    source_url VARCHAR(1000),
    application_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    deadline DATE,
    interview_date DATETIME,
    notes TEXT,
    next_follow_up DATE,
    salary VARCHAR(100),
    location VARCHAR(150),
    safety_flag VARCHAR(50) DEFAULT 'SAFE',
    is_sample_data BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    application_id BIGINT,
    company VARCHAR(200) NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    is_sample_data BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rem_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rem_app FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE
);

CREATE INDEX idx_job_app_user ON job_applications(user_id);
CREATE INDEX idx_job_app_status ON job_applications(status);
CREATE INDEX idx_reminder_user ON reminders(user_id);
CREATE INDEX idx_reminder_due_date ON reminders(due_date);

-- Seed Initial Test Users for Multi-User Access Control
-- Password for both accounts is 'Password123!' (BCrypt encoded)
INSERT INTO users (email, password_hash, full_name, role)
VALUES 
('candidate1@opportunityshield.org', '$2a$10$7ZzSfxuW/sO4dkn.jNl2uO5pZ4e.O8H91o2Z28v/M7pP93jR1y/c2', 'Alex Morgan (Candidate 1)', 'ROLE_USER'),
('candidate2@opportunityshield.org', '$2a$10$7ZzSfxuW/sO4dkn.jNl2uO5pZ4e.O8H91o2Z28v/M7pP93jR1y/c2', 'Jordan Taylor (Candidate 2)', 'ROLE_USER');
