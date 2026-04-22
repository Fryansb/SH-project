import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HoursPage from '../Hours';
import authAPI from '../../services/auth';
import hoursAPI from '../../services/hours';
import membersAPI from '../../services/members';
import projectsAPI from '../../services/projects';

jest.mock('../../services/auth');
jest.mock('../../services/hours');
jest.mock('../../services/members');
jest.mock('../../services/projects');

const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedHoursAPI = hoursAPI as jest.Mocked<typeof hoursAPI>;
const mockedMembersAPI = membersAPI as jest.Mocked<typeof membersAPI>;
const mockedProjectsAPI = projectsAPI as jest.Mocked<typeof projectsAPI>;

describe('HoursPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedProjectsAPI.list.mockResolvedValue([
      {
        id: 10,
        name: 'Portal SH',
        client_name: 'Cliente A',
        description: 'Portal principal',
        status: 'lead',
        estimated_hours: 120,
        budget: '10000.00',
        house_fee: '1000.00',
        deadline: '2026-06-01',
      },
    ] as any);
  });

  it('renders hour entries from the API', async () => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'member@test.com', role: 'member' } as any);
    mockedHoursAPI.list.mockResolvedValue([
      {
        id: 1,
        member: 7,
        project: 10,
        project_name: 'Portal SH',
        hours: 6,
        date: '2026-04-01',
        description: 'Refatoração da landing',
      },
    ] as any);

    render(<HoursPage />);

    expect(await screen.findByText('Portal SH')).toBeInTheDocument();
    expect(screen.getByText('6h')).toBeInTheDocument();
    expect(screen.getByText('Refatoração da landing')).toBeInTheDocument();
  });

  it('allows a member to create a new hour entry', async () => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'member@test.com', role: 'member' } as any);
    mockedHoursAPI.list.mockResolvedValue([] as any);
    mockedHoursAPI.create.mockResolvedValue({
      id: 2,
      member: 7,
      project: 10,
      project_name: 'Portal SH',
      hours: 4,
      date: '2026-04-10',
      description: 'Ajustes finais',
    } as any);

    render(<HoursPage />);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Registrar horas' })).toBeEnabled());
    fireEvent.change(await screen.findByLabelText('Projeto'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Horas'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Data'), { target: { value: '2026-04-10' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Ajustes finais' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar horas' }));

    await waitFor(() => {
      expect(mockedHoursAPI.create).toHaveBeenCalledWith({
        project_id: 10,
        hours: 4,
        date: '2026-04-10',
        description: 'Ajustes finais',
      });
    });
  });

  it('shows the member selector for admins', async () => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
    mockedHoursAPI.list.mockResolvedValue([] as any);
    mockedMembersAPI.list.mockResolvedValue([
      {
        id: 7,
        user_email: 'member@test.com',
        weekly_hours: 40,
        available_hours: 24,
        rating: 0,
        priority_score: 0,
      },
    ] as any);

    render(<HoursPage />);

    expect(await screen.findByLabelText('Membro')).toBeInTheDocument();
  });
});