import type { SafetyCheckInput, SafetyCheckResult, SafetyIndicator, SafetyRiskLevel } from '../types';

interface RuleDefinition {
  id: string;
  category: 'FINANCIAL' | 'COMMUNICATION' | 'COMPENSATION' | 'PROCEDURE' | 'IDENTITY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  pattern: RegExp;
  recommendation: string;
}

const SAFETY_RULES: RuleDefinition[] = [
  // Financial Warning Signs (HIGH SEVERITY)
  {
    id: 'FEE_CHECK_EQUIPMENT',
    category: 'FINANCIAL',
    severity: 'HIGH',
    title: 'Fake Check / Equipment Purchase Demand',
    description: 'Mentions sending a check to purchase home office equipment, software licenses, or vendor supplies.',
    pattern: /(fake check|send you a check|cashier'?s check|mobile deposit|purchase (your own )?(equipment|materials|laptop|supplies)|authorized vendor|deposit (the|this) check|reimburse (via|through) (zelle|wire|crypto))/i,
    recommendation: 'Legitimate employers provide equipment directly or pay vendors directly. Never deposit a check and wire money or purchase items from an unfamiliar vendor.',
  },
  {
    id: 'FEE_APPLICATION_TRAINING',
    category: 'FINANCIAL',
    severity: 'HIGH',
    title: 'Upfront Payment or Application Fee',
    description: 'Requires an upfront payment for training, background checks, registration, or software onboarding.',
    pattern: /(pay (an?|the) (application|registration|processing|training|onboarding) fee|upfront (fee|payment|cost)|pay for (your )?(background check|certification)|non-refundable deposit)/i,
    recommendation: 'Legitimate employers cover recruitment, onboarding, and standard background screening costs.',
  },
  {
    id: 'PAYMENT_CRYPTO_WIRE',
    category: 'FINANCIAL',
    severity: 'HIGH',
    title: 'Irreversible Payment Methods Mentioned',
    description: 'References cryptocurrency (Bitcoin/USDT), gift cards, MoneyGram, Western Union, or Zelle transfers.',
    pattern: /(cryptocurrency|bitcoin|usdt|ethereum|gift card|apple gift card|western union|moneygram|cash app|wire transfer to)/i,
    recommendation: 'Employment offers should never involve sending or receiving money through cryptocurrency or retail gift cards.',
  },

  // Communication Warning Signs
  {
    id: 'COMM_TELEGRAM_WHATSAPP',
    category: 'COMMUNICATION',
    severity: 'HIGH',
    title: 'Interview via Chat App (Telegram / WhatsApp / Signal)',
    description: 'Directs the candidate to conduct text-only interviews or submit sensitive documents over chat platforms.',
    pattern: /(interview via (telegram|whatsapp|signal|google chat|skype text)|download telegram|contact (our|the) hiring manager on telegram|connect on whatsapp)/i,
    recommendation: 'Corporate hiring teams use official enterprise email domains, ATS portals, or structured video/in-person meetings.',
  },
  {
    id: 'COMM_FREE_EMAIL_DOMAIN',
    category: 'COMMUNICATION',
    severity: 'MEDIUM',
    title: 'Free Webmail Address for Company Hiring',
    description: 'Recruiter or company contact utilizes a free domain (@gmail.com, @yahoo.com, @outlook.com, @hotmail.com) instead of a corporate domain.',
    pattern: /(@gmail\.com|@yahoo\.com|@outlook\.com|@hotmail\.com|@mail\.com|@protonmail\.com)/i,
    recommendation: 'Verify if the sender actually matches the official domain of the company they claim to represent.',
  },

  // Compensation & Procedure Warning Signs
  {
    id: 'COMP_UNREALISTIC_PAY',
    category: 'COMPENSATION',
    severity: 'MEDIUM',
    title: 'Disproportionate Compensation for Low/No Experience',
    description: 'Offers extreme hourly or weekly pay ($60-$120+/hr) for entry-level, data entry, typing, or minimal skills.',
    pattern: /(\$(?:[6-9]\d|1\d\d)\s*(?:\/|\s*per\s*)hr|\$(?:3000|4000|5000|6000)\s*(?:\/|\s*per\s*)week|no experience required.{0,40}\$(?:[5-9]\d|1\d\d)|earn \$[1-9]\d{3,4}\s*(daily|weekly))/i,
    recommendation: 'Compare typical market salaries for this job title on verified platforms like Levels.fyi, Glassdoor, or Payscale.',
  },
  {
    id: 'PROC_IMMEDIATE_OFFER',
    category: 'PROCEDURE',
    severity: 'HIGH',
    title: 'Immediate Job Offer Without Substantive Interview',
    description: 'Claims you are already selected or hired immediately without a thorough technical or behavioral interview.',
    pattern: /(you have been (selected|hired) immediately|immediate employment|no interview (needed|required)|hired on the spot|congratulations you are hired)/i,
    recommendation: 'Genuine companies require identity verification, multi-stage interviews, and formal offer letters before hire.',
  },
  {
    id: 'IDENTITY_PREMATURE_SSN_BANK',
    category: 'IDENTITY',
    severity: 'HIGH',
    title: 'Premature Request for Banking or SSN Information',
    description: 'Requests direct deposit bank account details, Social Security number, or passport before formal contract signing.',
    pattern: /(provide (your )?(ssn|social security number|bank account|direct deposit info|routing number) (to receive|for the offer|immediately)|send picture of your id and bank)/i,
    recommendation: 'Never disclose banking or tax identity details until you have independently verified the employer and reviewed an official contract.',
  },
  {
    id: 'PROC_HIGH_PRESSURE',
    category: 'PROCEDURE',
    severity: 'MEDIUM',
    title: 'High-Pressure Urgency Tactics',
    description: 'Imposes short artificial deadlines (e.g., must accept within 2-6 hours) to prevent independent verification.',
    pattern: /(respond within (?:2|4|6|12)\s*hours|offer expires in 24 hours|immediate response required|urgent offer)/i,
    recommendation: 'Take time to research the company and recruiter. Legitimate employers allow reasonable time for offer evaluation.',
  },
];

export function analyzeJobOffer(input: SafetyCheckInput): SafetyCheckResult {
  const combinedText = [
    input.companyName,
    input.jobText,
    input.recruiterMessage,
    input.jobUrl,
  ].join('\n');

  const detectedIndicators: SafetyIndicator[] = [];
  const supportingEvidence: string[] = [];
  let scoreSum = 0;

  for (const rule of SAFETY_RULES) {
    const match = combinedText.match(rule.pattern);
    if (match) {
      const matchedSnippet = match[0];
      const surroundingContext = extractContext(combinedText, match.index ?? 0, matchedSnippet.length);

      detectedIndicators.push({
        id: rule.id,
        category: rule.category,
        severity: rule.severity,
        title: rule.title,
        description: `${rule.description} Recommended action: ${rule.recommendation}`,
        matchedEvidence: `"${surroundingContext}"`,
      });

      supportingEvidence.push(
        `Triggered [${rule.title}]: Found "${matchedSnippet}" in submitted text.`
      );

      scoreSum += rule.severity === 'HIGH' ? 35 : rule.severity === 'MEDIUM' ? 20 : 10;
    }
  }

  // URL specific heuristic analysis
  if (input.jobUrl) {
    const urlWarnings = checkUrlIndicators(input.jobUrl, input.companyName);
    for (const uw of urlWarnings) {
      detectedIndicators.push(uw);
      supportingEvidence.push(`URL Heuristic [${uw.title}]: ${uw.description}`);
      scoreSum += uw.severity === 'HIGH' ? 30 : 15;
    }
  }

  // Determine normalized risk score (0-100)
  const normalizedScore = Math.min(100, scoreSum);

  let riskLevel: SafetyRiskLevel = 'NO_WARNINGS_FOUND';
  let title = 'No Configured Warning Signs Found';
  let summary =
    'None of our configured red-flag patterns were detected in the submitted text. However, scammers frequently evolve techniques. Always perform standard verification.';

  if (normalizedScore >= 35 || detectedIndicators.some((i) => i.severity === 'HIGH')) {
    riskLevel = 'WARNING_SIGNS_FOUND';
    title = 'Warning Signs Found';
    summary =
      'Multiple high-risk indicators or known recruitment scam patterns were detected in the provided content. Exercise extreme caution before proceeding.';
  } else if (detectedIndicators.length > 0 || normalizedScore > 0) {
    riskLevel = 'NEEDS_VERIFICATION';
    title = 'Needs Verification';
    summary =
      'Some elements warrant scrutiny before sharing sensitive personal details or making commitments. Follow the suggested verification checklist below.';
  }

  const suggestedSteps = generateVerificationSteps(detectedIndicators, input.companyName);

  const limitations = [
    'Automated rule matching evaluates text patterns and cannot verify real-world legal incorporation or offline credentials.',
    'Scammers may spoof legitimate company names and official logos.',
    'No automated tool can definitively declare an employer to be 100% genuine or 100% fraudulent.',
    'Submitted URLs are analyzed using static heuristics. Live fetching across external or private networks is disabled to prevent SSRF vulnerabilities.',
  ];

  return {
    riskLevel,
    riskScore: normalizedScore,
    title,
    summary,
    indicators: detectedIndicators,
    supportingEvidence,
    limitations,
    suggestedSteps,
    analyzedAt: new Date().toISOString(),
  };
}

function extractContext(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + length + 30);
  let snippet = text.substring(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

function checkUrlIndicators(url: string, companyName: string): SafetyIndicator[] {
  const indicators: SafetyIndicator[] = [];
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);

    // Check suspicious top-level domains often used in spoofing
    if (/\.(xyz|top|work|click|loan|gq|cf|ml|tk|fit|rest)$/i.test(parsed.hostname)) {
      indicators.push({
        id: 'URL_SUSPICIOUS_TLD',
        category: 'IDENTITY',
        severity: 'MEDIUM',
        title: 'Unusual Top-Level Domain (.xyz, .top, .work, etc.)',
        description: `The domain "${parsed.hostname}" uses a top-level domain frequently associated with throwaway phishing sites.`,
      });
    }

    // Check for IP address URLs or localhost / private ranges
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname) || parsed.hostname === 'localhost') {
      indicators.push({
        id: 'URL_RAW_IP_OR_LOCAL',
        category: 'IDENTITY',
        severity: 'HIGH',
        title: 'Suspicious IP Address or Local Hostname',
        description: 'URL points directly to an IP address or non-standard host instead of a registered company domain.',
      });
    }

    // Check typosquatting heuristic if company name is provided
    if (companyName && companyName.length > 3) {
      const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const hostname = parsed.hostname.toLowerCase();
      if (
        (hostname.includes(`${cleanCompany}-careers`) ||
          hostname.includes(`${cleanCompany}-jobs`) ||
          hostname.includes(`hire-${cleanCompany}`)) &&
        !hostname.endsWith(`.${cleanCompany}.com`)
      ) {
        indicators.push({
          id: 'URL_TYPOSQUAT_SUSPECT',
          category: 'IDENTITY',
          severity: 'MEDIUM',
          title: 'Potential Domain Impersonation / Lookalike',
          description: `The URL "${parsed.hostname}" contains the company name alongside words like "-careers" or "-jobs", which is a common tactic for impersonation.`,
        });
      }
    }
  } catch {
    indicators.push({
      id: 'URL_INVALID_FORMAT',
      category: 'IDENTITY',
      severity: 'LOW',
      title: 'Malformed or Unparseable URL',
      description: 'The supplied URL could not be parsed as a valid standard web address.',
    });
  }

  return indicators;
}

function generateVerificationSteps(indicators: SafetyIndicator[], companyName: string): string[] {
  const steps: string[] = [
    `Search the official company website directly: navigate to the company's verified primary domain and check their active "Careers" page.`,
    `Cross-reference the recruiter: Search for the recruiter on LinkedIn and confirm they actively work at ${companyName || 'the company'}.`,
    `Verify the sender's email domain: Ensure correspondence comes from @company.com, not free domains (@gmail) or slight lookalikes.`,
    `Refuse upfront payments: Never purchase equipment via check, wire, cryptocurrency, or gift cards under any circumstances.`,
    `Protect personal identity data: Never provide Social Security numbers, banking details, or passport scans before verifying a verified written contract.`,
  ];

  if (indicators.some((i) => i.category === 'FINANCIAL')) {
    steps.unshift('CRITICAL: Cease any financial transactions. Report fake check or wire instructions to your bank immediately.');
  }

  if (indicators.some((i) => i.id === 'COMM_TELEGRAM_WHATSAPP')) {
    steps.unshift('Insist on communicating through verified corporate email and schedule a live video or in-person interview.');
  }

  return steps;
}
