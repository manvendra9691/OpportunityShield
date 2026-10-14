import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, SafetyBadge } from './Badge';

describe('Badge Components', () => {
  it('renders application status badge correctly', () => {
    render(<StatusBadge status="Interview" />);
    expect(screen.getByText('Interview')).toBeInTheDocument();
  });

  it('renders warning signs found safety badge', () => {
    render(<SafetyBadge level="WARNING_SIGNS_FOUND" />);
    expect(screen.getByText('Warning Signs Found')).toBeInTheDocument();
  });

  it('renders no configured warning signs found safety badge', () => {
    render(<SafetyBadge level="NO_WARNINGS_FOUND" />);
    expect(screen.getByText('No Configured Warning Signs Found')).toBeInTheDocument();
  });

  it('renders needs verification safety badge', () => {
    render(<SafetyBadge level="NEEDS_VERIFICATION" />);
    expect(screen.getByText('Needs Verification')).toBeInTheDocument();
  });
});
