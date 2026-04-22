import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import authAPI from '../../services/auth';
import projectsAPI from '../../services/projects';
import { Project, ProjectDocument, ProjectHistoryEntry } from '../../types';

interface ProjectDetailsDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

const emptyUploadForm = {
  title: '',
  description: '',
  visibility: 'assigned' as ProjectDocument['visibility'],
  file: null as File | null,
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'Sem data';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('pt-BR');
};

const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({ open, project, onClose }) => {
  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';
  const isProjectMember = useMemo(() => {
    if (!project || !user) {
      return false;
    }

    return Boolean(
      project.assigned_members?.some(
        (member) => member.email === user.email || member.username === user.username,
      ),
    );
  }, [project, user]);

  const canUpload = isAdmin || isProjectMember;
  const [tab, setTab] = useState(0);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [history, setHistory] = useState<ProjectHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState(emptyUploadForm);

  useEffect(() => {
    if (!open || !project) {
      setTab(0);
      setDocuments([]);
      setHistory([]);
      setError(null);
      setUploadForm(emptyUploadForm);
      return;
    }

    let active = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const [docs, entries] = await Promise.all([projectsAPI.documents(project.id), projectsAPI.history(project.id)]);
        if (active) {
          setDocuments(docs);
          setHistory(entries);
          setError(null);
        }
      } catch {
        if (active) {
          setError('Não foi possível carregar a documentação e o histórico do projeto.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [open, project]);

  const refreshData = async () => {
    if (!project) {
      return;
    }

    const [docs, entries] = await Promise.all([projectsAPI.documents(project.id), projectsAPI.history(project.id)]);
    setDocuments(docs);
    setHistory(entries);
  };

  const handleUpload = async () => {
    if (!project || !uploadForm.title.trim() || !uploadForm.file) {
      setError('Preencha o título e selecione um arquivo.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('project_id', String(project.id));
      formData.append('title', uploadForm.title.trim());
      formData.append('description', uploadForm.description.trim());
      formData.append('visibility', isAdmin ? uploadForm.visibility : 'assigned');
      formData.append('file', uploadForm.file);

      await projectsAPI.uploadDocument(formData);
      await refreshData();
      setUploadForm(emptyUploadForm);
      setTab(0);
    } catch {
      setError('Não foi possível enviar o arquivo.');
    } finally {
      setUploading(false);
    }
  };

  const visibilityLabel = (visibility: ProjectDocument['visibility']) => {
    if (visibility === 'private') {
      return 'Privado';
    }

    if (visibility === 'custom') {
      return 'Acesso personalizado';
    }

    return 'Membros do projeto';
  };

  const documentTab = (
    <Stack spacing={2}>
      {canUpload ? (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Enviar nova documentação</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
                <TextField
                  label="Título"
                  value={uploadForm.title}
                  onChange={(event) => setUploadForm((current) => ({ ...current, title: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Arquivo"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: '*/*' }}
                  onChange={(event) => {
                    const file = (event.target as HTMLInputElement).files?.[0] || null;
                    setUploadForm((current) => ({ ...current, file }));
                  }}
                  fullWidth
                />
              </Box>
              <TextField
                label="Descrição"
                value={uploadForm.description}
                onChange={(event) => setUploadForm((current) => ({ ...current, description: event.target.value }))}
                multiline
                minRows={3}
                fullWidth
              />
              {isAdmin ? (
                <TextField
                  select
                  label="Visibilidade"
                  value={uploadForm.visibility}
                  onChange={(event) =>
                    setUploadForm((current) => ({
                      ...current,
                      visibility: event.target.value as ProjectDocument['visibility'],
                    }))
                  }
                  fullWidth
                >
                  <MenuItem value="assigned">Membros do projeto</MenuItem>
                  <MenuItem value="private">Privado</MenuItem>
                </TextField>
              ) : (
                <TextField label="Visibilidade" value="Membros do projeto" InputProps={{ readOnly: true }} fullWidth />
              )}
              <Box>
                <Button variant="contained" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Enviando...' : 'Enviar documento'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      {documents.length === 0 ? (
        <Typography color="text.secondary">Nenhum documento disponível para este projeto.</Typography>
      ) : (
        <Stack spacing={1.5}>
          {documents.map((document) => (
            <Card key={document.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="subtitle1">{document.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {document.project_name} • {formatDate(document.created_at)}
                      </Typography>
                    </Box>
                    <Chip label={visibilityLabel(document.visibility)} variant="outlined" size="small" />
                  </Box>
                  {document.description ? (
                    <Typography variant="body2" color="text.secondary">
                      {document.description}
                    </Typography>
                  ) : null}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Button component="a" href={document.file_url || '#'} target="_blank" rel="noreferrer" variant="outlined" size="small" disabled={!document.file_url}>
                      Abrir arquivo
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      {document.file_name}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );

  const historyTab = (
    <Stack spacing={2}>
      {history.length === 0 ? (
        <Typography color="text.secondary">Nenhum evento registrado para este projeto.</Typography>
      ) : (
        <List disablePadding>
          {history.map((entry, index) => (
            <React.Fragment key={entry.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemText
                  primary={entry.title}
                  secondary={(
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {entry.description || 'Sem descrição'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.action} • {formatDate(entry.created_at)} • {entry.created_by_email || 'Sistema'}
                      </Typography>
                    </Stack>
                  )}
                />
              </ListItem>
              {index < history.length - 1 ? <Divider component="li" /> : null}
            </React.Fragment>
          ))}
        </List>
      )}
    </Stack>
  );

  return (
    <Dialog open={open && Boolean(project)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">{project?.name || 'Projeto'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {project?.client_name} • {project?.status_label || project?.status}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {loading ? <Typography color="text.secondary">Carregando documentação e histórico...</Typography> : null}
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label={`Documentação (${documents.length})`} />
            <Tab label={`Histórico (${history.length})`} />
          </Tabs>
          {tab === 0 ? documentTab : historyTab}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;