import React from 'react';
import { ShieldCheck, Lock, ExternalLink, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/70 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Mission & Safety */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>OpportunityShield Mission</span>
            </div>
            <p className="leading-relaxed text-slate-400 mb-3">
              Empowering job seekers against employment scams, fake checks, phishing, and recruiter impersonation through transparent heuristic scanning and structured application management.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy First: Analyses are run in-memory without persistent retention.</span>
            </div>
          </div>

          {/* Column 2: Official Reporting Portals */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Official Scam Reporting Channels</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>US Federal Trade Commission (FTC)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ic3.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>FBI Internet Crime Complaint Center (IC3)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bbb.org/scamtracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Better Business Bureau (BBB) Scam Tracker</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Disclaimers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Important Limitations</h4>
            <p className="leading-relaxed text-slate-400">
              OpportunityShield provides pattern-based warning indicators and organization tools. It does not provide legal guarantees, background checks, or definitive certifications regarding any employer's legitimacy. Always perform independent verification directly with verified corporate directories.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} OpportunityShield Project. Built for safe, resilient job search.
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
              Phase 1 Frontend Prototype
            </span>
            <span>React 19 • TypeScript • Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
