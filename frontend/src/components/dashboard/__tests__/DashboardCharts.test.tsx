import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardCharts from '../DashboardCharts';

jest.mock('recharts', () => {
  const React = require('react');

  const passthrough = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  return {
    ResponsiveContainer: passthrough,
    BarChart: ({ data }: { data?: unknown[] }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
    PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
    Bar: passthrough,
    Cell: () => null,
    CartesianGrid: () => null,
    Legend: () => null,
    Pie: ({ data }: { data?: unknown[] }) => <div data-testid="pie-series">{JSON.stringify(data)}</div>,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
  };
});

describe('DashboardCharts', () => {
  it('builds status and lifecycle summaries from the project list', () => {
    render(
      <DashboardCharts
        projects={[
          {
            id: 1,
            name: 'Portal SH',
            client_name: 'Cliente A',
            description: 'Portal principal',
            status: 'development',
            estimated_hours: 120,
            budget: '10000.00',
            house_fee: '1000.00',
            deadline: '2026-06-01',
          },
          {
            id: 2,
            name: 'Landing B',
            client_name: 'Cliente B',
            description: 'Landing page',
            status: 'delivered',
            estimated_hours: 40,
            budget: '4000.00',
            house_fee: '400.00',
            deadline: '2026-05-01',
          },
          {
            id: 3,
            name: 'Suporte C',
            client_name: 'Cliente C',
            description: 'Apoio contínuo',
            status: 'support',
            estimated_hours: 20,
            budget: '2000.00',
            house_fee: '200.00',
            deadline: '2026-07-01',
          },
        ] as any}
      />,
    );

    expect(screen.getByText('Distribuição por status')).toBeInTheDocument();
    expect(screen.getByText('Ciclo atual')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toHaveTextContent('Desenvolvimento');
    expect(screen.getByTestId('bar-chart')).toHaveTextContent('Entregue');
    expect(screen.getByTestId('pie-series')).toHaveTextContent('Ativos');
    expect(screen.getByTestId('pie-series')).toHaveTextContent('Entregues');
    expect(screen.getByTestId('pie-series')).toHaveTextContent('Suporte');
  });
});