import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProjectsPage from '../Projects';
import authAPI from '../../services/auth';
import membersAPI from '../../services/members';
import projectsAPI from '../../services/projects';
import stacksAPI from '../../services/stacks';

jest.mock('../../services/auth');
jest.mock('../../services/members');
jest.mock('../../services/projects');
jest.mock('../../services/stacks');

const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedMembersAPI = membersAPI as jest.Mocked<typeof membersAPI>;
const mockedProjectsAPI = projectsAPI as jest.Mocked<typeof projectsAPI>;
const mockedStacksAPI = stacksAPI as jest.Mocked<typeof stacksAPI>;

describe('ProjectsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
    mockedMembersAPI.list.mockResolvedValue([
      {
        id: 7,
        user_email: 'membro@test.com',
        weekly_hours: 40,
        available_hours: 20,
        rating: 0,
        priority_score: 0,
      },
    ] as any);
    mockedStacksAPI.list.mockResolvedValue([
      {
        id: 1,
        name: 'Django',
      },
    ]);
    mockedProjectsAPI.list.mockResolvedValue([]);
    mockedProjectsAPI.documents.mockResolvedValue([] as any);
    mockedProjectsAPI.history.mockResolvedValue([] as any);
  });

  it('renders projects from the API', async () => {
    mockedProjectsAPI.list.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Portal SH',
        client_name: 'Cliente A',
        description: 'Portal principal da agência',
        status: 'lead',
        status_label: 'Lead',
        required_stacks: ['Django', 'React'],
        assigned_members: [{ id: 7, email: 'membro@test.com' }],
        estimated_hours: 120,
        budget: '10000.00',
        house_fee: '1000.00',
        deadline: '2026-06-01',
      },
    ] as any);

    render(<ProjectsPage />);

    expect(await screen.findByText('Portal SH')).toBeInTheDocument();
    expect(await screen.findByText('Cliente A • Lead')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Django')).toBeInTheDocument());
    expect(screen.getByText('membro@test.com')).toBeInTheDocument();
  });

  it('allows admins to create a project', async () => {
    render(<ProjectsPage />);

    fireEvent.click(await screen.findByRole('button', { name: 'Novo projeto' }));
    fireEvent.change(await screen.findByLabelText('Nome'), { target: { value: 'Novo projeto' } });
    fireEvent.change(screen.getByLabelText('Cliente'), { target: { value: 'Cliente C' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Novo projeto SH' } });
    fireEvent.change(screen.getByLabelText('Horas estimadas'), { target: { value: '60' } });
    fireEvent.change(screen.getByLabelText('Budget'), { target: { value: '5000.00' } });
    fireEvent.change(screen.getByLabelText('Deadline'), { target: { value: '2026-08-01' } });
    fireEvent.click(await screen.findByLabelText('Django'));
    fireEvent.click(await screen.findByLabelText('membro@test.com'));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(mockedProjectsAPI.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Novo projeto',
          client_name: 'Cliente C',
          description: 'Novo projeto SH',
          status: 'lead',
          estimated_hours: 60,
          budget: '5000.00',
          deadline: '2026-08-01',
          required_stack_ids: [1],
          assigned_member_ids: [7],
        }),
      );
    });
  });

  it('opens the project documentation dialog', async () => {
    mockedProjectsAPI.list.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Portal SH',
        client_name: 'Cliente A',
        description: 'Portal principal da agência',
        status: 'lead',
        status_label: 'Lead',
        required_stacks: ['Django', 'React'],
        assigned_members: [{ id: 7, email: 'membro@test.com' }],
        estimated_hours: 120,
        budget: '10000.00',
        house_fee: '1000.00',
        deadline: '2026-06-01',
        documents_count: 1,
        history_count: 2,
      },
    ] as any);
    mockedProjectsAPI.documents.mockResolvedValueOnce([
      {
        id: 9,
        project_id: 1,
        project_name: 'Portal SH',
        title: 'Escopo',
        description: 'Documento base',
        file: 'escopo.pdf',
        file_name: 'escopo.pdf',
        file_url: '/media/escopo.pdf',
        visibility: 'assigned',
        uploaded_by_email: 'admin@test.com',
      },
    ] as any);
    mockedProjectsAPI.history.mockResolvedValueOnce([
      {
        id: 10,
        project: 1,
        project_name: 'Portal SH',
        action: 'document',
        title: 'Documento adicionado',
        description: 'Arquivo enviado para o projeto',
        created_by_email: 'admin@test.com',
        created_at: '2026-04-21T10:00:00Z',
      },
    ] as any);

    render(<ProjectsPage />);

    fireEvent.click(await screen.findByRole('button', { name: 'Documentação' }));

    expect(await screen.findByText('Documentação (1)')).toBeInTheDocument();
    expect(screen.getByText('Histórico (1)')).toBeInTheDocument();
    expect(await screen.findByText('Escopo')).toBeInTheDocument();
    expect(screen.getByText('Documento base')).toBeInTheDocument();
  });
});