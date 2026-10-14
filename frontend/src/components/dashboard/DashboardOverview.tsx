import React from 'react';
import type { JobApplication, ReminderItem } from '../../types';
import type { NavTab } from '../layout/Navbar';
import { StatusBadge } from '../common/Badge';
import {
  Briefcase,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface DashboardOverviewProps {
  applications: JobApplication[];
  reminders: ReminderItem[];
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  onToggleReminder: (id: string) => void;
  onSelectApplication: (app: JobApplication) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  applications,
  reminders,
  onNavigate,
  onOpenAddModal,
  onToggleReminder,
  onSelectApplication,
}) => {
  const activeApplications = applications.filter(
    (a) => a.status !== 'Rejected' && a.status !== 'Withdrawn'
  );
  const interviewsCount = applications.filter((a) => a.status === 'Interview').length;
  const pendingFollowUps = reminders.filter((r) => !r.completed && r.type === 'FOLLOW_UP').length;
  const flaggedWarnings = applications.filter((a) => a.safetyFlag === 'SUSPICIOUS').length;

  const upcomingReminders = reminders
    .filter((r) => !r.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome & Safety Advisory Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Protection & Application Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Protect Your Search. <span className="text-indigo-400">Land The Right Offer.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Employment scammers target thousands of job hunters every month with counterfeit checks, lookalike domains, and fee traps. OpportunityShield scans job offers before you send private details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('safety-checker')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Scan Suspicious Offer</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Track New Job</span>
            </button>
          </div>
        </div>

        {/* Demo Data Notice */}
        <div className="mt-4 pt-4 border-t border-indigo-900/30 flex items-center justify-between text-xs text-indigo-300/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Displaying sample demo data for preview. Create, edit, or delete items to test interactivity.
          </span>
          <button
            onClick={() => onNavigate('safety-guide')}
            className="hover:underline flex items-center gap-1 text-indigo-300"
          >
            <span>Read 2026 Scam Red Flags Guide</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Active Applications */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activeApplications.length}</span>
            <span className="text-xs text-slate-400">of {applications.length} total</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Offers on table:</span>
            <span className="font-semibold text-emerald-400">
              {applications.filter((a) => a.status === 'Offer').length}
            </span>
          </div>
        </div>

        {/* Card 2: Upcoming Interviews */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Interviews Scheduled
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{interviewsCount}</span>
            <span className="text-xs text-amber-300">High priority</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">In assessment:</span>
            <span className="font-semibold text-purple-300">
              {applications.filter((a) => a.status === 'Assessment').length}
            </span>
          </div>
        </div>

        {/* Card 3: Pending Follow-Ups */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Follow-Up Actions
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{pendingFollowUps}</span>
            <span className="text-xs text-slate-400">Tasks awaiting</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Upcoming deadlines:</span>
            <span className="font-semibold text-indigo-300">
              {reminders.filter((r) => !r.completed && r.type === 'DEADLINE').length}
            </span>
          </div>
        </div>

        {/* Card 4: Flagged Warnings */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Flagged Suspicious
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400">{flaggedWarnings}</span>
            <span className="text-xs text-rose-300/80">Known red flags</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => onNavigate('safety-checker')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Test new offer text</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Upcoming Schedule & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Recent Applications Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Recent Applications</h2>
              <p className="text-xs text-slate-400">
                Track status, deadlines, and follow-ups across your pipeline
              </p>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All ({applications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
            {recentApplications.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">No applications yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start tracking your job search by logging applications, deadlines, and interview rounds.
                </p>
                <button
                  onClick={onOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  Add Your First Application
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/70">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onSelectApplication(app)}
                    className="p-4 hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white hover:text-indigo-300 transition-colors">
                          {app.jobTitle}
                        </span>
                        {app.isSampleData && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                            Sample
                          </span>
                        )}
                        {app.safetyFlag === 'SUSPICIOUS' && (
                          <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800 flex items-center gap-1 font-semibold">
                            <AlertTriangle className="w-2.5 h-2.5" /> Flagged Red Flag
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">{app.company}</span>
                        {app.location && <span>• {app.location}</span>}
                        {app.salary && <span>• {app.salary}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <StatusBadge status={app.status} />
                      <div className="text-right text-xs text-slate-400 hidden md:block">
                        {app.deadline && (
                          <span className="block text-[11px] text-slate-400">
                            Deadline: {app.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div
              onClick={() => onNavigate('safety-checker')}
              className="glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer border border-indigo-900/30 flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Rule-Based Safety Scanner</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check recruiter emails, WhatsApp invites, and check payment offers for known scam patterns.
                </p>
              </div>
            </div>

            <div
              onClick={() => onNavigate('resume-matcher')}
              className="glass-panel glass-panel-hover p-4 rounded-2xl cursor-pointer border border-indigo-900/30 flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Resume-to-Job Matcher</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compare keywords and skills in your resume against the target description without storing data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Upcoming Schedule & In-App Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Schedule</h2>
              <p className="text-xs text-slate-400">Deadlines & scheduled interviews</p>
            </div>
            <button
              onClick={() => onNavigate('reminders')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View All
            </button>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            {upcomingReminders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                All upcoming tasks and interviews are cleared!
              </div>
            ) : (
              upcomingReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          rem.type === 'INTERVIEW'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : rem.type === 'DEADLINE'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {rem.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{rem.company}</span>
                    </div>
                    <p className="text-xs font-medium text-white">{rem.title}</p>
                    <span className="text-[11px] text-slate-400 block">Due: {rem.dueDate}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleReminder(rem.id);
                    }}
                    title="Mark task completed"
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => onNavigate('reminders')}
              className="w-full py-2.5 text-center text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors mt-2"
            >
              Open Reminders Dashboard
            </button>
          </div>

          {/* Safe Practice Reminder Card */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Safety Golden Rule</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Legitimate employers will <strong>never</strong> mail you a check to purchase equipment or ask you to pay for your own background check or software credentials.
            </p>
            <a
              href="https://reportfraud.ftc.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:underline pt-1"
            >
              <span>FTC Job Scams Reporting</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
