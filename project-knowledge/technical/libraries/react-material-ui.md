# Material UI v5 + React TypeScript

## Versão: @mui/material ^5.14.0

## Por que usamos:
- Componentes prontos e acessíveis
- TypeScript nativo
- Tema customizável
- Ecossistema completo (icons, lab, x-date-pickers)

## Setup Básico (PADRÃO DO PROJETO):

### 1. Instalação:
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/lab
npm install @mui/x-date-pickers  # Para datas
npm install dayjs                # Manipulação de datas
```

### 2. Theme Setup (SEMPRE usar este padrão):
```typescript
// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',      // Azul padrão SH
    },
    secondary: {
      main: '#dc004e',      // Vermelho para ações importantes
    },
    background: {
      default: '#f5f5f5',   // Cinza claro
      paper: '#ffffff',
    },
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  
  components: {
    // Override padrão para Button
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',  // Sem caps lock
          borderRadius: 8,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    
    // Override para TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            fontSize: '0.9rem',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
```

### 3. Provider Setup:
```typescript
// src/theme/ThemeProvider.tsx
import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline, responsiveFontSizes } from '@mui/material';
import { theme } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const responsiveTheme = responsiveFontSizes(theme);
  
  return (
    <MuiThemeProvider theme={responsiveTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
```

### 4. Componentes Customizados (REUTILIZAR SEMPRE):

#### BaseButton.tsx:
```typescript
// src/components/common/BaseButton.tsx
import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface BaseButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined';
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'secondary':
        return { color: 'secondary' as const };
      case 'danger':
        return { color: 'error' as const };
      case 'outlined':
        return { variant: 'outlined' as const };
      default:
        return { variant: 'contained' as const };
    }
  };

  return (
    <Button {...getVariant()} {...props}>
      {children}
    </Button>
  );
};
```

#### BaseInput.tsx:
```typescript
// src/components/common/BaseInput.tsx
import React from 'react';
import { TextField, TextFieldProps, useTheme } from '@mui/material';

interface BaseInputProps extends TextFieldProps {
  label: string;
  error?: boolean;
  helperText?: string;
}

export const BaseInput: React.FC<BaseInputProps> = ({
  label,
  error = false,
  helperText,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      error={error}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
      }}
      {...props}
    />
  );
};
```

#### LoadingSpinner.tsx:
```typescript
// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  size = 40,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};
```

## Formulários (SEMPR

E usar este padrão):

```typescript
// src/components/forms/LoginForm.tsx
import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { BaseInput } from '../common/BaseInput';
import { BaseButton } from '../common/BaseButton';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fazendo login..." />;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', maxWidth: 400 }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <BaseInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error && !email}
        />

        <BaseInput
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error && !password}
        />

        <BaseButton type="submit" fullWidth>
          Entrar
        </BaseButton>
      </Box>
    </Box>
  );
};
```

## Layouts (SEMPRE usar este padrão):

```typescript
// src/components/common/Layout.tsx
import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Plataforma SH',
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box component="footer" py={2} textAlign="center" bgcolor="grey.100">
        <Typography variant="body2" color="text.secondary">
          © 2026 Software House
        </Typography>
      </Box>
    </Box>
  );
};
```

## Datatables com Material UI:

```typescript
// src/components/common/DataTable.tsx
import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
} from '@mui/material';

interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  loading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  title,
  loading,
}: DataTableProps<T>) {
  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={String(column.id)}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.id)}>
                    {column.render
                      ? column.render(row[column.id])
                      : String(row[column.id] || '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
```

## Tests (Jest + Testing Library):

```typescript
// src/components/common/__tests__/BaseButton.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseButton } from '../BaseButton';

describe('BaseButton', () => {
  it('renders with default primary variant', () => {
    render(<BaseButton>Test Button</BaseButton>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    render(
      <BaseButton variant="danger">
        Danger Button
      </BaseButton>
    );
    const button = screen.getByRole('button', { name: /danger button/i });
    expect(button).toHaveClass('MuiButton-root');
  });
});
```

## Não Fazer ❌:

- ❌ Não usar style overrides globais sem necessidade
- ❌ Não esquecer de passar props no spread operator
- ❌ Não criar componentes redundantes sem necessidade
- ❌ Não usar inline styles quando theme pode ser usado
- ❌ Não esquecer de tipar props com TypeScript

## Fazer Sempre ✅:

- ✅ Criar componentes base reutilizáveis
- ✅ Usar theme customizado para cores/fontes
- ✅ Implementar loading states
- ✅ Testar componentes customizados
- ✅ Usar responsividade com breakpoints

## Performance Tips:

```typescript
// Lazy loading de componentes pesados
import { lazy } from 'react';
const HeavyChart = lazy(() => import('./HeavyChart'));

// useMemo para cálculos pesados
const memoizedData = useMemo(() => processLargeData(rawData), [rawData]);

// useCallback para handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

---

**Link Oficial**: https://mui.com/
**Storybook**: https://storybook.mui.com/
**Material Icons**: https://mui.com/components/icons/