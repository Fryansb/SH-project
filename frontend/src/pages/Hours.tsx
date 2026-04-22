import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Stack, TextField, Typography } from '@mui/material';
import PageShell from '../components/common/PageShell';
import authAPI from '../services/auth';
import hoursAPI from '../services/hours';
import membersAPI from '../services/members';
import projectsAPI from '../services/projects';
import { HourRegistry, Member, Project } from '../types';

const validationRules = ['Projeto atribuído', 'Horas descontadas do saldo', 'Limite semanal respeitado', 'Descrição opcional'];

type HourFormState = {
  project_id: string;
  member_id: string;
  hours: string;
  date: string;
  description: string;
};

const getTodayValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createEmptyHourForm = (): HourFormState => ({
  project_id: '',
  member_id: '',
  hours: '',
  date: getTodayValue(),
  description: '',
});

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('pt-BR');
};

const getProjectLabel = (project: Project) => `${project.name} • ${project.client_name}`;

const getMemberLabel = (member: Member) => member.user_email || member.email || `Membro #${member.id}`;

const HoursPage: React.FC = () => {
  const [entries, setEntries] = useState<HourRegistry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<HourFormState>(createEmptyHourForm());

  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      try {
        const [entriesData, projectsData] = await Promise.all([hoursAPI.list(), projectsAPI.list()]);
        if (!active) {
          return;
        }

        setEntries(entriesData);
        setProjects(projectsData);
        setLoadError(null);

        if (isAdmin) {
          try {
            const membersData = await membersAPI.list();
            if (active) {
              setMembers(membersData);
            }
          } catch {
            if (active) {
              setMembers([]);
            }
          }
        } else {
          setMembers([]);
        }
      } catch {
        if (active) {
          setEntries([]);
          setProjects([]);
          setMembers([]);
          setLoadError('Não foi possível carregar os lançamentos de horas.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPage();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  const totalHours = entries.reduce((accumulator, entry) => accumulator + entry.hours, 0);

  const refreshEntries = async () => {
    const refreshedEntries = await hoursAPI.list();
    setEntries(refreshedEntries);
  };

  const handleSubmit = async () => {
    const projectId = Number(form.project_id);
    const memberId = form.member_id ? Number(form.member_id) : undefined;
    const hours = Number(form.hours);

    if (!form.project_id || Number.isNaN(projectId)) {
      setFormError('Selecione um projeto.');
      return;
    }
    if (isAdmin && !form.member_id) {
      setFormError('Selecione um membro.');
      return;
    }
    if (!form.date) {
      setFormError('Informe uma data.');
      return;
    }
    if (Number.isNaN(hours) || hours <= 0) {
      setFormError('Informe uma quantidade válida de horas.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      await hoursAPI.create({
        project_id: projectId,
        ...(memberId ? { member_id: memberId } : {}),
        hours,
        date: form.date,
        description: form.description.trim() || undefined,
      });

      await refreshEntries();
      setForm(createEmptyHourForm());
    } catch {
      setFormError('Não foi possível salvar o lançamento de horas.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title="Horas"
      description="Controle de ponto por projeto e visão da capacidade semanal de cada membro."
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Regras de validação
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {validationRules.map((rule) => (
                <Chip key={rule} label={rule} variant="outlined" color="secondary" />
              ))}
            </Box>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Cada lançamento desconta horas disponíveis do membro e só aceita projetos atribuídos.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '360px minmax(0, 1fr)' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Novo lançamento
              </Typography>

              <Stack spacing={2}>
                <Typography color="text.secondary">
                  Use este formulário para registrar o esforço executado em um projeto e atualizar o saldo disponível.
                </Typography>

                {loadError ? <Typography color="error">{loadError}</Typography> : null}
                {formError ? <Typography color="error">{formError}</Typography> : null}

                <TextField
                  label="Projeto"
                  select
                  SelectProps={{ native: true }}
                  value={form.project_id}
                  onChange={(event) => setForm((current) => ({ ...current, project_id: event.target.value }))}
                  fullWidth
                >
                  <option value="">Selecione um projeto</option>
                  {projects.map((project) => (
                    <option key={project.id} value={String(project.id)}>
                      {getProjectLabel(project)}
                    </option>
                  ))}
                </TextField>

                {isAdmin ? (
                  <TextField
                    label="Membro"
                    select
                    SelectProps={{ native: true }}
                    value={form.member_id}
                    onChange={(event) => setForm((current) => ({ ...current, member_id: event.target.value }))}
                    fullWidth
                  >
                    <option value="">Selecione um membro</option>
                    {members.map((member) => (
                      <option key={member.id} value={String(member.id)}>
                        {getMemberLabel(member)}
                      </option>
                    ))}
                  </TextField>
                ) : null}

                <TextField
                  label="Horas"
                  type="number"
                  value={form.hours}
                  onChange={(event) => setForm((current) => ({ ...current, hours: event.target.value }))}
                  inputProps={{ min: 1, step: 1 }}
                  fullWidth
                />

                <TextField
                  label="Data"
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <TextField
                  label="Descrição"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  multiline
                  minRows={3}
                  fullWidth
                />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving || loading || projects.length === 0 || (isAdmin && members.length === 0)}
                >
                  {saving ? 'Salvando...' : 'Registrar horas'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h6">Lançamentos registrados</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`${entries.length} lançamentos`} color="primary" variant="outlined" />
                  <Chip label={`${totalHours}h registradas`} variant="outlined" />
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                {loading ? (
                  <Typography color="text.secondary">Carregando horas...</Typography>
                ) : entries.length === 0 ? (
                  <Typography color="text.secondary">Nenhum lançamento registrado.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {entries.map((entry) => (
                      <Card key={entry.id} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                            <Box>
                              <Typography variant="h6">{entry.project_name || `Projeto #${entry.project}`}</Typography>
                              <Typography color="text.secondary">
                                {formatDate(entry.date)} • {entry.hours}h
                              </Typography>
                            </Box>
                            <Chip label={`${entry.hours}h`} color="secondary" variant="outlined" />
                          </Box>

                          {isAdmin ? (
                            <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
                              Membro: {entry.member_email || entry.member_username || `Membro #${entry.member}`}
                            </Typography>
                          ) : null}

                          <Typography sx={{ mt: 1 }} color="text.secondary">
                            {entry.description?.trim() || 'Sem descrição.'}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </PageShell>
  );
};

export default HoursPage;