import React, { useState } from 'react';
import type { SafetyCheckInput, SafetyCheckResult, JobApplication } from '../../types';
import { analyzeJobOffer } from '../../utils/safetyChecker';
import { DEMO_SAFETY_SAMPLES } from '../../data/sampleData';
import { apiService } from '../../services/api';
import { SafetyBadge } from '../common/Badge';
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  ShieldCheck,
  Lock,
  Copy,
  Check,
} from 'lucide-react';

interface SafetyCheckerProps {
  onSaveToApplications?: (app: Omit<JobApplication, 'id'>) => void;
}

export const SafetyChecker: React.FC<SafetyCheckerProps> = ({ onSaveToApplications }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [recruiterMessage, setRecruiterMessage] = useState('');

  const [analysisResult, setAnalysisResult] = useState<SafetyCheckResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedEvidence, setCopiedEvidence] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const runAnalysisWithFallback = async (input: SafetyCheckInput) => {
    setIsAnalyzing(true);
    try {
      // First attempt backend Spring Boot /api/safety/analyze
      const result = await apiService.safety.analyze(input);
      setAnalysisResult(result);
    } catch {
      // Gracefully fall back to local rule engine
      const localResult = analyzeJobOffer(input);
      setAnalysisResult(localResult);
    } finally {
      setIsAnalyzing(false);
      setSavedSuccess(false);
    }
  };

  const handleRunAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!jobText.trim() && !recruiterMessage.trim() && !companyName.trim() && !jobUrl.trim()) {
      return;
    }

    const input: SafetyCheckInput = {
      companyName: companyName.trim(),
      jobUrl: jobUrl.trim(),
      jobText: jobText.trim(),
      recruiterMessage: recruiterMessage.trim(),
    };
    runAnalysisWithFallback(input);
  };

  const handleLoadSample = (sampleKey: 'scamSample' | 'legitSample' | 'ambiguousSample') => {
    const s = DEMO_SAFETY_SAMPLES[sampleKey];
    setCompanyName(s.company);
    setJobUrl(s.jobUrl);
    setJobText(s.jobText);
    setRecruiterMessage(s.recruiterMessage);

    const input: SafetyCheckInput = {
      companyName: s.company,
      jobUrl: s.jobUrl,
      jobText: s.jobText,
      recruiterMessage: s.recruiterMessage,
    };
    runAnalysisWithFallback(input);
  };

  const handleClear = () => {
    setCompanyName('');
    setJobUrl('');
    setJobText('');
    setRecruiterMessage('');
    setAnalysisResult(null);
    setSavedSuccess(false);
  };

  const handleSaveToTracker = () => {
    if (!onSaveToApplications) return;

    const flag =
      analysisResult?.riskLevel === 'WARNING_SIGNS_FOUND'
        ? 'SUSPICIOUS'
        : analysisResult?.riskLevel === 'NEEDS_VERIFICATION'
        ? 'NEEDS_VERIFICATION'
        : 'SAFE';

    onSaveToApplications({
      company: companyName.trim() || 'Scanned Employer',
      jobTitle: 'Scanned Position',
      sourceUrl: jobUrl.trim() || undefined,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Saved',
      safetyFlag: flag,
      notes: `Safety Scan Summary: ${analysisResult?.title}. Risk Score: ${analysisResult?.riskScore}/100. Indicators: ${analysisResult?.indicators.map((i) => i.title).join(', ')}`,
      isSampleData: false,
    });

    setSavedSuccess(true);
  };

  const copyResults = () => {
    if (!analysisResult) return;
    const text = `OpportunityShield Safety Report:
Status: ${analysisResult.title} (Score: ${analysisResult.riskScore}/100)
Company: ${companyName || 'Not specified'}
Indicators:
${analysisResult.indicators.map((i) => `- [${i.severity}] ${i.title}: ${i.description}`).join('\n')}

Verification Steps:
${analysisResult.suggestedSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedEvidence(true);
    setTimeout(() => setCopiedEvidence(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Rule-Based Heuristic Evaluation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Job Offer & Recruiter Safety Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Pasted recruiter messages, interview instructions, and job descriptions are evaluated against transparent scam indicators (fake checks, crypto/wire requests, telegram interviews, lookalike domains).
        </p>
      </div>

      {/* Preset Buttons for Quick Testing */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          Try realistic test cases to evaluate detection rules:
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleLoadSample('scamSample')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Load Fake Check & Telegram Scam</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('legitSample')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Legitimate Corporate Job</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('ambiguousSample')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800 transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Load WhatsApp / Fee Ambiguous Case</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleRunAnalysis} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Company Name (Claimed)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp or Global Logistics"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Job / Application URL (Optional)
            </label>
            <input
              type="text"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="e.g. https://company-careers.example"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Pasted Recruiter Email / Chat Message (Highest Signal)
          </label>
          <textarea
            rows={4}
            value={recruiterMessage}
            onChange={(e) => setRecruiterMessage(e.target.value)}
            placeholder="Paste direct communications: e.g. 'Congratulations! We reviewed your profile on LinkedIn and selected you without an interview. Please download Telegram...'"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-[13px]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Job Posting / Description Text
          </label>
          <textarea
            rows={4}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste full job description, salary figures, requirements, and office arrangement details..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-[13px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Pasted content is treated strictly as untrusted data and analyzed in-memory.</span>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || (!jobText && !recruiterMessage && !companyName && !jobUrl)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            <span>{isAnalyzing ? 'Scanning Red Flags...' : 'Analyze Safety Indicators'}</span>
          </button>
        </div>
      </form>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Main Status & Score Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden ${
              analysisResult.riskLevel === 'WARNING_SIGNS_FOUND'
                ? 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 border-rose-700/60'
                : analysisResult.riskLevel === 'NEEDS_VERIFICATION'
                ? 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border-amber-700/60'
                : 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-700/60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <SafetyBadge level={analysisResult.riskLevel} />
                  <span className="text-xs text-slate-400 font-mono">
                    Score: {analysisResult.riskScore} / 100 Risk Index
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {analysisResult.title}
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={copyResults}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedEvidence ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEvidence ? 'Copied Report' : 'Copy Report'}</span>
                </button>

                {onSaveToApplications && (
                  <button
                    onClick={handleSaveToTracker}
                    disabled={savedSuccess}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-colors"
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>Saved to Tracker</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Track in Applications</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Risk Meter Bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1.5">
                <span>Risk Indicator Meter</span>
                <span>
                  {analysisResult.riskScore < 20
                    ? 'Low Warning Probability'
                    : analysisResult.riskScore < 60
                    ? 'Moderate Warning Probability'
                    : 'Critical Warning Probability'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysisResult.riskScore > 50
                      ? 'bg-rose-500'
                      : analysisResult.riskScore > 20
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(5, analysisResult.riskScore)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detected Warning Indicators Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>
                Detected Indicators ({analysisResult.indicators.length})
              </span>
            </h3>

            {analysisResult.indicators.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Configured Red Flags Found</h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  The submitted text does not contain matches for our active dictionary of known scam patterns (fake checks, telegram recruitment, upfront fees). Always verify identity through official channels regardless.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.indicators.map((ind) => (
                  <div
                    key={ind.id}
                    className={`rounded-2xl p-5 border space-y-3 ${
                      ind.severity === 'HIGH'
                        ? 'bg-rose-950/30 border-rose-800/80'
                        : ind.severity === 'MEDIUM'
                        ? 'bg-amber-950/30 border-amber-800/80'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ind.severity === 'HIGH'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : ind.severity === 'MEDIUM'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {ind.severity} Risk: {ind.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{ind.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {ind.description}
                      </p>
                    </div>

                    {ind.matchedEvidence && (
                      <div className="text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 font-mono text-slate-300">
                        <span className="text-slate-500 block mb-0.5">Matched context:</span>
                        <span className="text-rose-300">{ind.matchedEvidence}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Checklist */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Recommended Verification Checklist</span>
            </h3>
            <p className="text-xs text-slate-400">
              Complete these proactive steps before accepting an offer, signing onboarding agreements, or sharing identity documents:
            </p>
            <div className="space-y-2.5">
              {analysisResult.suggestedSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs sm:text-sm text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Limitations & Non-Guarantee Disclosures */}
          <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
            <h4 className="text-slate-300 font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Automated Engine Limitations</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 leading-relaxed pl-1">
              {analysisResult.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
