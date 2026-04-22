import React, { useMemo } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Project } from '../../types';

interface DashboardChartsProps {
  projects: Project[];
}

const statusLabels: Record<Project['status'], string> = {
  lead: 'Lead',
  briefing: 'Briefing',
  contract: 'Contrato',
  development: 'Desenvolvimento',
  delivered: 'Entregue',
  support: 'Suporte',
};

const statusPalette = ['#1f77b4', '#2ca02c', '#ff7f0e', '#9467bd', '#d62728', '#17becf'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ projects }) => {
  const statusData = useMemo(() => {
    return Object.entries(statusLabels).map(([status, label]) => ({
      status,
      label,
      total: projects.filter((project) => project.status === status).length,
    }));
  }, [projects]);

  const lifecycleData = useMemo(() => {
    const active = projects.filter((project) => project.status !== 'delivered').length;
    const delivered = projects.filter((project) => project.status === 'delivered').length;
    const support = projects.filter((project) => project.status === 'support').length;

    return [
      { name: 'Ativos', value: active },
      { name: 'Entregues', value: delivered },
      { name: 'Suporte', value: support },
    ];
  }, [projects]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7}>
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Distribuição por status
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={statusData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={entry.status} fill={statusPalette[index % statusPalette.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ciclo atual
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={lifecycleData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={4}>
                    {lifecycleData.map((entry, index) => (
                      <Cell key={entry.name} fill={statusPalette[index % statusPalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;