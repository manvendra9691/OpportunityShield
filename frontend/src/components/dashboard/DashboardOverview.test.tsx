import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardOverview } from './DashboardOverview';
import { INITIAL_APPLICATIONS, INITIAL_REMINDERS } from '../../data/sampleData';

describe('DashboardOverview Component', () => {
  it('renders summary statistics and sections', () => {
    const handleNavigate = vi.fn();
    const handleOpenAddModal = vi.fn();
    const handleToggleReminder = vi.fn();
    const handleSelectApplication = vi.fn();

    render(
      <DashboardOverview
        applications={INITIAL_APPLICATIONS}
        reminders={INITIAL_REMINDERS}
        onNavigate={handleNavigate}
        onOpenAddModal={handleOpenAddModal}
        onToggleReminder={handleToggleReminder}
        onSelectApplication={handleSelectApplication}
      />
    );

    // Verify key titles and metrics are visible
    expect(screen.getByText(/Protect Your Search/i)).toBeInTheDocument();
    expect(screen.getByText('Active Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Interviews Scheduled')).toBeInTheDocument();
    expect(screen.getByText('Follow-Up Actions')).toBeInTheDocument();
    expect(screen.getByText('Flagged Suspicious')).toBeInTheDocument();

    // Verify sample application items are listed
    expect(screen.getByText('Senior Full-Stack Engineer')).toBeInTheDocument();
    expect(screen.getAllByText('Acme Cloud Solutions').length).toBeGreaterThan(0);

    // Verify quick action buttons exist
    expect(screen.getByText('Scan Suspicious Offer')).toBeInTheDocument();
    expect(screen.getByText('Track New Job')).toBeInTheDocument();
  });
});
