import React from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';

interface DashboardMetricCardProps {
  label: string;
  value: string;
  helperText?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ label, value, helperText }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {helperText ? (
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;