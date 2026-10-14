import type {
  JobApplication,
  SafetyCheckInput,
  SafetyCheckResult,
  ResumeComparisonResult,
  ReminderItem,
  ApplicationStatus,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const TOKEN_KEY = 'opportunity_shield_jwt';
const USER_KEY = 'opportunity_shield_user';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponseData {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: string;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const body = await response.json();
  if (!response.ok || body.success === false) {
    const errorMsg = body.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return body.data;
}

export const apiService = {
  // Auth API
  auth: {
    async login(email: string, password: string): Promise<AuthResponseData> {
      const data = await request<AuthResponseData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      return data;
    },

    async register(fullName: string, email: string, password: string): Promise<AuthResponseData> {
      const data = await request<AuthResponseData>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      return data;
    },

    async getProfile(): Promise<UserProfile> {
      return request<UserProfile>('/auth/me');
    },

    async deleteAccount(): Promise<void> {
      await request<void>('/auth/account', { method: 'DELETE' });
      this.logout();
    },

    logout() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },

    getCurrentUser(): UserProfile | null {
      const saved = localStorage.getItem(USER_KEY);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    },

    getToken(): string | null {
      return localStorage.getItem(TOKEN_KEY);
    },
  },

  // Applications API
  applications: {
    async getAll(status?: ApplicationStatus): Promise<JobApplication[]> {
      const query = status ? `?status=${status}` : '';
      const list = await request<any[]>(`/applications${query}`);
      return list.map(mapBackendAppToFrontend);
    },

    async getById(id: string | number): Promise<JobApplication> {
      const item = await request<any>(`/applications/${id}`);
      return mapBackendAppToFrontend(item);
    },

    async create(app: Omit<JobApplication, 'id'>): Promise<JobApplication> {
      const item = await request<any>('/applications', {
        method: 'POST',
        body: JSON.stringify({
          company: app.company,
          jobTitle: app.jobTitle,
          sourceUrl: app.sourceUrl,
          applicationDate: app.applicationDate,
          status: app.status,
          deadline: app.deadline,
          interviewDate: app.interviewDate,
          notes: app.notes,
          nextFollowUp: app.nextFollowUp,
          salary: app.salary,
          location: app.location,
          safetyFlag: app.safetyFlag || 'SAFE',
          isSampleData: app.isSampleData || false,
        }),
      });
      return mapBackendAppToFrontend(item);
    },

    async update(app: JobApplication): Promise<JobApplication> {
      const item = await request<any>(`/applications/${app.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          company: app.company,
          jobTitle: app.jobTitle,
          sourceUrl: app.sourceUrl,
          applicationDate: app.applicationDate,
          status: app.status,
          deadline: app.deadline,
          interviewDate: app.interviewDate,
          notes: app.notes,
          nextFollowUp: app.nextFollowUp,
          salary: app.salary,
          location: app.location,
          safetyFlag: app.safetyFlag || 'SAFE',
          isSampleData: app.isSampleData || false,
        }),
      });
      return mapBackendAppToFrontend(item);
    },

    async delete(id: string | number): Promise<void> {
      await request<void>(`/applications/${id}`, { method: 'DELETE' });
    },
  },

  // Reminders API
  reminders: {
    async getAll(): Promise<ReminderItem[]> {
      const list = await request<any[]>('/reminders');
      return list.map((r) => ({
        id: String(r.id),
        applicationId: r.applicationId ? String(r.applicationId) : undefined,
        company: r.company,
        title: r.title,
        dueDate: r.dueDate,
        type: r.type,
        completed: r.completed,
        notes: r.notes,
        isSampleData: r.isSampleData,
      }));
    },

    async create(rem: Omit<ReminderItem, 'id'>): Promise<ReminderItem> {
      const r = await request<any>('/reminders', {
        method: 'POST',
        body: JSON.stringify({
          company: rem.company,
          title: rem.title,
          dueDate: rem.dueDate,
          type: rem.type,
          completed: rem.completed,
          notes: rem.notes,
          isSampleData: rem.isSampleData || false,
          applicationId: rem.applicationId ? Number(rem.applicationId) : undefined,
        }),
      });
      return {
        id: String(r.id),
        applicationId: r.applicationId ? String(r.applicationId) : undefined,
        company: r.company,
        title: r.title,
        dueDate: r.dueDate,
        type: r.type,
        completed: r.completed,
        notes: r.notes,
        isSampleData: r.isSampleData,
      };
    },

    async toggle(id: string | number): Promise<ReminderItem> {
      const r = await request<any>(`/reminders/${id}/toggle`, { method: 'PATCH' });
      return {
        id: String(r.id),
        applicationId: r.applicationId ? String(r.applicationId) : undefined,
        company: r.company,
        title: r.title,
        dueDate: r.dueDate,
        type: r.type,
        completed: r.completed,
        notes: r.notes,
        isSampleData: r.isSampleData,
      };
    },

    async delete(id: string | number): Promise<void> {
      await request<void>(`/reminders/${id}`, { method: 'DELETE' });
    },
  },

  // Safety API
  safety: {
    async analyze(input: SafetyCheckInput): Promise<SafetyCheckResult> {
      const res = await request<any>('/safety/analyze', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return {
        riskLevel: res.riskLevel,
        riskScore: res.riskScore,
        title: res.title,
        summary: res.summary,
        indicators: res.indicators,
        supportingEvidence: res.supportingEvidence,
        limitations: res.limitations,
        suggestedSteps: res.suggestedSteps,
        analyzedAt: res.analyzedAt,
      };
    },
  },

  // Resume API
  resume: {
    async compare(resumeText: string, jobDescription: string): Promise<ResumeComparisonResult> {
      const res = await request<any>('/resume/compare', {
        method: 'POST',
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      return {
        matchScore: res.matchScore,
        matchedSkills: res.matchedSkills,
        missingSkills: res.missingSkills,
        recommendations: res.recommendations,
        wordCount: {
          resume: res.wordCountResume,
          jobDescription: res.wordCountJob,
        },
        analyzedAt: res.analyzedAt,
      };
    },
  },

  // Health / Connectivity Check
  async checkConnection(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/safety/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: 'HealthCheck' }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

function mapBackendAppToFrontend(item: any): JobApplication {
  return {
    id: String(item.id),
    company: item.company,
    jobTitle: item.jobTitle,
    sourceUrl: item.sourceUrl,
    applicationDate: item.applicationDate,
    status: item.status,
    deadline: item.deadline,
    interviewDate: item.interviewDate,
    notes: item.notes,
    nextFollowUp: item.nextFollowUp,
    salary: item.salary,
    location: item.location,
    safetyFlag: item.safetyFlag,
    isSampleData: item.isSampleData,
  };
}
