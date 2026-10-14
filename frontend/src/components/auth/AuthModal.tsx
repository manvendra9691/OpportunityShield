import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { apiService, type UserProfile } from '../../services/api';
import { User, Lock, Mail, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  onDeleteAccount,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!fullName.trim()) throw new Error('Full name is required');
        const res = await apiService.auth.register(fullName.trim(), email.trim(), password);
        onAuthSuccess({
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          role: res.role,
        });
      } else {
        const res = await apiService.auth.login(email.trim(), password);
        onAuthSuccess({
          id: res.id,
          email: res.email,
          fullName: res.fullName,
          role: res.role,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await apiService.auth.login(userEmail, 'Password123!');
      onAuthSuccess({
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentUser ? 'Account & Session' : isRegisterMode ? 'Create OpportunityShield Account' : 'Sign In to OpportunityShield'}
      description={currentUser ? 'Manage active session and multi-user isolation' : 'Connect to live Spring Boot REST API'}
      maxWidth="md"
    >
      {currentUser ? (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{currentUser.fullName}</h4>
              <p className="text-slate-400 text-xs">{currentUser.email}</p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Connected to Spring Boot API
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 block">
              Multi-User Testing Switcher:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin('candidate1@opportunityshield.org')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                  currentUser.email === 'candidate1@opportunityshield.org'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="block font-bold">Candidate 1 (Alex)</span>
                <span className="text-[10px] text-slate-400">candidate1@opportunityshield.org</span>
              </button>

              <button
                onClick={() => handleQuickLogin('candidate2@opportunityshield.org')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                  currentUser.email === 'candidate2@opportunityshield.org'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="block font-bold">Candidate 2 (Jordan)</span>
                <span className="text-[10px] text-slate-400">candidate2@opportunityshield.org</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account and all associated applications?')) {
                  onDeleteAccount();
                  onClose();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
            >
              Delete Account & Data
            </button>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* One-click prefill buttons for easy pair-programming review */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              Quick 1-Click Test Accounts:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('candidate1@opportunityshield.org')}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-medium"
              >
                Login as Candidate 1
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('candidate2@opportunityshield.org')}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-medium"
              >
                Login as Candidate 2
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
            {isRegisterMode && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all mt-2"
            >
              {loading ? 'Processing...' : isRegisterMode ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            {isRegisterMode ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className="text-indigo-400 hover:underline font-semibold"
                >
                  Register
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
