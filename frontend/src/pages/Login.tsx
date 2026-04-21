import React from 'react';
import { Container, Box } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = () => {
    // read user from storage and set in store
    try {
      // import here to avoid cycles
      const authAPI = require('../services/auth').default;
      const user = authAPI.getUser();
      dispatch(setUser(user));
    } catch (e) {
      // ignore
    }
    navigate('/members');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <LoginForm onSuccess={handleSuccess} />
      </Box>
    </Container>
  );
};

export default LoginPage;
