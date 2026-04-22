import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProjectDetailsDialog from '../ProjectDetailsDialog';

jest.mock('../../../services/auth', () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
  },
}));
jest.mock('../../../services/projects', () => ({
  __esModule: true,
  default: {
    documents: jest.fn(),
    history: jest.fn(),
    uploadDocument: jest.fn(),
  },
}));

import authAPI from '../../../services/auth';
import projectsAPI from '../../../services/projects';

const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedProjectsAPI = projectsAPI as jest.Mocked<typeof projectsAPI>;

describe('ProjectDetailsDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
  });

  it('shows documents and history and allows uploading documentation', async () => {
    mockedProjectsAPI.documents
      .mockResolvedValueOnce([
        {
          id: 9,
          project_id: 1,
          project_name: 'Portal SH',
          title: 'Escopo inicial',
          description: 'Documento base',
          file: 'escopo.pdf',
          file_name: 'escopo.pdf',
          file_url: '/media/escopo.pdf',
          visibility: 'assigned',
          uploaded_by_email: 'admin@test.com',
          created_at: '2026-04-21T10:00:00Z',
        },
      ] as any)
      .mockResolvedValueOnce([
        {
          id: 9,
          project_id: 1,
          project_name: 'Portal SH',
          title: 'Escopo inicial',
          description: 'Documento base',
          file: 'escopo.pdf',
          file_name: 'escopo.pdf',
          file_url: '/media/escopo.pdf',
          visibility: 'assigned',
          uploaded_by_email: 'admin@test.com',
          created_at: '2026-04-21T10:00:00Z',
        },
        {
          id: 10,
          project_id: 1,
          project_name: 'Portal SH',
          title: 'Novo escopo',
          description: 'Arquivo recém-anexado',
          file: 'novo-escopo.pdf',
          file_name: 'novo-escopo.pdf',
          file_url: '/media/novo-escopo.pdf',
          visibility: 'assigned',
          uploaded_by_email: 'admin@test.com',
          created_at: '2026-04-22T10:00:00Z',
        },
      ] as any);
    mockedProjectsAPI.history
      .mockResolvedValueOnce([
        {
          id: 20,
          project: 1,
          project_name: 'Portal SH',
          action: 'document',
          title: 'Documento adicionado',
          description: 'Arquivo enviado para o projeto',
          created_by_email: 'admin@test.com',
          created_at: '2026-04-21T10:00:00Z',
        },
      ] as any)
      .mockResolvedValueOnce([
        {
          id: 20,
          project: 1,
          project_name: 'Portal SH',
          action: 'document',
          title: 'Documento adicionado',
          description: 'Arquivo enviado para o projeto',
          created_by_email: 'admin@test.com',
          created_at: '2026-04-21T10:00:00Z',
        },
        {
          id: 21,
          project: 1,
          project_name: 'Portal SH',
          action: 'note',
          title: 'Nova nota',
          description: 'Atualização adicional',
          created_by_email: 'admin@test.com',
          created_at: '2026-04-22T10:00:00Z',
        },
      ] as any);
    mockedProjectsAPI.uploadDocument.mockResolvedValue({} as any);

    render(
      <ProjectDetailsDialog
        open
        onClose={jest.fn()}
        project={{
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
          assigned_members: [],
        } as any}
      />,
    );

    expect(await screen.findByText('Escopo inicial')).toBeInTheDocument();
    expect(screen.getByText('Documento base')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Histórico (1)' }));
    expect(await screen.findByText('Documento adicionado')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Documentação (1)' }));

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Novo escopo' } });
    fireEvent.change(screen.getByLabelText('Descrição'), { target: { value: 'Arquivo recém-anexado' } });

    const fileInput = screen.getByLabelText('Arquivo');
    const file = new File(['conteúdo'], 'novo-escopo.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: 'Enviar documento' }));

    await waitFor(() => {
      expect(mockedProjectsAPI.uploadDocument).toHaveBeenCalledTimes(1);
      expect(mockedProjectsAPI.documents).toHaveBeenCalledTimes(2);
      expect(mockedProjectsAPI.history).toHaveBeenCalledTimes(2);
    });

    const formData = mockedProjectsAPI.uploadDocument.mock.calls[0][0] as FormData;
    expect(formData.get('project_id')).toBe('1');
    expect(formData.get('title')).toBe('Novo escopo');
    expect(formData.get('description')).toBe('Arquivo recém-anexado');
    expect(formData.get('visibility')).toBe('assigned');
    expect((formData.get('file') as File).name).toBe('novo-escopo.pdf');
    expect(await screen.findByText('Novo escopo')).toBeInTheDocument();
  });
});