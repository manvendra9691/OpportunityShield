import type { JobApplication, ReminderItem } from '../types';

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'demo-app-1',
    company: 'Acme Cloud Solutions',
    jobTitle: 'Senior Full-Stack Engineer',
    sourceUrl: 'https://careers.acmecloud.example/jobs/9482',
    applicationDate: '2026-10-02',
    status: 'Applied',
    deadline: '2026-10-25',
    notes: 'Submitted via company career portal. Referral from former colleague. Tech stack: React, TypeScript, Spring Boot, MySQL.',
    nextFollowUp: '2026-10-18',
    salary: '$145,000 - $165,000',
    location: 'Remote / US',
    safetyFlag: 'SAFE',
    isSampleData: true,
  },
  {
    id: 'demo-app-2',
    company: 'FinTech Vanguard',
    jobTitle: 'Frontend Platform Specialist',
    sourceUrl: 'https://fintechvanguard.example/join',
    applicationDate: '2026-09-28',
    status: 'Interview',
    deadline: '2026-10-20',
    interviewDate: '2026-10-16T14:00',
    notes: 'Round 2 System Architecture & Component Design interview with Staff Engineer. Verified company on LinkedIn and verified official domain.',
    nextFollowUp: '2026-10-17',
    salary: '$160,000 - $180,000',
    location: 'Hybrid (New York, NY)',
    safetyFlag: 'SAFE',
    isSampleData: true,
  },
  {
    id: 'demo-app-3',
    company: 'Apex Global Logistics (Unverified)',
    jobTitle: 'Remote Data Processor - $95/hr',
    sourceUrl: 'https://apex-careers-fastjobs.work/apply',
    applicationDate: '2026-10-10',
    status: 'Saved',
    deadline: '2026-10-15',
    notes: 'Received unsolicited outreach. Recruiter insisted on Telegram interview and offered cashier check for home office setup. Flagged as high-risk scam.',
    nextFollowUp: '2026-10-14',
    salary: '$95/hr ($190,000/yr)',
    location: 'Remote anywhere',
    safetyFlag: 'SUSPICIOUS',
    isSampleData: true,
  },
  {
    id: 'demo-app-4',
    company: 'CyberTrust Systems',
    jobTitle: 'Product Security Architect',
    sourceUrl: 'https://cybertrust.example/jobs/sec-arch',
    applicationDate: '2026-10-05',
    status: 'Assessment',
    deadline: '2026-10-18',
    notes: 'Completed 48-hour secure code review assessment on GitHub classroom. Awaiting review feedback.',
    nextFollowUp: '2026-10-19',
    salary: '$170,000 - $195,000',
    location: 'Remote',
    safetyFlag: 'SAFE',
    isSampleData: true,
  },
  {
    id: 'demo-app-5',
    company: 'Nexus Mobile Labs',
    jobTitle: 'React Native & Web Engineer',
    sourceUrl: 'https://nexusmobile.example/careers',
    applicationDate: '2026-09-15',
    status: 'Offer',
    deadline: '2026-10-22',
    notes: 'Official written offer letter received from genuine HR domain. Reviewing compensation package and healthcare benefits.',
    nextFollowUp: '2026-10-21',
    salary: '$155,000 + Equity',
    location: 'San Francisco, CA',
    safetyFlag: 'SAFE',
    isSampleData: true,
  },
  {
    id: 'demo-app-6',
    company: 'Legacy Core Banking',
    jobTitle: 'Lead Java Backend Architect',
    sourceUrl: 'https://legacybanking.example/jobs/110',
    applicationDate: '2026-09-10',
    status: 'Rejected',
    notes: 'Role closed due to internal promotion. Polite rejection email received. Good contact preserved with technical recruiter for future positions.',
    salary: '$165,000',
    location: 'Chicago, IL',
    safetyFlag: 'SAFE',
    isSampleData: true,
  },
  {
    id: 'demo-app-7',
    company: 'Starlight Media Studios',
    jobTitle: 'Senior UI/UX Engineer',
    sourceUrl: 'https://starlightmedia.example/careers',
    applicationDate: '2026-09-20',
    status: 'Withdrawn',
    notes: 'Withdrew candidacy after learning required 5 days/week on-site relocation did not align with current family needs.',
    salary: '$140,000',
    location: 'Los Angeles, CA',
    safetyFlag: 'SAFE',
    isSampleData: true,
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'demo-rem-1',
    applicationId: 'demo-app-2',
    company: 'FinTech Vanguard',
    title: 'Round 2 Technical Interview (System Architecture)',
    dueDate: '2026-10-16',
    type: 'INTERVIEW',
    completed: false,
    notes: 'Prepare whiteboard designs for high-throughput WebSocket transaction feeds and state isolation.',
    isSampleData: true,
  },
  {
    id: 'demo-rem-2',
    applicationId: 'demo-app-1',
    company: 'Acme Cloud Solutions',
    title: 'Check Application Status & Follow Up via Recruiter',
    dueDate: '2026-10-18',
    type: 'FOLLOW_UP',
    completed: false,
    notes: 'Send polite email to recruiter inquiring if any additional code samples or references are required.',
    isSampleData: true,
  },
  {
    id: 'demo-rem-3',
    applicationId: 'demo-app-4',
    company: 'CyberTrust Systems',
    title: 'Security Take-Home Code Assessment Deadline',
    dueDate: '2026-10-18',
    type: 'DEADLINE',
    completed: false,
    notes: 'Double check repository commits and ensure all linting and test scripts pass cleanly.',
    isSampleData: true,
  },
  {
    id: 'demo-rem-4',
    applicationId: 'demo-app-5',
    company: 'Nexus Mobile Labs',
    title: 'Offer Decision Deadline',
    dueDate: '2026-10-22',
    type: 'DEADLINE',
    completed: false,
    notes: 'Compare 401(k) vesting schedule and health plans before final decision.',
    isSampleData: true,
  },
];

