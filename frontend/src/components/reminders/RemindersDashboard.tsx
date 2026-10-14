import React, { useState } from 'react';
import type { ReminderItem } from '../../types';
import { Modal } from '../common/Modal';
import {
  Bell,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Filter,
  Volume2,
} from 'lucide-react';

interface RemindersDashboardProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<ReminderItem, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersDashboard: React.FC<RemindersDashboardProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Form State
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [formType, setFormType] = useState<'INTERVIEW' | 'DEADLINE' | 'FOLLOW_UP'>('FOLLOW_UP');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCompany.trim()) {
      setFormError('Company and title are required.');
      return;
    }

    onAddReminder({
      company: formCompany.trim(),
      title: formTitle.trim(),
      dueDate: formDueDate,
      type: formType,
      completed: false,
      notes: formNotes.trim() || undefined,
      isSampleData: false,
    });

    setIsAddModalOpen(false);
    setFormTitle('');
    setFormCompany('');
    setFormNotes('');
    setFormError('');
  };

  const filteredReminders = reminders.filter((rem) => {
    const matchesCompleted = showCompleted ? true : !rem.completed;
    const matchesType = filterType === 'ALL' || rem.type === filterType;
    return matchesCompleted && matchesType;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>In-App Follow-Up & Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Follow-Up & Interview Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Never miss an interview round, assessment deadline, or post-interview thank you email.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Control bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {['ALL', 'INTERVIEW', 'DEADLINE', 'FOLLOW_UP'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === t
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t === 'ALL' ? 'All Reminders' : t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Show Completed</span>
          </label>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Alert Sounds: {soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3 border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-75" />
            <h3 className="text-base font-bold text-white">No pending reminders in this view</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You are all caught up! Click "New Reminder" to set an alert for upcoming deadlines or post-interview notes.
            </p>
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`glass-panel rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                rem.completed
                  ? 'border-slate-800/50 bg-slate-950/40 opacity-60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  title={rem.completed ? 'Mark pending' : 'Mark completed'}
                  className={`p-1.5 rounded-xl border mt-0.5 transition-colors ${
                    rem.completed
                      ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-600'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rem.type === 'INTERVIEW'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : rem.type === 'DEADLINE'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}
                    >
                      {rem.type}
                    </span>
                    <span className="text-xs font-bold text-white">{rem.company}</span>
                    {rem.isSampleData && (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                        Demo
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm font-semibold text-slate-100 ${
                      rem.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {rem.title}
                  </h3>

                  {rem.notes && <p className="text-xs text-slate-400">{rem.notes}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {rem.dueDate}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {rem.completed ? 'Completed' : 'Upcoming'}
                  </span>
                </div>

                <button
                  onClick={() => onDeleteReminder(rem.id)}
                  title="Delete reminder"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Reminder"
        description="Set date and notes for critical job application milestones"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Reminder Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Follow up with HR manager regarding technical interview"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Milestone Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="FOLLOW_UP">Follow-Up Action</option>
                <option value="INTERVIEW">Interview Round</option>
                <option value="DEADLINE">Application / Offer Deadline</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Notes (Optional)</label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Questions to ask, portfolio links to prepare..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
