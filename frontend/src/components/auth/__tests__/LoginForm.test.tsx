import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../auth/LoginForm';
import authAPI from '../../../services/auth';

jest.mock('../../../services/auth');

describe('LoginForm', () => {
  beforeEach(() => jest.resetAllMocks());

  test('calls login on submit with credentials', async () => {
    (authAPI.login as jest.Mock).mockResolvedValue({});
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'pass' } });

    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('a@b.com', 'pass');
    });
  });

  test('shows validation error when fields empty', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
    expect(await screen.findByText(/Preencha todos os campos/i)).toBeInTheDocument();
  });

  test('shows error when login fails', async () => {
    (authAPI.login as jest.Mock).mockRejectedValue(new Error('fail'));
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(await screen.findByText(/Email ou senha inválidos/i)).toBeInTheDocument();
  });
});
