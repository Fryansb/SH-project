import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import PageShell from '../components/common/PageShell';
import reportsAPI from '../services/reports';
import { FinancialReport, HoursReport, PerformanceReport, Project } from '../types';

type ReportsData = {
  performance: PerformanceReport;
  financial: FinancialReport;
  hours: HoursReport;
};

type FinancialStatusFilter = 'all' | Project['status'];
type HoursWindowFilter = 'all' | '7' | '30' | '90';

const STATUS_LABELS: Array<{ value: FinancialStatusFilter; label: string }> = [
  { value: 'all', label: 'Todos os status' },
  { value: 'lead', label: 'Lead' },
  { value: 'briefing', label: 'Briefing' },
  { value: 'contract', label: 'Contrato' },
  { value: 'development', label: 'Desenvolvimento' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'support', label: 'Suporte' },
];

const HOURS_WINDOW_LABELS: Array<{ value: HoursWindowFilter; label: string }> = [
  { value: 'all', label: 'Todo o período' },
  { value: '7', label: '7 dias' },
  { value: '30', label: '30 dias' },
  { value: '90', label: '90 dias' },
];

const chartColors = ['#1976d2', '#2e7d32', '#ed6c02', '#0288d1', '#d32f2f', '#00695c'];

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

const formatNumber = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Sem registro';
  }

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('pt-BR');
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return 'Sem atualização';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('pt-BR');
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const matchesText = (value: string, query: string) => normalizeText(value).includes(normalizeText(query));

const parseNumberFilter = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const shortLabel = (value: string, maxLength = 16) => {
  const normalized = value.includes('@') ? value.split('@')[0] : value;
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const FilterChip: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <Chip
    clickable
    onClick={onClick}
    label={label}
    size="small"
    color={selected ? 'primary' : undefined}
    variant={selected ? 'filled' : 'outlined'}
    sx={selected ? { fontWeight: 600 } : undefined}
  />
);

