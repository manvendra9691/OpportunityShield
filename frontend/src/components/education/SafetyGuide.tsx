import React from 'react';
import {
  BookOpen,
  AlertOctagon,
  ShieldAlert,
  UserCheck,
  ExternalLink,
  DollarSign,
  Mail,
  Building,
} from 'lucide-react';

export const SafetyGuide: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Curated Scam Defense Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Job Search Safety & Verification Manual
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Tactical advice and legal awareness to protect your identity, bank account, and time during employment searches. Derived from Federal Trade Commission (FTC) and FBI IC3 advisories.
        </p>
      </div>

      {/* 4 Core Pillars of Employment Fraud */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Upfront Payments */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-900/40 space-y-3 bg-gradient-to-b from-rose-950/20 to-slate-900">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">1. Upfront Recruitment & Training Fees</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong>The Law & Standard Practice:</strong> In legitimate corporate recruiting, job candidates <em>never</em> pay for application reviews, security background checks, software licenses, or mandatory onboarding courses.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-rose-300">
            <strong>Red Flag Trigger:</strong> "Please pay a $50 refundable registration fee" or "Purchase software from our certified vendor via Apple Gift Cards or Zelle."
          </div>
        </div>

        {/* Pillar 2: Fake Check Equipment Scam */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-900/40 space-y-3 bg-gradient-to-b from-amber-950/20 to-slate-900">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">2. The "Fake Check" Home Office Trap</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong>The Mechanism:</strong> The fraudster mails or emails a high-value cashier's check ($2,000–$5,000) for you to deposit into your personal account. They urge you to immediately wire funds or buy gift cards for "equipment" from their "approved vendor".
          </p>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-amber-300">
            <strong>Crucial Banking Fact:</strong> Under federal banking rules, deposited funds may appear available in 1–2 days, but the counterfeit check will bounce 1–2 weeks later, leaving you liable for the entire lost sum.
          </div>
        </div>

        {/* Pillar 3: Recruiter Impersonation */}
        <div className="glass-panel p-6 rounded-3xl border border-indigo-900/40 space-y-3 bg-gradient-to-b from-indigo-950/20 to-slate-900">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">3. Recruiter Identity Impersonation</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Scammers scrape real recruiters' names and corporate headshots from LinkedIn, registering similar lookalike domains (e.g. <code>@company-careers-talent.com</code> instead of <code>@company.com</code>) or messaging via WhatsApp.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-indigo-300">
            <strong>Verification Step:</strong> Send a fresh direct message to the recruiter on LinkedIn or call the main company switchboard number listed on their public SEC / official filings.
          </div>
        </div>

        {/* Pillar 4: Premature Identity Harvesting */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-900/40 space-y-3 bg-gradient-to-b from-purple-950/20 to-slate-900">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">4. Premature SSN & Bank Ingestion</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Identity theft rings create fake job listings solely to extract your Social Security number, passport scans, birthdate, and banking credentials under the guise of "pre-employment onboarding."
          </p>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-purple-300">
            <strong>Safe Practice:</strong> Tax forms (W-4 / I-9 in the US) and direct deposit details are strictly shared <em>after</em> a verified written contract is countersigned through a secure corporate HR portal.
          </div>
        </div>
      </div>

      {/* The 5-Step Independent Verification Protocol */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <span>The 5-Step Safe Verification Checklist</span>
          </h2>
          <p className="text-xs text-slate-400">
            Follow this protocol anytime an unsolicited offer arrives or you feel rushed:
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-200">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-white block mb-0.5">
                Inspect the Sender's Exact Email Domain
              </strong>
              Check the raw headers. Ensure the sender domain exactly matches the company's real website. Look closely for swapped characters (e.g. <code>rn</code> instead of <code>m</code>, or <code>g00gle.com</code>).
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-white block mb-0.5">
                Locate the Exact Requisition on the Official Career Site
              </strong>
              Open your browser and manually visit the employer's official website. Search for the job title in their careers portal. If the requisition does not exist, ask the recruiter for the official Job ID.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-white block mb-0.5">
                Demand Live Video or In-Person Screening
              </strong>
              Scammers rely heavily on anonymous text chats (Telegram, WhatsApp, Signal) because they cannot maintain identity over structured live video interviews with corporate teams.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </span>
            <div>
              <strong className="text-white block mb-0.5">
                Check Corporate Registration & Better Business Bureau
              </strong>
              Search the secretary of state registry or government business registries (such as UK Companies House, Australia ASIC, or state business filings in the US). Check for recent reviews and scam warnings on BBB Scam Tracker.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              5
            </span>
            <div>
              <strong className="text-white block mb-0.5">
                Zero Financial Transactions Rule
              </strong>
              Never send funds, purchase gift cards, transfer cryptocurrency, or cash unfamiliar checks for an employer. There is no legitimate employment arrangement that requires candidate-to-employer fund transfers.
            </div>
          </div>
        </div>
      </div>

      {/* Official Reporting Directory */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Official Scam Reporting Directory</span>
        </h2>
        <p className="text-xs text-slate-400">
          If you have been targeted by or fallen victim to a scam, report the perpetrator immediately to these official regulatory agencies:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 transition-colors flex flex-col justify-between group"
          >
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 flex items-center justify-between">
                <span>US Federal Trade Commission</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Primary US agency for reporting fraudulent schemes, fake checks, and fee scams.
              </p>
            </div>
            <span className="text-[11px] text-indigo-400 font-semibold mt-3">reportfraud.ftc.gov</span>
          </a>

          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 transition-colors flex flex-col justify-between group"
          >
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 flex items-center justify-between">
                <span>FBI Internet Crime (IC3)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                US cybercrime division tracking international wire, identity theft, and crypto syndicates.
              </p>
            </div>
            <span className="text-[11px] text-indigo-400 font-semibold mt-3">ic3.gov</span>
          </a>

          <a
            href="https://www.bbb.org/scamtracker"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 transition-colors flex flex-col justify-between group"
          >
            <div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 flex items-center justify-between">
                <span>BBB Scam Tracker</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Community-sourced database reporting spoofed business names and fake job recruiters.
              </p>
            </div>
            <span className="text-[11px] text-indigo-400 font-semibold mt-3">bbb.org/scamtracker</span>
          </a>
        </div>
      </div>

      {/* Legal Guarantee Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-500 leading-relaxed">
        <strong>Legal & Regulatory Note:</strong> OpportunityShield educational materials are compiled from public safety best practices. This information does not constitute formal legal counsel or an official guarantee of the security or bona fides of any specific employer or offer.
      </div>
    </div>
  );
};