export const DEMO_SAFETY_SAMPLES = {
  scamSample: {
    company: 'Global Talent Partners Inc.',
    jobUrl: 'http://globaltalent-careers-portal.xyz/apply',
    jobText: `Remote Executive Data Entry & Administrative Coordinator.
Salary: $95/hr. Full benefits from Day 1. No experience required. We will train you completely.
Duties: Process daily invoices and receive financial spreadsheets from home. Flexible hours (work whenever you want).`,
    recruiterMessage: `Hello candidate! Congratulations, our hiring team reviewed your online profile and you have been selected immediately for the position. There is no interview needed because we are impressed by your background.
To start immediately, please contact our hiring manager on Telegram at @GlobalTalentHrManager to receive your employment packet.
We will send you a cashier's check to purchase your home office equipment and laptop from our authorized vendor. Once you deposit the check, please wire the funds via Zelle or Bitcoin to our vendor. Please also provide your SSN and direct deposit info immediately.`,
  },
  legitSample: {
    company: 'Stripe, Inc.',
    jobUrl: 'https://stripe.com/jobs/search/senior-backend-engineer',
    jobText: `Senior Backend Engineer - Global Payments Infrastructure
At Stripe, we're building the infrastructure for internet commerce.
Requirements:
- 5+ years building distributed systems in Java, Go, or Ruby
- Experience with relational databases like MySQL or PostgreSQL
- Strong foundation in API design (REST/gRPC) and system reliability
- BS/MS in Computer Science or equivalent practical experience
We offer competitive base salary, equity, 401(k) matching, and comprehensive healthcare.`,
    recruiterMessage: `Hi Alex, I'm a technical recruiter at Stripe. I came across your GitHub and open-source contributions to web frameworks. We're currently expanding our Core API platform team and think your background would be a great fit. If you're open to exploring new roles, I'd love to set up a 20-minute phone chat through our official scheduling link. You can also view the role and our team's work directly at stripe.com/jobs. Best, Sarah (sarah.recruiter@stripe.com).`,
  },
  ambiguousSample: {
    company: 'Vertex Digital Solutions LLC',
    jobUrl: 'https://vertexdigital.example/hiring-2026',
    jobText: `Junior React & TypeScript Developer.
Salary: $65,000 - $75,000 / year.
Requirements: Basic proficiency in React, HTML, CSS, Git. Willingness to learn on the job.`,
    recruiterMessage: `Hello, thanks for expressing interest in our developer role. Please connect with our team on WhatsApp at +1-555-0199 for an initial screen. Also, there is a $45 onboarding fee for your background check certification. We require immediate response within 4 hours.`,
  },
};

export const DEMO_RESUME_SAMPLE = `ALEX MORGAN
Senior Software Engineer | alex.morgan.dev@example.com | (555) 234-5678
GitHub: github.com/alexm-dev | LinkedIn: linkedin.com/in/alexm-dev

PROFESSIONAL SUMMARY
Experienced full-stack engineer with 6+ years designing scalable cloud architectures, reactive web applications, and resilient microservices. Adept at TypeScript, React, Spring Boot, MySQL, and Docker.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Java, SQL, Python
- Frontend: React, Vite, Tailwind CSS, Redux, HTML5, CSS3, WebSockets
- Backend: Spring Boot, Node.js, Express, REST API, Microservices
- Databases: MySQL, PostgreSQL, Redis, Flyway, JPA / Hibernate
- Security & Cloud: Spring Security, JWT, OAuth2, Docker, AWS, Git, CI/CD, Unit Testing

EXPERIENCE
Staff Frontend Engineer | CloudMatrix (2023 - Present)
- Architected enterprise React 19 dashboards serving 150,000+ daily active users with sub-100ms response times.
- Implemented state-of-the-art security patterns preventing XSS and CSRF vulnerabilities across banking clients.
- Automated CI/CD pipelines with GitHub Actions, reducing release cycle time by 45%.

Backend Developer | FinSecure Systems (2020 - 2023)
- Built high-throughput payment ingestion services using Spring Boot, MySQL, and Redis caching.
- Spearheaded database migration strategies using Flyway with 100% zero-downtime execution.
- Authored comprehensive OpenAPI / Swagger specifications and integration test suites.`;
