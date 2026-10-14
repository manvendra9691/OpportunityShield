import { describe, it, expect } from 'vitest';
import { analyzeJobOffer } from './safetyChecker';

describe('Safety Checker Rule Engine', () => {
  it('detects fake check and equipment purchasing scams as high risk', () => {
    const input = {
      companyName: 'Global Logistics',
      jobUrl: 'http://globallogistics.example',
      jobText: 'Remote Data Entry Clerk. Earn $85/hr from home.',
      recruiterMessage:
        'We will send you a cashier check to purchase your equipment and home office laptop from our authorized vendor.',
    };

    const result = analyzeJobOffer(input);
    expect(result.riskLevel).toBe('WARNING_SIGNS_FOUND');
    expect(result.riskScore).toBeGreaterThanOrEqual(35);
    expect(result.indicators.some((i) => i.id === 'FEE_CHECK_EQUIPMENT')).toBe(true);
    expect(result.suggestedSteps.length).toBeGreaterThan(0);
  });

  it('detects Telegram/WhatsApp text-only interviews as high risk', () => {
    const input = {
      companyName: 'Apex Tech',
      jobUrl: '',
      jobText: 'Software developer position.',
      recruiterMessage:
        'Please download Telegram and connect with our hiring manager on Telegram at @ApexHiring.',
    };

    const result = analyzeJobOffer(input);
    expect(result.riskLevel).toBe('WARNING_SIGNS_FOUND');
    expect(result.indicators.some((i) => i.id === 'COMM_TELEGRAM_WHATSAPP')).toBe(true);
  });

  it('detects upfront registration or training fees', () => {
    const input = {
      companyName: 'Prime Staffing',
      jobUrl: '',
      jobText: 'Junior analyst. Please pay an onboarding fee of $50 for background certification.',
      recruiterMessage: 'Deposit the fee to commence your orientation.',
    };

    const result = analyzeJobOffer(input);
    expect(result.riskLevel).toBe('WARNING_SIGNS_FOUND');
    expect(result.indicators.some((i) => i.id === 'FEE_APPLICATION_TRAINING')).toBe(true);
  });

  it('flags lookalike TLDs in suspicious URLs', () => {
    const input = {
      companyName: 'Acme Systems',
      jobUrl: 'https://acme-careers-portal.xyz/apply',
      jobText: 'Standard engineering job.',
      recruiterMessage: 'Apply via our portal.',
    };

    const result = analyzeJobOffer(input);
    expect(result.indicators.some((i) => i.id === 'URL_SUSPICIOUS_TLD')).toBe(true);
  });

  it('returns NO_WARNINGS_FOUND for legitimate corporate postings', () => {
    const input = {
      companyName: 'Stripe',
      jobUrl: 'https://stripe.com/jobs/12345',
      jobText:
        'Senior Backend Engineer. 5+ years experience with Java, Spring Boot, and MySQL. Competitive salary and benefits.',
      recruiterMessage:
        'Hello, please view the role on stripe.com and schedule a call with our recruiting team.',
    };

    const result = analyzeJobOffer(input);
    expect(result.riskLevel).toBe('NO_WARNINGS_FOUND');
    expect(result.riskScore).toBe(0);
    expect(result.indicators.length).toBe(0);
  });

  it('never outputs definitive claims of absolute fraud or guarantee', () => {
    const input = {
      companyName: 'Unknown LLC',
      jobUrl: '',
      jobText: 'Cashier check and bitcoin payment.',
      recruiterMessage: 'Send wire right now.',
    };

    const result = analyzeJobOffer(input);
    expect(result.limitations.length).toBeGreaterThan(0);
    // Verifies limitation mentions heuristic nature
    expect(result.limitations.some((l) => l.includes('Automated rule matching'))).toBe(true);
  });
});
