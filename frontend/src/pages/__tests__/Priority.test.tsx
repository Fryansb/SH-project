import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PriorityPage from '../Priority';
import authAPI from '../../services/auth';
import priorityAPI from '../../services/priority';
import projectsAPI from '../../services/projects';

jest.mock('../../services/auth');
jest.mock('../../services/priority');
jest.mock('../../services/projects');

const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedPriorityAPI = priorityAPI as jest.Mocked<typeof priorityAPI>;
const mockedProjectsAPI = projectsAPI as jest.Mocked<typeof projectsAPI>;

describe('PriorityPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the queue for a member', async () => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'member@test.com', role: 'member' } as any);
    mockedPriorityAPI.queue.mockResolvedValue({
      count: 2,
      current_member_position: 2,
      project: null,
      results: [
        {
          id: 7,
          member_id: 7,
          member_name: 'other@test.com',
          member_email: 'other@test.com',
          priority_score: 180,
          stack_bonus: 0,
          matching_stacks: [],
          available_hours: 12,
          weekly_hours: 40,
          rating: 3,
          last_project_date: '2026-04-12T10:00:00Z',
          position: 1,
          is_current_user: false,
        },
        {
          id: 8,
          member_id: 8,
          member_name: 'member@test.com',
          member_email: 'member@test.com',
          priority_score: 220,
          stack_bonus: 0,
          matching_stacks: [],
          available_hours: 20,
          weekly_hours: 40,
          rating: 4,
          last_project_date: '2026-04-01T10:00:00Z',
          position: 2,
          is_current_user: true,
        },
      ],
    } as any);

    render(<PriorityPage />);

    expect(await screen.findByText('member@test.com')).toBeInTheDocument();
    expect(screen.getByText('Sua posição: 2')).toBeInTheDocument();
  });

  it('lets admins recalculate the queue', async () => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
    mockedProjectsAPI.list.mockResolvedValue([
      {
        id: 11,
        name: 'Portal SH',
        client_name: 'Cliente A',
        description: 'Portal principal',
        status: 'lead',
        required_stacks: ['Django'],
        estimated_hours: 120,
        budget: '10000.00',
        house_fee: '1000.00',
        deadline: '2026-06-01',
      },
    ] as any);
    mockedPriorityAPI.queue.mockResolvedValue({
      count: 2,
      current_member_position: null,
      project: null,
      results: [
        {
          id: 7,
          member_id: 7,
          member_name: 'other@test.com',
          member_email: 'other@test.com',
          priority_score: 180,
          stack_bonus: 0,
          matching_stacks: [],
          available_hours: 12,
          weekly_hours: 40,
          rating: 3,
          last_project_date: '2026-04-12T10:00:00Z',
          position: 1,
          is_current_user: false,
        },
        {
          id: 8,
          member_id: 8,
          member_name: 'member@test.com',
          member_email: 'member@test.com',
          priority_score: 220,
          stack_bonus: 0,
          matching_stacks: [],
          available_hours: 20,
          weekly_hours: 40,
          rating: 4,
          last_project_date: '2026-04-01T10:00:00Z',
          position: 2,
          is_current_user: true,
        },
      ],
    } as any);
    mockedPriorityAPI.recalculate.mockResolvedValue({} as any);
    mockedPriorityAPI.reorder.mockResolvedValue({} as any);

    render(<PriorityPage />);

    expect(await screen.findByRole('button', { name: 'Recalcular fila' })).toBeInTheDocument();
    expect(await screen.findByText('other@test.com')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Recalcular fila' }));

    await waitFor(() => {
      expect(mockedPriorityAPI.recalculate).toHaveBeenCalled();
    });
  });

  it('lets admins reorder the queue manually', async () => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
    mockedProjectsAPI.list.mockResolvedValue([
      {
        id: 11,
        name: 'Portal SH',
        client_name: 'Cliente A',
        description: 'Portal principal',
        status: 'lead',
        required_stacks: ['Django'],
        estimated_hours: 120,
        budget: '10000.00',
        house_fee: '1000.00',
        deadline: '2026-06-01',
      },
    ] as any);
    mockedPriorityAPI.queue.mockResolvedValue({
      count: 2,
      current_member_position: null,
      project: null,
      results: [
        {
          id: 7,
          member_id: 7,
          member_name: 'other@test.com',
          member_email: 'other@test.com',
          priority_score: 180,
          stack_bonus: 0,
          matching_stacks: [],
          available_hours: 12,
          weekly_hours: 40,
          rating: 3,
          last_project_date: '2026-04-12T10:00:00Z',
          position: 1,
          is_current_user: false,
        },
        {
          id: 8,
          member_id: 8,
          member_name: 'member@test.com',
          member_email: 'member@test.com',
          priority_score: 220,
          stack_bonus: 0,
          matching_stacks: [],
          available_hours: 20,
          weekly_hours: 40,
          rating: 4,
          last_project_date: '2026-04-01T10:00:00Z',
          position: 2,
          is_current_user: true,
        },
      ],
    } as any);
    mockedPriorityAPI.reorder.mockResolvedValue({} as any);

    render(<PriorityPage />);

    expect(await screen.findByText('other@test.com')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Mover other@test.com para baixo'));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar ordem manual' }));

    await waitFor(() => {
      expect(mockedPriorityAPI.reorder).toHaveBeenCalledWith({
        ordered_member_ids: [8, 7],
      });
    });
  });
});