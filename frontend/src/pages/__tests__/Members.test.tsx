import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MembersPage from '../Members';
import membersAPI from '../../services/members';
import stacksAPI from '../../services/stacks';

jest.mock('../../services/members');
jest.mock('../../services/stacks');

const mockedMembersAPI = membersAPI as jest.Mocked<typeof membersAPI>;
const mockedStacksAPI = stacksAPI as jest.Mocked<typeof stacksAPI>;

describe('MembersPage', () => {
  it('renders a list of members from the API', async () => {
    mockedMembersAPI.list.mockResolvedValue([
      { id: 1, user_email: 'alice@example.com', available_hours: 40, rating: 4.5, stacks: ['Django'] },
      { id: 2, user_email: 'bob@example.com', available_hours: 20, rating: 3.2, stacks: [] },
    ] as any);
    mockedStacksAPI.list.mockResolvedValue([{ id: 1, name: 'Django' }] as any);

    const { Provider } = require('react-redux');
    const store = require('../../store').default;
    render(<Provider store={store}><MembersPage /></Provider>);

    expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
    expect(await screen.findByText('Django')).toBeInTheDocument();
    const availableItems = await screen.findAllByText(/Available:/i);
    expect(availableItems.length).toBeGreaterThan(0);
  });
});
