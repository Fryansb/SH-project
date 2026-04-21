import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import BaseInput from '../common/BaseInput';
import BaseButton from '../common/BaseButton';
import authAPI from '../../services/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authAPI.login(email, password);
      if (onSuccess) {
        onSuccess();
      }
      // Default navigation removed for testability. Caller should handle navigation in onSuccess.
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 420 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <BaseInput label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
        <BaseInput label="Senha" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        <BaseButton type="submit" fullWidth disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</BaseButton>
      </Box>
    </Box>
  );
};

export default LoginForm;
