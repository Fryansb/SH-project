import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportsPage from '../Reports';
import reportsAPI from '../../services/reports';

jest.mock('../../services/reports');

const mockedReportsAPI = reportsAPI as jest.Mocked<typeof reportsAPI>;

describe('ReportsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedReportsAPI.performance.mockResolvedValue({
      generated_at: '2026-04-21T10:00:00Z',
      summary: {
        member_count: 2,
        project_count: 2,
        active_project_count: 1,
        delivered_project_count: 1,
        members_with_projects: 2,
        total_hours: 10,
        average_hours_per_member: 5,
        average_priority_score: 150,
        average_rating: 3.5,
      },
      members: [
        {
          member_id: 1,
          name: 'member@test.com',
          email: 'member@test.com',
          priority_score: 220,
          available_hours: 20,
          weekly_hours: 40,
          rating: 4,
          last_project_date: '2026-04-01T10:00:00Z',
          total_hours: 6,
          project_count: 1,
          active_project_count: 1,
          delivered_project_count: 0,
          stacks: ['Django'],
        },
      ],
      top_priority_members: [],
    } as any);

    mockedReportsAPI.financial.mockResolvedValue({
      generated_at: '2026-04-21T10:00:00Z',
      summary: {
        project_count: 2,
        active_project_count: 1,
        delivered_project_count: 1,
        total_budget: '14000.00',
        total_house_fee: '1600.00',
        total_member_share: '12400.00',
        average_budget: '7000.00',
      },
      projects: [
        {
          project_id: 10,
          name: 'Portal SH',
          client_name: 'Cliente A',
          status: 'lead',
          status_label: 'Lead',
          budget: '10000.00',
          house_fee: '1000.00',
          remaining_budget: '9000.00',
          member_count: 1,
          member_share: '9000.00',
          deadline: '2026-06-01',
        },
      ],
    } as any);

    mockedReportsAPI.hours.mockResolvedValue({
      generated_at: '2026-04-21T10:00:00Z',
      summary: {
        entry_count: 2,
        total_hours: 10,
        member_count: 2,
        project_count: 2,
        average_hours_per_member: 5,
        average_hours_per_project: 5,
      },
      members: [
        {
          member_id: 1,
          name: 'member@test.com',
          email: 'member@test.com',
          total_hours: 6,
          entry_count: 1,
          available_hours: 20,
          weekly_hours: 40,
          last_activity_date: '2026-04-14',
        },
      ],
      projects: [
        {
          project_id: 10,
          name: 'Portal SH',
          client_name: 'Cliente A',
          total_hours: 6,
          entry_count: 1,
          member_count: 1,
          latest_activity_date: '2026-04-14',
        },
      ],
      timeline: [
        {
          date: '2026-04-14',
          total_hours: 6,
          entry_count: 1,
        },
      ],
    } as any);
  });

  it('renders consolidated report data', async () => {
    render(<ReportsPage />);

    expect(await screen.findByText('Desempenho')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
    expect(screen.getByText('Horas')).toBeInTheDocument();
    expect(screen.getByText('Portal SH • Lead')).toBeInTheDocument();
    expect(screen.getByText('member@test.com • Score 220')).toBeInTheDocument();
  });
});