const ChartCard: React.FC<{
  title: string;
  description: string;
  hasData: boolean;
  emptyMessage: string;
  children: ReactNode;
}> = ({ title, description, hasData, emptyMessage, children }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: '100%', minWidth: 0 }}>
    <CardContent>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 280, minWidth: 0 }}>
          {hasData ? (
            children
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const SectionCard: React.FC<{
  title: string;
  description: string;
  testId: string;
  children: ReactNode;
}> = ({ title, description, testId, children }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minWidth: 0 }} data-testid={testId}>
    <CardContent>
      <Stack spacing={2}>{/* keep the section structure tight */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
        </Box>
        {children}
      </Stack>
    </CardContent>
  </Card>
);

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceSearch, setPerformanceSearch] = useState('');
  const [performanceMinScore, setPerformanceMinScore] = useState('');
  const [performanceMinProjects, setPerformanceMinProjects] = useState('');
  const [performanceStack, setPerformanceStack] = useState('all');
  const [financialSearch, setFinancialSearch] = useState('');
  const [financialStatus, setFinancialStatus] = useState<FinancialStatusFilter>('all');
  const [hoursSearch, setHoursSearch] = useState('');
  const [hoursWindow, setHoursWindow] = useState<HoursWindowFilter>('all');

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

  const performance = reports?.performance;
  const financial = reports?.financial;
  const hours = reports?.hours;

  const generatedAt = performance?.generated_at ?? financial?.generated_at ?? hours?.generated_at;

  const performanceStackOptions = useMemo(() => {
    if (!performance) {
      return [];
    }

    const stacks = new Set<string>();
    performance.members.forEach((member) => {
      member.stacks.forEach((stack) => stacks.add(stack));
    });

    return Array.from(stacks).sort((left, right) => left.localeCompare(right, 'pt-BR'));
  }, [performance]);

  const filteredPerformanceMembers = useMemo(() => {
    if (!performance) {
      return [];
    }

    const minScore = parseNumberFilter(performanceMinScore);
    const minProjects = parseNumberFilter(performanceMinProjects);

    return performance.members.filter((member) => {
      if (performanceSearch && !matchesText(`${member.name} ${member.email}`, performanceSearch)) {
        return false;
      }

      if (minScore !== null && member.priority_score < minScore) {
        return false;
      }

      if (minProjects !== null && member.project_count < minProjects) {
        return false;
      }

      if (performanceStack !== 'all' && !member.stacks.some((stack) => matchesText(stack, performanceStack))) {
        return false;
      }

      return true;
    });
  }, [performance, performanceMinProjects, performanceMinScore, performanceSearch, performanceStack]);

  const performanceMemberChartData = useMemo(
    () =>
      [...filteredPerformanceMembers]
        .slice(0, 6)
        .map((member) => ({
          name: shortLabel(member.name),
          score: member.priority_score,
        })),
    [filteredPerformanceMembers],
  );

  const performanceStackChartData = useMemo(() => {
    const stackTotals = new Map<string, number>();
    filteredPerformanceMembers.forEach((member) => {
      member.stacks.forEach((stack) => {
        stackTotals.set(stack, (stackTotals.get(stack) ?? 0) + 1);
      });
    });

    return Array.from(stackTotals.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([name, total]) => ({ name, total }));
  }, [filteredPerformanceMembers]);

  const performanceVisibleSummary = useMemo(() => {
    const memberCount = filteredPerformanceMembers.length;
    const totalHours = sum(filteredPerformanceMembers.map((member) => member.total_hours));
    const averageScore = memberCount ? sum(filteredPerformanceMembers.map((member) => member.priority_score)) / memberCount : 0;
    const averageRating = memberCount ? sum(filteredPerformanceMembers.map((member) => member.rating)) / memberCount : 0;
    const uniqueStacks = new Set(filteredPerformanceMembers.flatMap((member) => member.stacks)).size;

    return {
      memberCount,
      totalHours,
      averageScore,
      averageRating,
      uniqueStacks,
    };
  }, [filteredPerformanceMembers]);

  const filteredFinancialProjects = useMemo(() => {
    if (!financial) {
      return [];
    }

    return financial.projects.filter((project) => {
      if (financialSearch && !matchesText(`${project.name} ${project.client_name} ${project.status_label}`, financialSearch)) {
        return false;
      }

      if (financialStatus !== 'all' && project.status !== financialStatus) {
        return false;
      }

      return true;
    });
  }, [financial, financialSearch, financialStatus]);

  const financialProjectChartData = useMemo(
    () =>
      [...filteredFinancialProjects]
        .slice(0, 6)
        .map((project) => ({
          name: shortLabel(project.name),
          budget: Number(project.budget),
          remaining: Number(project.remaining_budget),
          houseFee: Number(project.house_fee),
        })),
    [filteredFinancialProjects],
  );

  const financialStatusChartData = useMemo(() => {
    const statusTotals = new Map<string, number>();
    filteredFinancialProjects.forEach((project) => {
      statusTotals.set(project.status_label, (statusTotals.get(project.status_label) ?? 0) + 1);
    });

    return Array.from(statusTotals.entries())
      .sort((left, right) => right[1] - left[1])
      .map(([name, total]) => ({ name, total }));
  }, [filteredFinancialProjects]);

  const financialVisibleSummary = useMemo(() => {
    const projectCount = filteredFinancialProjects.length;
    const totalBudget = sum(filteredFinancialProjects.map((project) => Number(project.budget)));
    const totalHouseFee = sum(filteredFinancialProjects.map((project) => Number(project.house_fee)));
    const totalRemaining = sum(filteredFinancialProjects.map((project) => Number(project.remaining_budget)));

    return {
      projectCount,
      totalBudget,
      totalHouseFee,
      totalRemaining,
    };
  }, [filteredFinancialProjects]);

  const filteredHoursMembers = useMemo(() => {
    if (!hours) {
      return [];
    }

    return hours.members.filter((member) => {
      if (!hoursSearch) {
        return true;
      }

      return matchesText(`${member.name} ${member.email}`, hoursSearch);
    });
  }, [hours, hoursSearch]);

  const filteredHoursProjects = useMemo(() => {
    if (!hours) {
      return [];
    }

    return hours.projects.filter((project) => {
      if (!hoursSearch) {
        return true;
      }

      return matchesText(`${project.name} ${project.client_name}`, hoursSearch);
    });
  }, [hours, hoursSearch]);

  const filteredTimeline = useMemo(() => {
    if (!hours) {
      return [];
    }

    if (hoursWindow === 'all' || hours.timeline.length === 0) {
      return hours.timeline;
    }

    const days = Number(hoursWindow);
    const latestEntry = hours.timeline[hours.timeline.length - 1];
    const latestDate = new Date(`${latestEntry.date}T00:00:00`);
    const cutoff = new Date(latestDate);
    cutoff.setDate(cutoff.getDate() - days);

    return hours.timeline.filter((entry) => new Date(`${entry.date}T00:00:00`) >= cutoff);
  }, [hours, hoursWindow]);

  const hoursTimelineChartData = useMemo(
    () => filteredTimeline.map((entry) => ({ name: formatDate(entry.date), hours: entry.total_hours })),
    [filteredTimeline],
  );

  const hoursMemberChartData = useMemo(
    () =>
      [...filteredHoursMembers]
        .slice(0, 6)
        .map((member) => ({
          name: shortLabel(member.name),
          hours: member.total_hours,
        })),
    [filteredHoursMembers],
  );

  const hoursVisibleSummary = useMemo(() => {
    const entryCount = filteredTimeline.reduce((total, entry) => total + entry.entry_count, 0);
    const totalHours = sum(filteredTimeline.map((entry) => entry.total_hours));

    return {
      entryCount,
      totalHours,
      memberCount: filteredHoursMembers.length,
      projectCount: filteredHoursProjects.length,
    };
  }, [filteredHoursMembers.length, filteredHoursProjects.length, filteredTimeline]);

  const renderMetricChips = (labels: string[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {labels.map((label) => (
        <Chip key={label} label={label} variant="outlined" color="primary" />
      ))}
    </Box>
  );

  return (
    <PageShell
      title="Relatórios"
      description="Painel reservado aos admins para acompanhar performance, financeiro e horas com filtros e gráficos interativos."
    >
      <Stack spacing={3}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(0, 105, 92, 0.08))',
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Chip label="Admin only" color="secondary" variant="outlined" sx={{ mb: 1 }} />
                  <Typography variant="h5" gutterBottom>
                    Visão analítica dos relatórios
                  </Typography>
                  <Typography color="text.secondary">
                    Use os filtros para comparar membros, acompanhar o orçamento e enxergar a distribuição das horas.
                  </Typography>
                </Box>

                <Chip label={formatDateTime(generatedAt)} variant="outlined" />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <DashboardMetricCard
                  label="Membros"
                  value={String(performance?.summary.member_count ?? 0)}
                  helperText="Base disponível para análise"
                />
                <DashboardMetricCard
                  label="Projetos"
                  value={String(financial?.summary.project_count ?? 0)}
                  helperText="Carteira consolidada"
                />
                <DashboardMetricCard
                  label="Horas totais"
                  value={String(hours?.summary.total_hours ?? 0)}
                  helperText="Registro acumulado na operação"
                />
                <DashboardMetricCard
                  label="Prioridade média"
                  value={formatNumber(performance?.summary.average_priority_score ?? 0)}
                  helperText="Score médio atual da fila"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {loading ? <Typography color="text.secondary">Carregando relatórios...</Typography> : null}

        {performance ? (
          <SectionCard
            testId="reports-performance"
            title="Desempenho"
            description="Filtre membros por score, projetos e stack para entender quem está mais pronto para assumir novas demandas."
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                <TextField label="Buscar membro" value={performanceSearch} onChange={(event) => setPerformanceSearch(event.target.value)} fullWidth />
                <TextField label="Score mínimo" type="number" value={performanceMinScore} onChange={(event) => setPerformanceMinScore(event.target.value)} fullWidth />
                <TextField
                  label="Projetos mínimos"
                  type="number"
                  value={performanceMinProjects}
                  onChange={(event) => setPerformanceMinProjects(event.target.value)}
                  fullWidth
                />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <FilterChip label="Todas as stacks" selected={performanceStack === 'all'} onClick={() => setPerformanceStack('all')} />
                {performanceStackOptions.map((stack) => (
                  <FilterChip key={stack} label={stack} selected={performanceStack === stack} onClick={() => setPerformanceStack(stack)} />
                ))}
              </Box>

              {renderMetricChips([
                `Exibindo ${performanceVisibleSummary.memberCount}/${performance.summary.member_count} membros`,
                `Score médio ${formatNumber(performanceVisibleSummary.averageScore)}`,
                `Horas apontadas ${formatNumber(performanceVisibleSummary.totalHours)}`,
                `Rating médio ${formatNumber(performanceVisibleSummary.averageRating)}`,
                `Stacks únicas ${performanceVisibleSummary.uniqueStacks}`,
              ])}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                <ChartCard
                  title="Score por membro"
                  description="Os melhores colocados da fila com o filtro atual."
                  hasData={performanceMemberChartData.length > 0}
                  emptyMessage="Nenhum membro encontrado para os filtros de desempenho."
                >
                  <ResponsiveContainer>
                    <BarChart data={performanceMemberChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                      <YAxis allowDecimals />
                      <Tooltip />
                      <Bar dataKey="score" fill={chartColors[0]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Stacks predominantes"
                  description="Distribuição das stacks entre os membros filtrados."
                  hasData={performanceStackChartData.length > 0}
                  emptyMessage="Nenhuma stack compatível com os filtros atuais."
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={performanceStackChartData} dataKey="total" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={4}>
                        {performanceStackChartData.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>

              <Box sx={{ maxHeight: 320, overflow: 'auto', pr: 1 }}>
                {filteredPerformanceMembers.length === 0 ? (
                  <Typography color="text.secondary">Nenhum membro disponível com os filtros atuais.</Typography>
                ) : (
                  <List dense disablePadding>
                    {filteredPerformanceMembers.map((member) => (
                      <ListItem key={member.member_id} disableGutters sx={{ py: 1.25, alignItems: 'flex-start' }}>
                        <ListItemText
                          primary={`${member.name} • Score ${formatNumber(member.priority_score)}`}
                          secondary={`${formatNumber(member.total_hours)}h apontadas • ${member.project_count} projetos • ${member.stacks.join(', ') || 'Sem stack'} • ${formatDate(member.last_project_date)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Stack>
          </SectionCard>
        ) : null}

        {financial ? (
          <SectionCard
            testId="reports-financial"
            title="Financeiro"
            description="Filtre por status e projeto para entender a distribuição do orçamento e a participação de cada iniciativa."
          >
            <Stack spacing={2}>
              <TextField
                label="Buscar projeto ou cliente"
                value={financialSearch}
                onChange={(event) => setFinancialSearch(event.target.value)}
                fullWidth
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {STATUS_LABELS.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    selected={financialStatus === option.value}
                    onClick={() => setFinancialStatus(option.value)}
                  />
                ))}
              </Box>

              {renderMetricChips([
                `Exibindo ${financialVisibleSummary.projectCount}/${financial.summary.project_count} projetos`,
                `Budget ${formatCurrency(String(financialVisibleSummary.totalBudget.toFixed(2)))}`,
                `House fee ${formatCurrency(String(financialVisibleSummary.totalHouseFee.toFixed(2)))}`,
                `Saldo ${formatCurrency(String(financialVisibleSummary.totalRemaining.toFixed(2)))}`,
              ])}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                <ChartCard
                  title="Orçamento por projeto"
                  description="Comparativo entre budget, house fee e saldo disponível para os projetos filtrados."
                  hasData={financialProjectChartData.length > 0}
                  emptyMessage="Nenhum projeto encontrado para os filtros financeiros."
                >
                  <ResponsiveContainer>
                    <BarChart data={financialProjectChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                      <YAxis tickFormatter={(value) => formatNumber(Number(value))} />
                      <Tooltip formatter={(value) => formatCurrency(String(value as number))} />
                      <Legend />
                      <Bar dataKey="budget" fill={chartColors[0]} radius={[8, 8, 0, 0]} />
                      <Bar dataKey="remaining" fill={chartColors[1]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Status dos projetos"
                  description="Distribuição dos projetos visíveis por fase atual."
                  hasData={financialStatusChartData.length > 0}
                  emptyMessage="Nenhum status encontrado para os filtros atuais."
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={financialStatusChartData} dataKey="total" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={4}>
                        {financialStatusChartData.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>

              <Box sx={{ maxHeight: 320, overflow: 'auto', pr: 1 }}>
                {filteredFinancialProjects.length === 0 ? (
                  <Typography color="text.secondary">Nenhum projeto disponível com os filtros atuais.</Typography>
                ) : (
                  <List dense disablePadding>
                    {filteredFinancialProjects.map((project) => (
                      <ListItem key={project.project_id} disableGutters sx={{ py: 1.25, alignItems: 'flex-start' }}>
                        <ListItemText
                          primary={`${project.name} • ${project.status_label}`}
                          secondary={`${project.client_name} • ${formatCurrency(project.budget)} • House ${formatCurrency(project.house_fee)} • Saldo ${formatCurrency(project.remaining_budget)} • Membros ${project.member_count}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Stack>
          </SectionCard>
        ) : null}

        {hours ? (
          <SectionCard
            testId="reports-hours"
            title="Horas"
            description="Analise a movimentação por período, os membros mais ativos e a carga por projeto."
          >
            <Stack spacing={2}>
              <TextField
                label="Buscar membro ou projeto"
                value={hoursSearch}
                onChange={(event) => setHoursSearch(event.target.value)}
                fullWidth
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {HOURS_WINDOW_LABELS.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    selected={hoursWindow === option.value}
                    onClick={() => setHoursWindow(option.value)}
                  />
                ))}
              </Box>

              {renderMetricChips([
                `Exibindo ${hoursVisibleSummary.entryCount}/${hours.summary.entry_count} lançamentos`,
                `Horas ${formatNumber(hoursVisibleSummary.totalHours)}`,
                `Membros ${hoursVisibleSummary.memberCount}`,
                `Projetos ${hoursVisibleSummary.projectCount}`,
              ])}

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                <ChartCard
                  title="Movimentação diária"
                  description="Linha do tempo das horas registradas no período filtrado."
                  hasData={hoursTimelineChartData.length > 0}
                  emptyMessage="Nenhuma atividade encontrada para o período selecionado."
                >
                  <ResponsiveContainer>
                    <LineChart data={hoursTimelineChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                      <YAxis allowDecimals />
                      <Tooltip />
                      <Line type="monotone" dataKey="hours" stroke={chartColors[0]} strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Top membros por horas"
                  description="Os membros com maior volume de horas no filtro atual."
                  hasData={hoursMemberChartData.length > 0}
                  emptyMessage="Nenhum membro encontrado para os filtros atuais."
                >
                  <ResponsiveContainer>
                    <BarChart data={hoursMemberChartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                      <YAxis allowDecimals />
                      <Tooltip />
                      <Bar dataKey="hours" fill={chartColors[2]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Membros
                    </Typography>
                    <Box sx={{ maxHeight: 280, overflow: 'auto', pr: 1 }}>
                      {filteredHoursMembers.length === 0 ? (
                        <Typography color="text.secondary">Nenhum membro disponível com os filtros atuais.</Typography>
                      ) : (
                        <List dense disablePadding>
                          {filteredHoursMembers.map((member) => (
                            <ListItem key={member.member_id} disableGutters sx={{ py: 1.25, alignItems: 'flex-start' }}>
                              <ListItemText
                                primary={`${member.name} • ${formatNumber(member.total_hours)}h`}
                                secondary={`${member.entry_count} lançamentos • disponíveis ${member.available_hours}/${member.weekly_hours} • último movimento ${formatDate(member.last_activity_date)}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Projetos
                    </Typography>
                    <Box sx={{ maxHeight: 280, overflow: 'auto', pr: 1 }}>
                      {filteredHoursProjects.length === 0 ? (
                        <Typography color="text.secondary">Nenhum projeto disponível com os filtros atuais.</Typography>
                      ) : (
                        <List dense disablePadding>
                          {filteredHoursProjects.map((project) => (
                            <ListItem key={project.project_id} disableGutters sx={{ py: 1.25, alignItems: 'flex-start' }}>
                              <ListItemText
                                primary={`${project.name} • ${formatNumber(project.total_hours)}h`}
                                secondary={`${project.client_name} • ${project.entry_count} lançamentos • ${project.member_count} membros • último movimento ${formatDate(project.latest_activity_date)}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </SectionCard>
        ) : null}
      </Stack>
    </PageShell>
  );
};

export default ReportsPage;