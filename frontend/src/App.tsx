import React, { useState, useEffect, useCallback } from 'react';
import type { JobApplication, ReminderItem } from './types';
import { INITIAL_APPLICATIONS, INITIAL_REMINDERS } from './data/sampleData';
import { Navbar, type NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ApplicationTracker } from './components/applications/ApplicationTracker';
import { SafetyChecker } from './components/safety/SafetyChecker';
import { ResumeComparator } from './components/resume/ResumeComparator';
import { RemindersDashboard } from './components/reminders/RemindersDashboard';
import { SafetyGuide } from './components/education/SafetyGuide';
import { AuthModal } from './components/auth/AuthModal';
import { apiService, type UserProfile } from './services/api';

const STORAGE_KEY_APPS = 'opportunity_shield_apps_v1';
const STORAGE_KEY_REMS = 'opportunity_shield_rems_v1';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Multi-user & Backend connectivity state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => apiService.auth.getCurrentUser());
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Applications State with LocalStorage fallback
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse applications from localStorage', e);
    }
    return INITIAL_APPLICATIONS;
  });

  // Reminders State with LocalStorage fallback
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse reminders from localStorage', e);
    }
    return INITIAL_REMINDERS;
  });

  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [triggerAddModal, setTriggerAddModal] = useState(false);

  // Sync state to LocalStorage for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save applications to localStorage', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMS, JSON.stringify(reminders));
    } catch (e) {
      console.error('Failed to save reminders to localStorage', e);
    }
  }, [reminders]);

  // Load user data from backend
  const loadBackendData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [remoteApps, remoteRems] = await Promise.all([
        apiService.applications.getAll(),
        apiService.reminders.getAll(),
      ]);
      setApplications(remoteApps);
      setReminders(remoteRems);
    } catch (err) {
      console.warn('Could not fetch backend data, retaining local state', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initialize backend connection on mount
  useEffect(() => {
    let isMounted = true;
    const initConnection = async () => {
      const connected = await apiService.checkConnection();
      if (!isMounted) return;
      setIsBackendConnected(connected);

      if (connected) {
        let user = apiService.auth.getCurrentUser();
        if (!user && !apiService.auth.getToken()) {
          // Attempt automatic login with seeded candidate1 for immediate live experience
          try {
            const loginRes = await apiService.auth.login('candidate1@opportunityshield.org', 'Password123!');
            user = {
              id: loginRes.id,
              email: loginRes.email,
              fullName: loginRes.fullName,
              role: loginRes.role,
            };
            if (isMounted) setCurrentUser(user);
          } catch (e) {
            console.log('Seed login not performed, continuing in guest/demo mode', e);
          }
        }

        if (user || apiService.auth.getToken()) {
          loadBackendData();
        }
      }
    };

    initConnection();
    return () => {
      isMounted = false;
    };
  }, [loadBackendData]);

  // Handlers for Authentication
  const handleAuthSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    setIsBackendConnected(true);
    await loadBackendData();
  };

  const handleLogout = () => {
    apiService.auth.logout();
    setCurrentUser(null);
    setApplications(INITIAL_APPLICATIONS);
    setReminders(INITIAL_REMINDERS);
    localStorage.removeItem(STORAGE_KEY_APPS);
    localStorage.removeItem(STORAGE_KEY_REMS);
  };

  const handleDeleteAccount = async () => {
    try {
      await apiService.auth.deleteAccount();
    } catch (e) {
      console.error('Delete account error', e);
    }
    handleLogout();
  };

  // Handlers for Applications
  const handleAddApplication = async (newApp: Omit<JobApplication, 'id'>) => {
    if (isBackendConnected && currentUser) {
      try {
        const created = await apiService.applications.create(newApp);
        setApplications((prev) => [created, ...prev]);

        // Auto create reminder if dates are present
        if (created.interviewDate) {
          const rem = await apiService.reminders.create({
            applicationId: created.id,
            company: created.company,
            title: `Interview Round: ${created.jobTitle}`,
            dueDate: created.interviewDate.split('T')[0],
            type: 'INTERVIEW',
            completed: false,
            notes: created.notes,
          });
          setReminders((prev) => [rem, ...prev]);
        } else if (created.nextFollowUp) {
          const rem = await apiService.reminders.create({
            applicationId: created.id,
            company: created.company,
            title: `Follow up on application: ${created.jobTitle}`,
            dueDate: created.nextFollowUp,
            type: 'FOLLOW_UP',
            completed: false,
          });
          setReminders((prev) => [rem, ...prev]);
        }
        return;
      } catch (err) {
        console.warn('Backend create failed, fallback to local store', err);
      }
    }

    // Local / fallback behavior
    const app: JobApplication = {
      ...newApp,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setApplications((prev) => [app, ...prev]);

    if (app.interviewDate) {
      setReminders((prev) => [
        {
          id: `rem-${Date.now()}-interview`,
          applicationId: app.id,
          company: app.company,
          title: `Interview Round: ${app.jobTitle}`,
          dueDate: app.interviewDate!.split('T')[0],
          type: 'INTERVIEW',
          completed: false,
          notes: app.notes,
        },
        ...prev,
      ]);
    } else if (app.nextFollowUp) {
      setReminders((prev) => [
        {
          id: `rem-${Date.now()}-followup`,
          applicationId: app.id,
          company: app.company,
          title: `Follow up on application: ${app.jobTitle}`,
          dueDate: app.nextFollowUp!,
          type: 'FOLLOW_UP',
          completed: false,
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateApplication = async (updatedApp: JobApplication) => {
    if (isBackendConnected && currentUser && !updatedApp.id.startsWith('app-')) {
      try {
        const saved = await apiService.applications.update(updatedApp);
        setApplications((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
        return;
      } catch (err) {
        console.warn('Backend update failed, updating locally', err);
      }
    }

    setApplications((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
  };

  const handleDeleteApplication = async (id: string) => {
    if (isBackendConnected && currentUser && !id.startsWith('app-')) {
      try {
        await apiService.applications.delete(id);
      } catch (err) {
        console.warn('Backend delete failed, removing locally', err);
      }
    }

    setApplications((prev) => prev.filter((a) => a.id !== id));
    setReminders((prev) => prev.filter((r) => r.applicationId !== id));
  };

  // Handlers for Reminders
  const handleToggleReminder = async (id: string) => {
    if (isBackendConnected && currentUser && !id.startsWith('rem-')) {
      try {
        const toggled = await apiService.reminders.toggle(id);
        setReminders((prev) => prev.map((r) => (r.id === toggled.id ? toggled : r)));
        return;
      } catch (err) {
        console.warn('Backend toggle failed, toggling locally', err);
      }
    }

    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleAddReminder = async (newReminder: Omit<ReminderItem, 'id'>) => {
    if (isBackendConnected && currentUser) {
      try {
        const created = await apiService.reminders.create(newReminder);
        setReminders((prev) => [created, ...prev]);
        return;
      } catch (err) {
        console.warn('Backend create reminder failed, creating locally', err);
      }
    }

    const rem: ReminderItem = {
      ...newReminder,
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setReminders((prev) => [rem, ...prev]);
  };

  const handleDeleteReminder = async (id: string) => {
    if (isBackendConnected && currentUser && !id.startsWith('rem-')) {
      try {
        await apiService.reminders.delete(id);
      } catch (err) {
        console.warn('Backend delete reminder failed, removing locally', err);
      }
    }

    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Reset to default sample data
  const handleResetDemoData = () => {
    setApplications(INITIAL_APPLICATIONS);
    setReminders(INITIAL_REMINDERS);
    localStorage.removeItem(STORAGE_KEY_APPS);
    localStorage.removeItem(STORAGE_KEY_REMS);
  };

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetDemoData={handleResetDemoData}
        onNewApplication={() => {
          setActiveTab('applications');
          setTriggerAddModal(true);
        }}
        pendingRemindersCount={pendingRemindersCount}
        currentUser={currentUser}
        isBackendConnected={isBackendConnected}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {isSyncing && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-300 flex items-center justify-between animate-pulse">
            <span>Syncing data with Spring Boot backend...</span>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            applications={applications}
            reminders={reminders}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAddModal={() => {
              setActiveTab('applications');
              setTriggerAddModal(true);
            }}
            onToggleReminder={handleToggleReminder}
            onSelectApplication={(app) => {
              setSelectedApplication(app);
              setActiveTab('applications');
            }}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationTracker
            applications={applications}
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            selectedApplication={selectedApplication}
            onClearSelectedApplication={() => setSelectedApplication(null)}
            initialOpenAddModal={triggerAddModal}
            onClearOpenAddModal={() => setTriggerAddModal(false)}
          />
        )}

        {activeTab === 'safety-checker' && (
          <SafetyChecker
            onSaveToApplications={(app) => {
              handleAddApplication(app);
              setActiveTab('applications');
            }}
          />
        )}

        {activeTab === 'resume-matcher' && <ResumeComparator />}

        {activeTab === 'reminders' && (
          <RemindersDashboard
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {activeTab === 'safety-guide' && <SafetyGuide />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication & User Session Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default App;
