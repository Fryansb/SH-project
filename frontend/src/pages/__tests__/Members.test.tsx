import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MembersPage from '../Members';
import membersAPI from '../../services/members';

jest.mock('../../services/members');

const mockedMembersAPI = membersAPI as jest.Mocked<typeof membersAPI>;

describe('MembersPage', () => {
  it('renders a list of members from the API', async () => {
    mockedMembersAPI.list.mockResolvedValue([
      { id: 1, user_email: 'alice@example.com', available_hours: 40, rating: 4.5 },
      { id: 2, user_email: 'bob@example.com', available_hours: 20, rating: 3.2 },
    ] as any);

    const { Provider } = require('react-redux');
    const store = require('../../store').default;
    render(<Provider store={store}><MembersPage /></Provider>);

    expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
    const availableItems = await screen.findAllByText(/Available:/i);
    expect(availableItems.length).toBeGreaterThan(0);
  });
});
