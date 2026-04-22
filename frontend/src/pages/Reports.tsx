import React, { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import PageShell from '../components/common/PageShell';
import reportsAPI from '../services/reports';
import { FinancialReport, HoursReport, PerformanceReport } from '../types';

type ReportsData = {
  performance: PerformanceReport;
  financial: FinancialReport;
  hours: HoursReport;
};

const formatCurrency = (value: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(parsed);
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Sem registro';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('pt-BR');
};

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        const [performance, financial, hours] = await Promise.all([
          reportsAPI.performance(),
          reportsAPI.financial(),
          reportsAPI.hours(),
        ]);

        if (active) {
          setReports({ performance, financial, hours });
          setError(null);
        }
      } catch {
        if (active) {
          setReports(null);
          setError('Não foi possível carregar os relatórios.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      active = false;
    };
  }, []);

  const renderMetricChips = (labels: string[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {labels.map((label) => (
        <Chip key={label} label={label} variant="outlined" color="primary" />
      ))}
    </Box>
  );

  const performance = reports?.performance;
  const financial = reports?.financial;
  const hours = reports?.hours;

  return (
    <PageShell
      title="Relatórios"
      description="Painel reservado aos admins para acompanhar performance, financeiro e horas."
    >
      <Stack spacing={3}>
        <Chip label="Admin only" color="secondary" variant="outlined" sx={{ width: 'fit-content' }} />

        {error ? <Alert severity="error">{error}</Alert> : null}

        {loading ? <Typography color="text.secondary">Carregando relatórios...</Typography> : null}

        {performance ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Desempenho
              </Typography>
              {renderMetricChips([
                `Membros ${performance.summary.member_count}`,
                `Projetos ${performance.summary.project_count}`,
                `Horas ${performance.summary.total_hours}`,
                `Prioridade média ${performance.summary.average_priority_score}`,
                `Rating médio ${performance.summary.average_rating}`,
              ])}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Membros em destaque
                </Typography>
                <List dense disablePadding>
                  {performance.members.map((member) => (
                    <ListItem key={member.member_id} disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${member.name} • Score ${member.priority_score}`}
                        secondary={`${member.total_hours}h apontadas • ${member.project_count} projetos • ${formatDate(member.last_project_date)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        ) : null}

        {financial ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financeiro
              </Typography>
              {renderMetricChips([
                `Budget total ${formatCurrency(financial.summary.total_budget)}`,
                `House fee ${formatCurrency(financial.summary.total_house_fee)}`,
                `Share ${formatCurrency(financial.summary.total_member_share)}`,
                `Projetos ${financial.summary.project_count}`,
              ])}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Projetos e divisão
                </Typography>
                <List dense disablePadding>
                  {financial.projects.map((project) => (
                    <ListItem key={project.project_id} disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${project.name} • ${project.status_label}`}
                        secondary={`${project.client_name} • ${formatCurrency(project.budget)} • House ${formatCurrency(project.house_fee)} • Membros ${project.member_count}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        ) : null}

        {hours ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Horas
              </Typography>
              {renderMetricChips([
                `Entradas ${hours.summary.entry_count}`,
                `Horas totais ${hours.summary.total_hours}`,
                `Membros ativos ${hours.summary.member_count}`,
                `Projetos ativos ${hours.summary.project_count}`,
              ])}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Por membro
                </Typography>
                <List dense disablePadding>
                  {hours.members.map((member) => (
                    <ListItem key={member.member_id} disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${member.name} • ${member.total_hours}h`}
                        secondary={`${member.entry_count} lançamentos • disponíveis ${member.available_hours}/${member.weekly_hours} • último movimento ${formatDate(member.last_activity_date)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Por projeto
                </Typography>
                <List dense disablePadding>
                  {hours.projects.map((project) => (
                    <ListItem key={project.project_id} disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${project.name} • ${project.total_hours}h`}
                        secondary={`${project.client_name} • ${project.entry_count} lançamentos • ${project.member_count} membros • último movimento ${formatDate(project.latest_activity_date)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Linha do tempo
                </Typography>
                <List dense disablePadding>
                  {hours.timeline.map((entry) => (
                    <ListItem key={entry.date} disableGutters sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${formatDate(entry.date)} • ${entry.total_hours}h`}
                        secondary={`${entry.entry_count} lançamentos no dia`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        ) : null}
      </Stack>
    </PageShell>
  );
};

export default ReportsPage;