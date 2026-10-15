import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ReportsPage from '../Reports';
import reportsAPI from '../../services/reports';

jest.mock('recharts', () => {
  const React = require('react');

  const passthrough = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  return {
    ResponsiveContainer: passthrough,
    BarChart: ({ data, children }: { data?: unknown[]; children?: React.ReactNode }) => (
      <div data-testid="bar-chart">{JSON.stringify(data)}{children}</div>
    ),
    LineChart: ({ data, children }: { data?: unknown[]; children?: React.ReactNode }) => (
      <div data-testid="line-chart">{JSON.stringify(data)}{children}</div>
    ),
    PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
    Bar: passthrough,
    Cell: () => null,
    CartesianGrid: () => null,
    Legend: () => null,
    Line: passthrough,
    Pie: ({ data }: { data?: unknown[] }) => <div data-testid="pie-series">{JSON.stringify(data)}</div>,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
  };
});

jest.mock('../../services/reports');

const mockedReportsAPI = reportsAPI as jest.Mocked<typeof reportsAPI>;

describe('ReportsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedReportsAPI.performance.mockResolvedValue({
      generated_at: '2026-04-21T10:00:00Z',
      summary: {
        member_count: 3,
        project_count: 2,
        active_project_count: 1,
        delivered_project_count: 1,
        members_with_projects: 2,
        total_hours: 18,
        average_hours_per_member: 6,
        average_priority_score: 150,
        average_rating: 3.7,
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
          project_count: 2,
          active_project_count: 1,
          delivered_project_count: 1,
          stacks: ['Django', 'React'],
        },
        {
          member_id: 2,
          name: 'other@test.com',
          email: 'other@test.com',
          priority_score: 130,
          available_hours: 12,
          weekly_hours: 40,
          rating: 3.4,
          last_project_date: '2026-04-08T10:00:00Z',
          total_hours: 4,
          project_count: 0,
          active_project_count: 0,
          delivered_project_count: 0,
          stacks: ['React'],
        },
        {
          member_id: 3,
          name: 'third@test.com',
          email: 'third@test.com',
          priority_score: 90,
          available_hours: 15,
          weekly_hours: 40,
          rating: 3.8,
          last_project_date: '2026-04-12T10:00:00Z',
          total_hours: 8,
          project_count: 1,
          active_project_count: 1,
          delivered_project_count: 0,
          stacks: ['Node.js'],
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
        {
          project_id: 11,
          name: 'Landing B',
          client_name: 'Cliente B',
          status: 'delivered',
          status_label: 'Entregue',
          budget: '4000.00',
          house_fee: '600.00',
          remaining_budget: '3400.00',
          member_count: 1,
          member_share: '3400.00',
          deadline: '2026-05-01',
        },
        {
          project_id: 12,
          name: 'Suporte C',
          client_name: 'Cliente C',
          status: 'support',
          status_label: 'Suporte',
          budget: '2000.00',
          house_fee: '300.00',
          remaining_budget: '1700.00',
          member_count: 2,
          member_share: '850.00',
          deadline: '2026-07-01',
        },
      ],
    } as any);

    mockedReportsAPI.hours.mockResolvedValue({
      generated_at: '2026-04-21T10:00:00Z',
      summary: {
        entry_count: 4,
        total_hours: 18,
        member_count: 3,
        project_count: 3,
        average_hours_per_member: 6,
        average_hours_per_project: 6,
      },
      members: [
        {
          member_id: 1,
          name: 'member@test.com',
          email: 'member@test.com',
          total_hours: 8,
          entry_count: 2,
          available_hours: 20,
          weekly_hours: 40,
          last_activity_date: '2026-04-14',
        },
        {
          member_id: 2,
          name: 'other@test.com',
          email: 'other@test.com',
          total_hours: 6,
          entry_count: 1,
          available_hours: 12,
          weekly_hours: 40,
          last_activity_date: '2026-04-18',
        },
      ],
      projects: [
        {
          project_id: 10,
          name: 'Portal SH',
          client_name: 'Cliente A',
          total_hours: 8,
          entry_count: 2,
          member_count: 1,
          latest_activity_date: '2026-04-14',
        },
        {
          project_id: 11,
          name: 'Landing B',
          client_name: 'Cliente B',
          total_hours: 6,
          entry_count: 1,
          member_count: 1,
          latest_activity_date: '2026-04-18',
        },
      ],
      timeline: [
        {
          date: '2026-04-10',
          total_hours: 2,
          entry_count: 1,
        },
        {
          date: '2026-04-14',
          total_hours: 6,
          entry_count: 1,
        },
        {
          date: '2026-04-18',
          total_hours: 10,
          entry_count: 2,
        },
      ],
    } as any);
  });

  it('renders charts and summary sections', async () => {
    render(<ReportsPage />);

    expect(await screen.findByText('Desempenho')).toBeInTheDocument();
    expect(screen.getByTestId('reports-performance')).toBeInTheDocument();
    expect(screen.getByTestId('reports-financial')).toBeInTheDocument();
    expect(screen.getByTestId('reports-hours')).toBeInTheDocument();
    expect(screen.getAllByTestId('bar-chart')).toHaveLength(3);
    expect(screen.getAllByTestId('pie-chart')).toHaveLength(2);
    expect(screen.getAllByTestId('line-chart')).toHaveLength(1);
  });

  it('filters performance members by stack and score', async () => {
    render(<ReportsPage />);

    expect(await screen.findByText('Desempenho')).toBeInTheDocument();
    const performanceSection = await screen.findByTestId('reports-performance');
    fireEvent.click(within(performanceSection).getByRole('button', { name: 'React' }));
    fireEvent.change(within(performanceSection).getByLabelText('Score mínimo'), { target: { value: '200' } });

    expect(within(performanceSection).getByText('member@test.com • Score 220')).toBeInTheDocument();
    expect(within(performanceSection).queryByText('other@test.com • Score 130')).not.toBeInTheDocument();
    expect(within(performanceSection).queryByText('third@test.com • Score 90')).not.toBeInTheDocument();
  });

  it('filters financial and hours sections', async () => {
    render(<ReportsPage />);

    expect(await screen.findByText('Desempenho')).toBeInTheDocument();
    const financialSection = await screen.findByTestId('reports-financial');
    fireEvent.click(within(financialSection).getByRole('button', { name: 'Entregue' }));

    expect(within(financialSection).getByText('Landing B • Entregue')).toBeInTheDocument();
    expect(within(financialSection).queryByText('Portal SH • Lead')).not.toBeInTheDocument();

    const hoursSection = await screen.findByTestId('reports-hours');
    fireEvent.click(within(hoursSection).getByRole('button', { name: '7 dias' }));

    expect(within(hoursSection).getByTestId('line-chart')).toHaveTextContent('18/04/2026');
    expect(within(hoursSection).getByTestId('line-chart')).not.toHaveTextContent('10/04/2026');
  });
});