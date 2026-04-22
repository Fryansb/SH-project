import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface PageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ title, description, children }) => {
  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {description ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
};

export default PageShell;