import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Drawer, Toolbar, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import LoginPage from './pages/Login';
import MembersPage from './pages/Members';
import DashboardPage from './pages/Dashboard';
import ProjectsPage from './pages/Projects';
import HoursPage from './pages/Hours';
import PriorityPage from './pages/Priority';
import ReportsPage from './pages/Reports';
import { theme } from './theme/theme';
import { Provider } from 'react-redux';
import store from './store';
import authAPI from './services/auth';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projetos', to: '/projects' },
  { label: 'Horas', to: '/hours' },
  { label: 'Prioridade', to: '/priority' },
  { label: 'Membros', to: '/members', role: 'admin' },
  { label: 'Relatórios', to: '/reports', role: 'admin' },
];

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = Boolean(authAPI.getAccess());
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = Boolean(authAPI.getAccess());
  const user = authAPI.getUser();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(authAPI.getAccess());
  const user = authAPI.getUser();
  const isLoginRoute = location.pathname === '/login';

  const visibleNavItems = navItems.filter((item) => {
    if (item.role && item.role !== user?.role) {
      return false;
    }
    return true;
  });

  const routes = (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <ProjectsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/hours"
        element={
          <RequireAuth>
            <HoursPage />
          </RequireAuth>
        }
      />
      <Route
        path="/priority"
        element={
          <RequireAuth>
            <PriorityPage />
          </RequireAuth>
        }
      />
      <Route
        path="/members"
        element={
          <RequireAdmin>
            <MembersPage />
          </RequireAdmin>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireAdmin>
            <ReportsPage />
          </RequireAdmin>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );

  if (!isAuthenticated) {
    if (isLoginRoute) {
      return (
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', p: 2 }}>
          {routes}
        </Box>
      );
    }

    return <Navigate to="/login" replace />;
  }

  if (isLoginRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" component="div" noWrap>
            SH Dashboard
          </Typography>
        </Toolbar>
        <List>
          {visibleNavItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                '&.active': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        {routes}
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
