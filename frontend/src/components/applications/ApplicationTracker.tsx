import React, { useState, useMemo } from 'react';
import type { JobApplication, ApplicationStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Briefcase,
  Search,
  Filter,
  PlusCircle,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
  Info,
  MapPin,
  DollarSign,
  ChevronDown,
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onAddApplication: (app: Omit<JobApplication, 'id'>) => void;
  onUpdateApplication: (app: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
  selectedApplication?: JobApplication | null;
  onClearSelectedApplication?: () => void;
  initialOpenAddModal?: boolean;
  onClearOpenAddModal?: () => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Saved',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  selectedApplication,
  onClearSelectedApplication,
  initialOpenAddModal,
  onClearOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [safetyFilter, setSafetyFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'deadline'>('date');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [viewingApp, setViewingApp] = useState<JobApplication | null>(selectedApplication || null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields State
  const [formCompany, setFormCompany] = useState('');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formApplicationDate, setFormApplicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('Applied');
  const [formDeadline, setFormDeadline] = useState('');
  const [formInterviewDate, setFormInterviewDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formNextFollowUp, setFormNextFollowUp] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSafetyFlag, setFormSafetyFlag] = useState<'SAFE' | 'NEEDS_VERIFICATION' | 'SUSPICIOUS'>('SAFE');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (selectedApplication) {
      setViewingApp(selectedApplication);
    }
  }, [selectedApplication]);

  React.useEffect(() => {
    if (initialOpenAddModal) {
      openAddModal();
      if (onClearOpenAddModal) onClearOpenAddModal();
    }
  }, [initialOpenAddModal, onClearOpenAddModal]);

  const openAddModal = () => {
    setEditingApp(null);
    setFormCompany('');
    setFormJobTitle('');
    setFormSourceUrl('');
    setFormApplicationDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Applied');
    setFormDeadline('');
    setFormInterviewDate('');
    setFormNotes('');
    setFormNextFollowUp('');
    setFormSalary('');
    setFormLocation('');
    setFormSafetyFlag('SAFE');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app);
    setFormCompany(app.company);
    setFormJobTitle(app.jobTitle);
    setFormSourceUrl(app.sourceUrl || '');
    setFormApplicationDate(app.applicationDate);
    setFormStatus(app.status);
    setFormDeadline(app.deadline || '');
    setFormInterviewDate(app.interviewDate || '');
    setFormNotes(app.notes || '');
    setFormNextFollowUp(app.nextFollowUp || '');
    setFormSalary(app.salary || '');
    setFormLocation(app.location || '');
    setFormSafetyFlag(app.safetyFlag || 'SAFE');
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formCompany.trim()) errors.company = 'Company name is required';
    if (!formJobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formApplicationDate) errors.applicationDate = 'Application date is required';
    if (formSourceUrl.trim() && !/^https?:\/\//i.test(formSourceUrl.trim())) {
      errors.sourceUrl = 'URL must start with http:// or https://';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingApp) {
      onUpdateApplication({
        ...editingApp,
        company: formCompany.trim(),
        jobTitle: formJobTitle.trim(),
        sourceUrl: formSourceUrl.trim() || undefined,
        applicationDate: formApplicationDate,
        status: formStatus,
        deadline: formDeadline || undefined,
        interviewDate: formInterviewDate || undefined,
        notes: formNotes.trim() || undefined,
        nextFollowUp: formNextFollowUp || undefined,
        salary: formSalary.trim() || undefined,
        location: formLocation.trim() || undefined,
        safetyFlag: formSafetyFlag,
      });
    } else {
      onAddApplication({
        company: formCompany.trim(),
        jobTitle: formJobTitle.trim(),
        sourceUrl: formSourceUrl.trim() || undefined,
        applicationDate: formApplicationDate,
        status: formStatus,
        deadline: formDeadline || undefined,
        interviewDate: formInterviewDate || undefined,
        notes: formNotes.trim() || undefined,
        nextFollowUp: formNextFollowUp || undefined,
        salary: formSalary.trim() || undefined,
        location: formLocation.trim() || undefined,
        safetyFlag: formSafetyFlag,
        isSampleData: false,
      });
    }
    setIsFormModalOpen(false);
  };

  // Filtered & Sorted Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (app.notes && app.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        const matchesSafety =
          safetyFilter === 'ALL' ||
          (safetyFilter === 'SUSPICIOUS' && app.safetyFlag === 'SUSPICIOUS') ||
          (safetyFilter === 'SAFE' && app.safetyFlag === 'SAFE');

        return matchesSearch && matchesStatus && matchesSafety;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        }
        if (sortBy === 'company') {
          return a.company.localeCompare(b.company);
        }
        if (sortBy === 'deadline') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });
  }, [applications, searchTerm, statusFilter, safetyFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            <span>Job Application Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Log submissions, manage interview rounds, track deadlines, and monitor safety flags.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, company, notes..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st} ({applications.filter((a) => a.status === st).length})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Safety Filter */}
          <div className="relative">
            <select
              value={safetyFilter}
              onChange={(e) => setSafetyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
            >
              <option value="ALL">All Safety Levels</option>
              <option value="SAFE">Verified / Safe Only</option>
              <option value="SUSPICIOUS">Flagged Suspicious Only</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
            >
              <option value="date">Sort: Recent Application Date</option>
              <option value="deadline">Sort: Upcoming Deadline</option>
              <option value="company">Sort: Company Name (A-Z)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Quick status pill tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Quick Filter:
          </span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid / Table View */}
      {filteredApplications.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 border border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No applications match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or status filter, or create a new application record.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
          >
            Add New Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge status={app.status} />
                  <div className="flex items-center gap-1">
                    {app.isSampleData && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        Demo
                      </span>
                    )}
                    {app.safetyFlag === 'SUSPICIOUS' && (
                      <span
                        title="Flagged Warning Signs"
                        className="p-1 rounded bg-rose-950/80 text-rose-400 border border-rose-800"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3
                    onClick={() => setViewingApp(app)}
                    className="font-bold text-base text-white hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {app.jobTitle}
                  </h3>
                  <div className="text-sm font-semibold text-slate-300 flex items-center justify-between">
                    <span>{app.company}</span>
                    {app.sourceUrl && (
                      <a
                        href={app.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-indigo-400 text-xs flex items-center gap-1"
                        title="Open Source URL"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-1">
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {app.location}
                    </span>
                  )}
                  {app.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-500" />
                      {app.salary}
                    </span>
                  )}
                </div>

                {/* Dates Information */}
                <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span>Applied:</span>
                    <span className="text-slate-300 font-medium">{app.applicationDate}</span>
                  </div>
                  {app.deadline && (
                    <div className="flex justify-between">
                      <span>Deadline:</span>
                      <span className="text-amber-400 font-medium">{app.deadline}</span>
                    </div>
                  )}
                  {app.interviewDate && (
                    <div className="flex justify-between">
                      <span>Interview:</span>
                      <span className="text-indigo-400 font-semibold">{app.interviewDate}</span>
                    </div>
                  )}
                  {app.nextFollowUp && (
                    <div className="flex justify-between">
                      <span>Next Follow-up:</span>
                      <span className="text-purple-300 font-medium">{app.nextFollowUp}</span>
                    </div>
                  )}
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-400 line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 mt-2">
                    {app.notes}
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => setViewingApp(app)}
                  className="text-slate-300 hover:text-white font-medium flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Details</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(app)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit application"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(app.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingApp}
        onClose={() => {
          setViewingApp(null);
          if (onClearSelectedApplication) onClearSelectedApplication();
        }}
        title={viewingApp ? `${viewingApp.jobTitle} — ${viewingApp.company}` : ''}
        description="Full application details and scheduled timeline"
      >
        {viewingApp && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <StatusBadge status={viewingApp.status} />
              {viewingApp.safetyFlag === 'SUSPICIOUS' ? (
                <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Warning Signs Flagged
                </span>
              ) : (
                <span className="text-xs text-emerald-400 font-medium">Standard / Verified</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-xs">Company</span>
                <span className="font-semibold text-white">{viewingApp.company}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Role / Job Title</span>
                <span className="font-semibold text-white">{viewingApp.jobTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Location</span>
                <span>{viewingApp.location || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Compensation</span>
                <span>{viewingApp.salary || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Application Date</span>
                <span>{viewingApp.applicationDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Application Deadline</span>
                <span className="text-amber-400">{viewingApp.deadline || 'No deadline'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Interview Date & Time</span>
                <span className="text-indigo-400 font-semibold">
                  {viewingApp.interviewDate || 'None scheduled'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Next Follow-up</span>
                <span className="text-purple-300">{viewingApp.nextFollowUp || 'None'}</span>
              </div>
            </div>

            {viewingApp.sourceUrl && (
              <div>
                <span className="text-slate-500 block text-xs mb-1">Source URL</span>
                <a
                  href={viewingApp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline break-all inline-flex items-center gap-1"
                >
                  <span>{viewingApp.sourceUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {viewingApp.notes && (
              <div>
                <span className="text-slate-500 block text-xs mb-1">Notes & History</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewingApp.notes}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  const toEdit = viewingApp;
                  setViewingApp(null);
                  openEditModal(toEdit);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Edit Application
              </button>
              <button
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingApp ? 'Edit Job Application' : 'Track New Job Application'}
        description="All fields are persisted locally in sample state."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Company Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.company ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {formErrors.company && (
                <span className="text-rose-400 text-[11px] mt-0.5 block">{formErrors.company}</span>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formJobTitle}
                onChange={(e) => setFormJobTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.jobTitle ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {formErrors.jobTitle && (
                <span className="text-rose-400 text-[11px] mt-0.5 block">{formErrors.jobTitle}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Application Date</label>
              <input
                type="date"
                value={formApplicationDate}
                onChange={(e) => setFormApplicationDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Deadline (Optional)</label>
              <input
                type="date"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Interview Date & Time</label>
              <input
                type="datetime-local"
                value={formInterviewDate}
                onChange={(e) => setFormInterviewDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Next Follow-Up</label>
              <input
                type="date"
                value={formNextFollowUp}
                onChange={(e) => setFormNextFollowUp(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Location / Remote</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Remote (US) or San Francisco, CA"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Compensation Range</label>
              <input
                type="text"
                value={formSalary}
                onChange={(e) => setFormSalary(e.target.value)}
                placeholder="e.g. $140,000 - $160,000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Source URL (Optional)</label>
            <input
              type="url"
              value={formSourceUrl}
              onChange={(e) => setFormSourceUrl(e.target.value)}
              placeholder="https://company.com/careers/123"
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.sourceUrl ? 'border-rose-500' : 'border-slate-800'
              }`}
            />
            {formErrors.sourceUrl && (
              <span className="text-rose-400 text-[11px] mt-0.5 block">{formErrors.sourceUrl}</span>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Safety Classification</label>
            <select
              value={formSafetyFlag}
              onChange={(e) => setFormSafetyFlag(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="SAFE">Verified / Safe Application</option>
              <option value="NEEDS_VERIFICATION">Needs Further Verification</option>
              <option value="SUSPICIOUS">Flagged as Suspicious / Warning Signs Found</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Notes & Next Steps</label>
            <textarea
              rows={3}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Add interview feedback, recruiter contact, referral details..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
            >
              {editingApp ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Application"
        description="Are you sure you want to delete this application record?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            This action removes the record from your current tracker view.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirmId) {
                  onDeleteApplication(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
