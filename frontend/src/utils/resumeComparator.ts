import type { ResumeComparisonResult } from '../types';

// Curated list of known technical and industry skills for transparent extraction
const KNOWN_SKILLS: string[] = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'Bash',
  // Frontend
  'React', 'Vue', 'Angular', 'Next.js', 'Vite', 'Tailwind CSS', 'Redux', 'HTML5', 'CSS3', 'WebSockets', 'GraphQL', 'REST API',
  // Backend & Cloud
  'Spring Boot', 'Node.js', 'Express', 'Django', 'FastAPI', 'NestJS', 'Microservices', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Flyway', 'Hibernate', 'JPA', 'Elasticsearch',
  // Security & Best Practices
  'OAuth2', 'JWT', 'Spring Security', 'SSRF Prevention', 'OWASP', 'Unit Testing', 'CI/CD', 'Git', 'GitHub Actions',
  // Data & Architecture
  'System Design', 'Agile', 'Scrum', 'Kafka', 'RabbitMQ', 'Architecture', 'OpenAPI', 'Swagger'
];

export function compareResumeWithJob(
  resumeText: string,
  jobDescription: string
): ResumeComparisonResult {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of KNOWN_SKILLS) {
    const skillRegex = new RegExp(`\\b${escapeRegExp(skill.toLowerCase())}\\b`, 'i');
    const inJob = skillRegex.test(jobLower);
    const inResume = skillRegex.test(resumeLower);

    if (inJob && inResume) {
      matchedSkills.push(skill);
    } else if (inJob && !inResume) {
      missingSkills.push(skill);
    }
  }

  // Calculate transparent match percentage
  const totalJobSkills = matchedSkills.length + missingSkills.length;
  const matchScore =
    totalJobSkills === 0
      ? 0
      : Math.round((matchedSkills.length / totalJobSkills) * 100);

  // Formulate honest, constructive suggestions
  const recommendations: string[] = [];

  if (missingSkills.length > 0) {
    recommendations.push(
      `Job description emphasizes keywords: ${missingSkills.slice(0, 5).join(', ')}. If you possess genuine experience with any of these, consider explicitly describing your projects or responsibilities utilizing them.`
    );
  }

  if (matchedSkills.length > 0) {
    recommendations.push(
      `Strong alignment found on: ${matchedSkills.slice(0, 6).join(', ')}. Highlight measurable achievements and metrics associated with these competencies in your bullet points.`
    );
  }

  recommendations.push(
    'Honesty Principle: Never fabricate experience or copy-paste keywords you cannot defend in a technical interview. Tailor truthful accomplishments to the role requirements.'
  );

  recommendations.push(
    'Privacy Guarantee (Zero Retention): Your resume and the job description are processed strictly in-memory within your browser and are not retained or stored.'
  );

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    recommendations,
    wordCount: {
      resume: countWords(resumeText),
      jobDescription: countWords(jobDescription),
    },
    analyzedAt: new Date().toISOString(),
  };
}

function countWords(str: string): number {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
