import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PageShell from '../components/common/PageShell';
import ProjectDetailsDialog from '../components/projects/ProjectDetailsDialog';
import authAPI from '../services/auth';
import membersAPI from '../services/members';
import projectsAPI from '../services/projects';
import stacksAPI from '../services/stacks';
import { Member, Project, Stack as StackOption } from '../types';

const projectStages = ['Lead', 'Briefing', 'Contrato', 'Desenvolvimento', 'Entregue', 'Suporte'];

const projectStatusOptions: Array<{ value: Project['status']; label: string }> = [
  { value: 'lead', label: 'Lead' },
  { value: 'briefing', label: 'Briefing' },
  { value: 'contract', label: 'Contrato' },
  { value: 'development', label: 'Desenvolvimento' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'support', label: 'Suporte' },
];

type ProjectFormState = {
  name: string;
  client_name: string;
  description: string;
  status: Project['status'];
  estimated_hours: string;
  budget: string;
  deadline: string;
  github_repo: string;
  required_stack_ids: number[];
  assigned_member_ids: number[];
};

const createEmptyProjectForm = (): ProjectFormState => ({
  name: '',
  client_name: '',
  description: '',
  status: 'lead',
  estimated_hours: '',
  budget: '',
  deadline: '',
  github_repo: '',
  required_stack_ids: [],
  assigned_member_ids: [],
});

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

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('pt-BR');
};

const resolveSelectedStackIds = (project: Project | null, stackOptions: StackOption[]) => {
  if (!project?.required_stacks?.length) {
    return [];
  }

  const stackNames = new Set(project.required_stacks);
  return stackOptions.filter((stackOption) => stackNames.has(stackOption.name)).map((stackOption) => stackOption.id);
};

const createProjectFormFromProject = (project: Project, stackOptions: StackOption[]): ProjectFormState => ({
  name: project.name,
  client_name: project.client_name,
  description: project.description,
  status: project.status,
  estimated_hours: String(project.estimated_hours),
  budget: project.budget,
  deadline: project.deadline,
  github_repo: project.github_repo || '',
  required_stack_ids: resolveSelectedStackIds(project, stackOptions),
  assigned_member_ids: project.assigned_members?.map((member) => member.id) ?? [],
});

