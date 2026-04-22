import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../Login';
import authAPI from '../../services/auth';

jest.mock('../../services/auth', () => ({
  __esModule: true,
  default: {
    getAccess: jest.fn(),
    getUser: jest.fn(),
  },
}));
jest.mock('../../components/auth/LoginForm', () => ({
  __esModule: true,
  default: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button type="button" onClick={() => onSuccess?.()}>
      Mock login
    </button>
  ),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;
const mockedUseNavigate = useNavigate as jest.Mock;
const mockedUseDispatch = useDispatch as jest.Mock;

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(jest.fn());
    mockedUseDispatch.mockReturnValue(jest.fn());
    mockedAuthAPI.getAccess.mockReturnValue(null);
    mockedAuthAPI.getUser.mockReturnValue({ id: 1, email: 'admin@test.com', role: 'admin' } as any);
  });

  it('redirects when there is already an access token', async () => {
    mockedAuthAPI.getAccess.mockReturnValue('token');

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockedUseNavigate.mock.results[0].value).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('stores the user and navigates after a successful login', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mock login' }));

    await waitFor(() => {
      expect(mockedUseDispatch.mock.results[0].value).toHaveBeenCalledWith({
        type: 'auth/setUser',
        payload: { id: 1, email: 'admin@test.com', role: 'admin' },
      });
      expect(mockedUseNavigate.mock.results[0].value).toHaveBeenCalledWith('/dashboard');
    });
  });
});