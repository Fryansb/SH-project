import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../Dashboard';
import authAPI from '../../services/auth';
import projectsAPI from '../../services/projects';

jest.mock('../../services/auth');
jest.mock('../../services/projects');

const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedProjectsAPI = projectsAPI as jest.Mocked<typeof projectsAPI>;

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
    mockedProjectsAPI.list.mockResolvedValue([
      {
        id: 1,
        name: 'Portal SH',
        client_name: 'Cliente A',
        description: 'Portal principal',
        status: 'development',
        status_label: 'Desenvolvimento',
        estimated_hours: 120,
        budget: '10000.00',
        house_fee: '1000.00',
        deadline: '2026-06-01',
        created_at: '2026-04-20T10:00:00Z',
        documents_count: 2,
        history_count: 5,
        assigned_members: [{ id: 7, email: 'membro@test.com' }],
      },
      {
        id: 2,
        name: 'Landing B',
        client_name: 'Cliente B',
        description: 'Landing page',
        status: 'delivered',
        status_label: 'Entregue',
        estimated_hours: 40,
        budget: '4000.00',
        house_fee: '400.00',
        deadline: '2026-05-01',
        created_at: '2026-04-18T10:00:00Z',
        documents_count: 1,
        history_count: 3,
        assigned_members: [],
      },
    ] as any);
  });

  it('renders a modular operational dashboard', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Visão operacional completa')).toBeInTheDocument();
    expect(screen.getByText('Distribuição por status')).toBeInTheDocument();
    expect(screen.getByText('Ciclo atual')).toBeInTheDocument();
    expect(screen.getByText('Projetos recentes')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Portal SH')).toBeInTheDocument();
      expect(screen.getByText('Landing B')).toBeInTheDocument();
    });
  });
});