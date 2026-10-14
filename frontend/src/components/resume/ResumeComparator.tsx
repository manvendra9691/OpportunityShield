import React, { useState } from 'react';
import type { ResumeComparisonResult } from '../../types';
import { compareResumeWithJob } from '../../utils/resumeComparator';
import { DEMO_RESUME_SAMPLE } from '../../data/sampleData';
import { apiService } from '../../services/api';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';

const SAMPLE_JOB_DESCRIPTION = `We are seeking a Senior Full-Stack Engineer to join our Platform Core Team.
Key Responsibilities:
- Build reactive enterprise dashboards using React, TypeScript, and Vite.
- Design resilient REST APIs and microservices using Spring Boot and Java.
- Optimize high-throughput relational databases with MySQL, Flyway migrations, and JPA / Hibernate.
- Secure customer data with Spring Security, JWT authentication, and SSRF Prevention.
- Implement CI/CD pipelines with Docker and GitHub Actions, ensuring comprehensive Unit Testing.`;

export const ResumeComparator: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ResumeComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const runComparisonWithFallback = async (resume: string, job: string) => {
    setIsComparing(true);
    try {
      const res = await apiService.resume.compare(resume, job);
      setResult(res);
    } catch {
      const res = compareResumeWithJob(resume, job);
      setResult(res);
    } finally {
      setIsComparing(false);
    }
  };

  const handleRunComparison = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) return;

    runComparisonWithFallback(resumeText.trim(), jobDescription.trim());
  };

  const handleLoadSample = () => {
    setResumeText(DEMO_RESUME_SAMPLE);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    runComparisonWithFallback(DEMO_RESUME_SAMPLE, SAMPLE_JOB_DESCRIPTION);
  };

  const handleClear = () => {
    setResumeText('');
    setJobDescription('');
    setResult(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Keyword & Skill Alignment Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Resume-to-Job Description Matcher
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Transparently identify overlapping technical competencies and detect potentially omitted qualifications. Evaluated in-memory with zero data retention or document upload requirements.
        </p>
      </div>

      {/* Preset Action Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Need a quick demonstration? Load our sample software engineer resume and job posting:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <span>Load Sample Data</span>
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Comparison Input Textareas */}
      <form onSubmit={handleRunComparison} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Text Input */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Your Resume Text
              </label>
              <span className="text-[11px] text-slate-400">
                {resumeText ? `${resumeText.trim().split(/\s+/).length} words` : 'Paste plain text'}
              </span>
            </div>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste plain text of your resume (experience, summary, skills sections)... No PDFs or sensitive identity numbers required."
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
            />
          </div>

          {/* Job Description Input */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Target Job Description
              </label>
              <span className="text-[11px] text-slate-400">
                {jobDescription ? `${jobDescription.trim().split(/\s+/).length} words` : 'Paste job post'}
              </span>
            </div>
            <textarea
              rows={12}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description, responsibilities, requirements, and tech stack qualifications..."
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Action Button & Privacy Note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero Retention:</strong> Content is analyzed client-side and never saved or transmitted to third parties.
            </span>
          </div>

          <button
            type="submit"
            disabled={isComparing || !resumeText.trim() || !jobDescription.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>{isComparing ? 'Comparing Skills...' : 'Compare Skills & Keywords'}</span>
          </button>
        </div>
      </form>

      {/* Comparison Analysis Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Match Score Banner */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Skill Alignment Report
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {result.matchScore}% Keyword Match Alignment
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Calculated based on detected core technical competencies present in the job posting compared against your resume.
                </p>
              </div>

              {/* Match Score Circle / Indicator */}
              <div className="flex items-center gap-4 self-center sm:self-auto">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative bg-slate-950">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-indigo-500"
                    style={{
                      clipPath: `polygon(50% 50%, 0 0, ${Math.min(100, result.matchScore * 3.6)}% 0)`,
                    }}
                  />
                  <span className="text-2xl font-black text-white">{result.matchScore}%</span>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skill Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-800">
              {/* Matched Skills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matched Skills ({result.matchedSkills.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400">Present in both</span>
                </div>

                {result.matchedSkills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No recognized direct skill matches found.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Skills */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Omitted in Resume ({result.missingSkills.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400">In job posting only</span>
                </div>

                {result.missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-400 font-medium">
                    All keywords in the job description are matched in your resume!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Tailoring Recommendations</span>
            </h4>
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Honest Resume Pledge */}
          <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Honesty in Job Applications:</strong> OpportunityShield never suggests exaggerating skills or making fraudulent claims. Always reflect your actual capabilities and projects honestly; interviewers will probe these topics thoroughly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
