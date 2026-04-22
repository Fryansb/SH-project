import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import authAPI from '../services/auth';
import projectsAPI from '../services/projects';
import PageShell from '../components/common/PageShell';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import { Project } from '../types';

const DashboardPage: React.FC = () => {
  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        const data = await projectsAPI.list();
        if (active) {
          setProjects(data);
          setError(null);
        }
      } catch {
        if (active) {
          setProjects([]);
          setError('Não foi possível carregar o resumo dos projetos.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((left, right) => {
      const leftDate = left.created_at ? new Date(left.created_at).getTime() : 0;
      const rightDate = right.created_at ? new Date(right.created_at).getTime() : 0;
      return rightDate - leftDate;
    });
  }, [projects]);

  const activeProjects = projects.filter((project) => project.status !== 'delivered').length;
  const totalDocuments = projects.reduce((sum, project) => sum + (project.documents_count || 0), 0);
  const totalHistoryEntries = projects.reduce((sum, project) => sum + (project.history_count || 0), 0);
  const deliveredProjects = projects.filter((project) => project.status === 'delivered').length;
  const completionRate = projects.length ? Math.round((deliveredProjects / projects.length) * 100) : 0;

  const roleMessage = isAdmin
    ? 'Você acompanha a operação completa, com visão de membros, projetos e relatórios.'
    : 'Você vê sua operação atual, prioridades e os projetos atribuídos ao seu perfil.';

  return (
    <PageShell
      title="Dashboard"
      description={`Bem-vindo, ${user?.email || 'usuário'}. Aqui fica o resumo da operação.`}
    >
      <Stack spacing={3}>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Chip label={isAdmin ? 'Perfil admin' : 'Perfil member'} color="primary" variant="outlined" sx={{ mb: 1 }} />
                <Typography variant="h5" gutterBottom>
                  {isAdmin ? 'Visão operacional completa' : 'Seu espaço de trabalho'}
                </Typography>
                <Typography color="text.secondary">{roleMessage}</Typography>
              </Box>

              {error ? <Alert severity="warning">{error}</Alert> : null}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
                <DashboardMetricCard label="Projetos" value={String(projects.length)} helperText="Total visível no seu escopo" />
                <DashboardMetricCard label="Projetos ativos" value={String(activeProjects)} helperText="Lead, briefing, contrato, dev ou suporte" />
                <DashboardMetricCard label="Documentos" value={String(totalDocuments)} helperText="Arquivos vinculados aos projetos" />
                <DashboardMetricCard label="Histórico" value={String(totalHistoryEntries)} helperText={`${completionRate}% dos projetos já entregues`} />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <DashboardCharts projects={projects} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projetos recentes
              </Typography>
              {loading ? (
                <Typography color="text.secondary">Carregando projetos...</Typography>
              ) : sortedProjects.length === 0 ? (
                <Typography color="text.secondary">Nenhum projeto disponível no momento.</Typography>
              ) : (
                <Stack spacing={1.5}>
                  {sortedProjects.slice(0, 4).map((project) => (
                    <Card key={project.id} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                            <Box>
                              <Typography variant="subtitle1">{project.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {project.client_name} • {project.status_label || project.status}
                              </Typography>
                            </Box>
                            <Chip label={project.status_label || project.status} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {project.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip label={`${project.documents_count || 0} docs`} size="small" />
                            <Chip label={`${project.history_count || 0} eventos`} size="small" />
                            <Chip label={`${project.assigned_members?.length || 0} membros`} size="small" />
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acesso rápido personalizado
              </Typography>
              <Stack spacing={1.5}>
                <Typography color="text.secondary">
                  {isAdmin
                    ? 'Atalhos para acompanhar o todo da operação.'
                    : 'Atalhos focados na sua rotina atual.'}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button component={NavLink} to="/projects" variant="outlined">
                    Projetos
                  </Button>
                  <Button component={NavLink} to="/hours" variant="outlined">
                    Horas
                  </Button>
                  <Button component={NavLink} to="/priority" variant="outlined">
                    Prioridade
                  </Button>
                  {isAdmin ? (
                    <>
                      <Button component={NavLink} to="/members" variant="outlined">
                        Membros
                      </Button>
                      <Button component={NavLink} to="/reports" variant="outlined">
                        Relatórios
                      </Button>
                    </>
                  ) : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </PageShell>
  );
};

export default DashboardPage;
