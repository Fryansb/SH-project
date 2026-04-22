import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import PageShell from '../components/common/PageShell';
import authAPI from '../services/auth';
import priorityAPI from '../services/priority';
import projectsAPI from '../services/projects';
import { PriorityQueueItem, PriorityQueueResponse, Project } from '../types';

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

const PriorityPage: React.FC = () => {
  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';

  const [queueData, setQueueData] = useState<PriorityQueueResponse | null>(null);
  const [draftQueue, setDraftQueue] = useState<PriorityQueueItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProject =
    isAdmin && selectedProjectId ? projects.find((project) => String(project.id) === selectedProjectId) ?? null : null;
  const activeQueue = isAdmin ? draftQueue : queueData?.results ?? [];
  const currentPosition = activeQueue.findIndex((item) => item.is_current_user) + 1;

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let active = true;

    const loadProjects = async () => {
      try {
        const data = await projectsAPI.list();
        if (active) {
          setProjects(data);
        }
      } catch {
        if (active) {
          setProjects([]);
        }
      }
    };

    void loadProjects();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    let active = true;

    const loadQueue = async () => {
      try {
        const data = await priorityAPI.queue(
          selectedProjectId ? { project_id: Number(selectedProjectId) } : undefined,
        );
        if (active) {
          setQueueData(data);
          setDraftQueue(data.results);
          setError(null);
        }
      } catch {
        if (active) {
          setQueueData(null);
          setDraftQueue([]);
          setError('Não foi possível carregar a fila de prioridade.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadQueue();

    return () => {
      active = false;
    };
  }, [selectedProjectId]);

  const moveItem = (index: number, delta: number) => {
    setDraftQueue((current) => {
      const targetIndex = index + delta;
      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleRecalculate = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await priorityAPI.recalculate(
        selectedProjectId ? { project_id: Number(selectedProjectId) } : undefined,
      );
      const refreshed = await priorityAPI.queue(
        selectedProjectId ? { project_id: Number(selectedProjectId) } : undefined,
      );
      setQueueData(refreshed);
      setDraftQueue(refreshed.results);
    } catch {
      setError('Não foi possível recalcular a fila.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveOrder = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await priorityAPI.reorder({
        ordered_member_ids: draftQueue.map((item) => item.member_id),
        ...(selectedProjectId ? { project_id: Number(selectedProjectId) } : {}),
      });
      const refreshed = await priorityAPI.queue(
        selectedProjectId ? { project_id: Number(selectedProjectId) } : undefined,
      );
      setQueueData(refreshed);
      setDraftQueue(refreshed.results);
    } catch {
      setError('Não foi possível salvar a ordem manual.');
    } finally {
      setActionLoading(false);
    }
  };

  const queueProject = queueData?.project ?? selectedProject;
  const selectedProjectLabel = queueProject?.name || 'Fila geral';

  const renderQueueItem = (item: PriorityQueueItem, index: number) => {
    const displayPosition = index + 1;
    const isSelected = item.is_current_user;

    return (
      <Card
        key={item.member_id}
        variant="outlined"
        sx={isSelected ? { borderColor: 'primary.main', bgcolor: 'action.selected' } : undefined}
      >
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">
                {displayPosition}. {item.member_name}
              </Typography>
              <Typography color="text.secondary">{item.member_email}</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Chip label={`Score ${item.priority_score}`} color={isSelected ? 'secondary' : 'primary'} variant="outlined" />
              {item.stack_bonus > 0 ? <Chip label={`+${item.stack_bonus} stack`} color="success" variant="outlined" /> : null}
              {isSelected ? <Chip label="Você" color="secondary" /> : null}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Horas disponíveis: {item.available_hours}/{item.weekly_hours}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Último projeto: {formatDate(item.last_project_date)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {item.rating}
            </Typography>
          </Box>

          {item.matching_stacks.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Stacks compatíveis
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {item.matching_stacks.map((stack) => (
                  <Chip key={stack} label={stack} size="small" />
                ))}
              </Box>
            </Box>
          ) : null}

          {isAdmin ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Button
                size="small"
                variant="outlined"
                aria-label={`Mover ${item.member_email} para cima`}
                onClick={() => moveItem(index, -1)}
                disabled={index === 0 || actionLoading}
              >
                Mover para cima
              </Button>
              <Button
                size="small"
                variant="outlined"
                aria-label={`Mover ${item.member_email} para baixo`}
                onClick={() => moveItem(index, 1)}
                disabled={index === draftQueue.length - 1 || actionLoading}
              >
                Mover para baixo
              </Button>
            </Box>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <PageShell
      title="Prioridade"
      description="Fila de alocação baseada em tempo parado, stack compatível e disponibilidade."
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Contexto atual
                </Typography>
                <Typography color="text.secondary">
                  {selectedProjectLabel} • {queueData?.count ?? 0} membros na fila
                </Typography>
              </Box>

              <Chip
                label={currentPosition > 0 ? `Sua posição: ${currentPosition}` : 'Posição não encontrada'}
                color="secondary"
                variant="outlined"
              />
            </Box>

            {queueProject?.required_stacks && queueProject.required_stacks.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Stacks necessárias do projeto
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {queueProject.required_stacks.map((stack) => (
                    <Chip key={stack} label={stack} variant="outlined" color="primary" />
                  ))}
                </Box>
              </Box>
            ) : null}
          </CardContent>
        </Card>

        {isAdmin ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Controles do admin
              </Typography>

              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="priority-project-label">Projeto da fila</InputLabel>
                  <Select
                    labelId="priority-project-label"
                    label="Projeto da fila"
                    value={selectedProjectId}
                    onChange={(event) => setSelectedProjectId(event.target.value)}
                  >
                    <MenuItem value="">Fila geral</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={String(project.id)}>
                        {project.name}
                        {project.required_stacks?.length ? ` • ${project.required_stacks.join(', ')}` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Button variant="contained" onClick={handleRecalculate} disabled={actionLoading}>
                    Recalcular fila
                  </Button>
                  <Button variant="outlined" onClick={handleSaveOrder} disabled={actionLoading || draftQueue.length === 0}>
                    Salvar ordem manual
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : null}

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6">Membros da fila</Typography>
              {loading ? <Typography color="text.secondary">Carregando fila...</Typography> : null}
            </Box>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {activeQueue.length === 0 && !loading ? (
                <Typography color="text.secondary">Nenhum membro disponível na fila.</Typography>
              ) : (
                activeQueue.map((item, index) => renderQueueItem(item, index))
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PageShell>
  );
};

export default PriorityPage;