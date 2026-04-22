import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MembersPage from '../Members';
import membersAPI from '../../services/members';
import authAPI from '../../services/auth';
import stacksAPI from '../../services/stacks';

jest.mock('../../services/members');
jest.mock('../../services/auth');
jest.mock('../../services/stacks');

const mockedMembersAPI = membersAPI as jest.Mocked<typeof membersAPI>;
const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedStacksAPI = stacksAPI as jest.Mocked<typeof stacksAPI>;

describe('MembersPage admin CRUD', () => {
  beforeEach(() => {
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
    mockedStacksAPI.list.mockResolvedValue([
      { id: 1, name: 'Django' },
      { id: 2, name: 'React' },
    ] as any);
  });

  it('shows add button for admin and calls create', async () => {
    mockedMembersAPI.list.mockResolvedValue([{ id: 1, user_email: 'a@a.com', available_hours: 40, rating: 4.0, stacks: ['Django'] }] as any);
    mockedMembersAPI.create.mockResolvedValue({ id: 2, user_email: 'b@b.com', available_hours: 40, rating: 3.0, stacks: ['Django'] } as any);

    const { Provider } = require('react-redux');
    const store = require('../../store').default;
    render(<Provider store={store}><MembersPage /></Provider>);

    // wait initial list
    expect(await screen.findByText('a@a.com')).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /Adicionar Membro/i });
    fireEvent.click(addButton);

    const emailInput = screen.getByLabelText(/Email/i);
    const weeklyInput = screen.getByLabelText(/Horas Semanais/i);

    fireEvent.change(emailInput, { target: { value: 'b@b.com' } });
    fireEvent.change(screen.getByLabelText(/GitHub/i), { target: { value: 'https://github.com/bb' } });
    fireEvent.change(screen.getByLabelText(/Discord/i), { target: { value: 'bb#1234' } });
    fireEvent.change(weeklyInput, { target: { value: '40' } });

    const djangoCheckbox = await screen.findByRole('checkbox', { name: 'Django' });
    fireEvent.click(djangoCheckbox);

    const saveButton = screen.getByRole('button', { name: /Salvar/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockedMembersAPI.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'b@b.com',
      github_url: 'https://github.com/bb',
      discord_id: 'bb#1234',
      weekly_hours: 40,
      stack_ids: [1],
    })));
  });
});
