import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardMetricCard from '../DashboardMetricCard';

describe('DashboardMetricCard', () => {
  it('renders the metric label, value and helper text', () => {
    render(<DashboardMetricCard label="Projetos" value="12" helperText="Total visível" />);

    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Total visível')).toBeInTheDocument();
  });
});