import React, { useState } from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  Briefcase,
  SearchCode,
  FileText,
  Bell,
  BookOpen,
  Menu,
  X,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';

import type { UserProfile } from '../../services/api';

export type NavTab =
  | 'dashboard'
  | 'applications'
  | 'safety-checker'
  | 'resume-matcher'
  | 'reminders'
  | 'safety-guide';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onResetDemoData: () => void;
  onNewApplication: () => void;
  pendingRemindersCount: number;
  currentUser?: UserProfile | null;
  isBackendConnected?: boolean;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onResetDemoData,
  onNewApplication,
  pendingRemindersCount,
  currentUser,
  isBackendConnected = false,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications' as NavTab, label: 'Applications', icon: Briefcase },
    { id: 'safety-checker' as NavTab, label: 'Safety Checker', icon: SearchCode, highlight: true },
    { id: 'resume-matcher' as NavTab, label: 'Resume Matcher', icon: FileText },
    {
      id: 'reminders' as NavTab,
      label: 'Reminders',
      icon: Bell,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined,
    },
    { id: 'safety-guide' as NavTab, label: 'Safety Guide', icon: BookOpen },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  Opportunity<span className="text-indigo-400">Shield</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide uppercase">
                  Safe Job Application Suite
                </span>
              </div>
            </button>

            {/* Connection Status Badge */}
            <span
              onClick={onOpenAuthModal}
              className={`cursor-pointer hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                isBackendConnected
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/80'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800/80 hover:bg-amber-900/80'
              }`}
              title="Click to manage account / multi-user testing"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isBackendConnected ? 'Live API (8081)' : 'Demo Mode'}</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : item.highlight
                      ? 'text-indigo-300 hover:text-white hover:bg-slate-900 border border-indigo-900/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold ${
                        isActive ? 'bg-indigo-900 text-white' : 'bg-indigo-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* User Session Button */}
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                {currentUser ? (
                  <>
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                      {currentUser.fullName.charAt(0)}
                    </span>
                    <span className="max-w-[100px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                  </>
                ) : (
                  <span>Sign In / Test Users</span>
                )}
              </button>
            )}

            <button
              onClick={onResetDemoData}
              title="Reset Sample Data to Default"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={onNewApplication}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onNewApplication}
              className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
              aria-label="Add job"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-1">
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-xs text-indigo-300 flex items-center justify-between">
            <span>Demo Mode (Sample Data)</span>
            <button
              onClick={() => {
                onResetDemoData();
                setMobileMenuOpen(false);
              }}
              className="text-xs underline text-indigo-200"
            >
              Reset Data
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
