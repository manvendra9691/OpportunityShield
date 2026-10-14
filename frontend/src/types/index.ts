export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  company: string;
  jobTitle: string;
  sourceUrl?: string;
  applicationDate: string; // YYYY-MM-DD
  status: ApplicationStatus;
  deadline?: string; // YYYY-MM-DD
  interviewDate?: string; // YYYY-MM-DDTHH:mm
  notes?: string;
  nextFollowUp?: string; // YYYY-MM-DD
  salary?: string;
  location?: string;
  safetyFlag?: 'SAFE' | 'NEEDS_VERIFICATION' | 'SUSPICIOUS';
  isSampleData?: boolean;
}

export type SafetyRiskLevel =
  | 'NO_WARNINGS_FOUND'
  | 'NEEDS_VERIFICATION'
  | 'WARNING_SIGNS_FOUND';

export interface SafetyIndicator {
  id: string;
  category: 'FINANCIAL' | 'COMMUNICATION' | 'COMPENSATION' | 'PROCEDURE' | 'IDENTITY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  matchedEvidence?: string;
}

export interface SafetyCheckInput {
  jobText: string;
  recruiterMessage: string;
  companyName: string;
  jobUrl: string;
}

export interface SafetyCheckResult {
  riskLevel: SafetyRiskLevel;
  riskScore: number; // 0 to 100
  title: string;
  summary: string;
  indicators: SafetyIndicator[];
  supportingEvidence: string[];
  limitations: string[];
  suggestedSteps: string[];
  analyzedAt: string;
}

export interface ResumeComparisonResult {
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  wordCount: {
    resume: number;
    jobDescription: number;
  };
  analyzedAt: string;
}

export interface ReminderItem {
  id: string;
  applicationId?: string;
  company: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  type: 'INTERVIEW' | 'DEADLINE' | 'FOLLOW_UP';
  completed: boolean;
  notes?: string;
  isSampleData?: boolean;
}