const getMemberLabel = (member: Member) => member.user_email || member.email || `Membro #${member.id}`;

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stackOptions, setStackOptions] = useState<StackOption[]>([]);
  const [memberOptions, setMemberOptions] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(createEmptyProjectForm());
  const [formError, setFormError] = useState<string | null>(null);

  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';

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
          setError('Não foi possível carregar os projetos.');
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

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let active = true;

    const loadOptions = async () => {
      try {
        const [stacks, members] = await Promise.all([stacksAPI.list(), membersAPI.list()]);
        if (active) {
          setStackOptions(stacks);
          setMemberOptions(members);
        }
      } catch {
        if (active) {
          setStackOptions([]);
          setMemberOptions([]);
        }
      }
    };

    void loadOptions();

    return () => {
      active = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!dialogOpen || !editingProject) {
      return;
    }

    setForm((current) => ({
      ...current,
      required_stack_ids: resolveSelectedStackIds(editingProject, stackOptions),
      assigned_member_ids: editingProject.assigned_members?.map((member) => member.id) ?? [],
    }));
  }, [dialogOpen, editingProject, stackOptions]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setForm(createEmptyProjectForm());
    setFormError(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setForm(createProjectFormFromProject(project, stackOptions));
    setFormError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    setFormError(null);
  };

  const handleOpenDetails = (project: Project) => {
    setDetailsProject(project);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setDetailsProject(null);
  };

  const toggleStack = (stackId: number) => {
    setForm((current) => ({
      ...current,
      required_stack_ids: current.required_stack_ids.includes(stackId)
        ? current.required_stack_ids.filter((value) => value !== stackId)
        : [...current.required_stack_ids, stackId],
    }));
  };

  const toggleMember = (memberId: number) => {
    setForm((current) => ({
      ...current,
      assigned_member_ids: current.assigned_member_ids.includes(memberId)
        ? current.assigned_member_ids.filter((value) => value !== memberId)
        : [...current.assigned_member_ids, memberId],
    }));
  };

  const handleSubmit = async () => {
    const estimatedHours = Number(form.estimated_hours);
    if (!form.name.trim() || !form.client_name.trim() || !form.description.trim() || !form.budget.trim() || !form.deadline) {
      setFormError('Preencha os campos principais do projeto.');
      return;
    }
    if (Number.isNaN(estimatedHours)) {
      setFormError('Informe uma quantidade válida de horas estimadas.');
      return;
    }
    if (form.required_stack_ids.length === 0) {
      setFormError('Selecione ao menos uma stack necessária.');
      return;
    }

    try {
      setFormError(null);
      const payload: Partial<Project> = {
        name: form.name.trim(),
        client_name: form.client_name.trim(),
        description: form.description.trim(),
        status: form.status,
        estimated_hours: estimatedHours,
        budget: form.budget.trim(),
        deadline: form.deadline,
        github_repo: form.github_repo.trim() || undefined,
        required_stack_ids: form.required_stack_ids,
        assigned_member_ids: form.assigned_member_ids,
      };

      if (editingProject) {
        await projectsAPI.update(editingProject.id, payload);
      } else {
        await projectsAPI.create(payload);
      }

      const refreshedProjects = await projectsAPI.list();
      setProjects(refreshedProjects);
      setError(null);
      handleCloseDialog();
      setForm(createEmptyProjectForm());
    } catch {
      setFormError('Não foi possível salvar o projeto.');
    }
  };

  return (
    <PageShell
      title="Projetos"
      description="Estrutura para acompanhar o ciclo de vida do lead à entrega e ao suporte."
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fluxo do projeto
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {projectStages.map((stage) => (
                <Chip key={stage} label={stage} variant="outlined" color="primary" />
              ))}
            </Box>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              A sequência segue a especificação: lead, briefing, contrato, desenvolvimento, entrega e suporte.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6">Projetos cadastrados</Typography>
              {isAdmin ? (
                <Button variant="contained" onClick={handleOpenCreate}>
                  Novo projeto
                </Button>
              ) : null}
            </Box>

            <Box sx={{ mt: 2 }}>
              {loading ? (
                <Typography color="text.secondary">Carregando projetos...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : projects.length === 0 ? (
                <Typography color="text.secondary">Nenhum projeto cadastrado.</Typography>
              ) : (
                <Stack spacing={2}>
                  {projects.map((project) => (
                    <Card key={project.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h6">{project.name}</Typography>
                            <Typography color="text.secondary">
                              {project.client_name} • {project.status_label || project.status}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={project.status_label || project.status} color="primary" variant="outlined" />
                            <Button size="small" variant="text" onClick={() => handleOpenDetails(project)}>
                              Documentação
                            </Button>
                            {isAdmin ? (
                              <Button size="small" variant="text" onClick={() => handleOpenEdit(project)}>
                                Editar
                              </Button>
                            ) : null}
                          </Box>
                        </Box>

                        <Typography sx={{ mt: 2 }} color="text.secondary">
                          {project.description}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Horas estimadas: {project.estimated_hours}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Budget: {formatCurrency(project.budget)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            House fee: {formatCurrency(project.house_fee)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Deadline: {formatDate(project.deadline)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Docs: {project.documents_count || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Histórico: {project.history_count || 0}
                          </Typography>
                          {project.github_repo ? (
                            <Typography variant="body2" color="text.secondary">
                              GitHub: {project.github_repo}
                            </Typography>
                          ) : null}
                        </Box>

                        {project.required_stacks && project.required_stacks.length > 0 ? (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Stacks necessárias
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {project.required_stacks.map((stack) => (
                                <Chip key={stack} label={stack} size="small" />
                              ))}
                            </Box>
                          </Box>
                        ) : null}

                        {project.assigned_members && project.assigned_members.length > 0 ? (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Membros atribuídos
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {project.assigned_members.map((member) => (
                                <Chip key={member.id} label={member.username || member.email} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {formError ? (
              <Typography color="error">{formError}</Typography>
            ) : null}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
              <TextField
                label="Nome"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Cliente"
                value={form.client_name}
                onChange={(event) => setForm((current) => ({ ...current, client_name: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Horas estimadas"
                type="number"
                value={form.estimated_hours}
                onChange={(event) => setForm((current) => ({ ...current, estimated_hours: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Budget"
                value={form.budget}
                onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
                fullWidth
              />
              <TextField
                label="Deadline"
                type="date"
                value={form.deadline}
                onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="GitHub"
                value={form.github_repo}
                onChange={(event) => setForm((current) => ({ ...current, github_repo: event.target.value }))}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Project['status'] }))}
                fullWidth
              >
                {projectStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Descrição"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              multiline
              minRows={4}
              fullWidth
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Stacks necessárias
              </Typography>
              {stackOptions.length > 0 ? (
                <FormGroup>
                  {stackOptions.map((stackOption) => (
                    <FormControlLabel
                      key={stackOption.id}
                      control={(
                        <Checkbox
                          checked={form.required_stack_ids.includes(stackOption.id)}
                          onChange={() => toggleStack(stackOption.id)}
                        />
                      )}
                      label={stackOption.name}
                    />
                  ))}
                </FormGroup>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma stack cadastrada.
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Membros atribuídos
              </Typography>
              {memberOptions.length > 0 ? (
                <FormGroup>
                  {memberOptions.map((member) => (
                    <FormControlLabel
                      key={member.id}
                      control={(
                        <Checkbox
                          checked={form.assigned_member_ids.includes(member.id)}
                          onChange={() => toggleMember(member.id)}
                        />
                      )}
                      label={getMemberLabel(member)}
                    />
                  ))}
                </FormGroup>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum membro cadastrado.
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ProjectDetailsDialog open={detailsOpen} project={detailsProject} onClose={handleCloseDetails} />
    </PageShell>
  );
};

export default ProjectsPage;