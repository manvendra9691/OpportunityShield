import { describe, it, expect } from 'vitest';
import { compareResumeWithJob } from './resumeComparator';

describe('Resume Comparator Utility', () => {
  it('correctly matches overlapping skills and identifies missing skills', () => {
    const resume = 'Experienced software engineer skilled in React, TypeScript, and SQL.';
    const job = 'We are hiring for React, TypeScript, Spring Boot, Docker, and MySQL.';

    const result = compareResumeWithJob(resume, job);

    expect(result.matchedSkills).toContain('React');
    expect(result.matchedSkills).toContain('TypeScript');
    expect(result.missingSkills).toContain('Spring Boot');
    expect(result.missingSkills).toContain('Docker');
    expect(result.missingSkills).toContain('MySQL');
    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchScore).toBeLessThan(100);
  });

  it('handles empty job description gracefully with 0 score', () => {
    const resume = 'Experienced in JavaScript and Node.js.';
    const job = '';

    const result = compareResumeWithJob(resume, job);
    expect(result.matchScore).toBe(0);
    expect(result.matchedSkills.length).toBe(0);
    expect(result.missingSkills.length).toBe(0);
  });

  it('includes honest resume guidelines in recommendations', () => {
    const resume = 'Python developer.';
    const job = 'Python developer with AWS and Docker.';

    const result = compareResumeWithJob(resume, job);
    expect(
      result.recommendations.some((r) => r.toLowerCase().includes('never fabricate'))
    ).toBe(true);
    expect(
      result.recommendations.some((r) => r.toLowerCase().includes('zero retention'))
    ).toBe(true);
  });
});
