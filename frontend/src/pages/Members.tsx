import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Stack as MuiStack,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import authAPI from '../services/auth';
import stacksAPI from '../services/stacks';
import { Member, Stack as StackOption } from '../types';

import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, createMember, updateMember, deleteMember } from '../store/membersSlice';

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Não registrado';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('pt-BR');
};

const resolveSelectedStackIds = (member: Member | null, stackOptions: StackOption[]) => {
  if (!member?.stacks?.length) {
    return [];
  }

  const stackNames = new Set(member.stacks);
  return stackOptions.filter((stackOption) => stackNames.has(stackOption.name)).map((stackOption) => stackOption.id);
};

const MembersPage: React.FC = () => {
  const dispatch = useDispatch<import('../store').AppDispatch>();
  const membersState = useSelector((state: any) => state.members);

  const members = membersState.list as Member[];
  const loading = membersState.loading as boolean;
  const error = membersState.error as string | null;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formEmail, setFormEmail] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formDiscord, setFormDiscord] = useState('');
  const [formWeekly, setFormWeekly] = useState<number | ''>('');
  const [stackOptions, setStackOptions] = useState<StackOption[]>([]);
  const [selectedStackIds, setSelectedStackIds] = useState<number[]>([]);

  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchMembers());
    void stacksAPI.list().then(setStackOptions).catch(() => setStackOptions([]));
  }, [dispatch]);

  useEffect(() => {
    if (!openDialog || !editingMember) {
      return;
    }

    setSelectedStackIds(resolveSelectedStackIds(editingMember, stackOptions));
  }, [editingMember, openDialog, stackOptions]);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormEmail('');
    setFormGithub('');
    setFormDiscord('');
    setFormWeekly('');
    setSelectedStackIds([]);
    setOpenDialog(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormEmail(m.user_email || '');
    setFormGithub(m.user_github_url || '');
    setFormDiscord(m.user_discord_id || '');
    setFormWeekly(m.weekly_hours ?? '');
    setSelectedStackIds(resolveSelectedStackIds(m, stackOptions));
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const toggleStack = (stackId: number) => {
    setSelectedStackIds((current) => (
      current.includes(stackId)
        ? current.filter((value) => value !== stackId)
        : [...current, stackId]
    ));
  };

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        await dispatch(updateMember({
          id: editingMember.id!,
          payload: {
            weekly_hours: Number(formWeekly),
            github_url: formGithub,
            discord_id: formDiscord,
            stack_ids: selectedStackIds,
          },
        }));
      } else {
        await dispatch(createMember({
          email: formEmail,
          github_url: formGithub,
          discord_id: formDiscord,
          weekly_hours: Number(formWeekly),
          stack_ids: selectedStackIds,
        }));
      }
      await dispatch(fetchMembers());
      handleClose();
    } catch (e) {
      // @ts-ignore
      console.error(e);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await dispatch(deleteMember(id));
      await dispatch(fetchMembers());
    } catch (e) {
      // @ts-ignore
      console.error(e);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Membros</Typography>

        {isAdmin && (
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenCreate}>Adicionar Membro</Button>
          </Box>
        )}

        {loading ? (
          <Typography>Carregando...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {members.map((m) => (
              <ListItem key={m.id} divider secondaryAction={isAdmin ? (
                <Box>
                  <IconButton aria-label="edit" onClick={() => handleOpenEdit(m)}>
                    Editar
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(m.id)}>
                    Excluir
                  </IconButton>
                </Box>
              ) : undefined}>
                <ListItemText
                  primary={m.user_email || String(m.user)}
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={(
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        GitHub: {m.user_github_url || 'Não informado'} • Discord: {m.user_discord_id || 'Não informado'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available: {m.available_hours}h of {m.weekly_hours}h • Rating: {m.rating} • Último projeto: {formatDate(m.last_project_date)}
                      </Typography>
                      {m.stacks && m.stacks.length > 0 ? (
                        <MuiStack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                          {m.stacks.map((stack) => (
                            <Chip key={stack} label={stack} size="small" />
                          ))}
                        </MuiStack>
                      ) : null}
                    </Box>
                  )}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>{editingMember ? 'Editar Membro' : 'Criar Membro'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} fullWidth />
              <TextField label="GitHub" value={formGithub} onChange={(e) => setFormGithub(e.target.value)} fullWidth />
              <TextField label="Discord" value={formDiscord} onChange={(e) => setFormDiscord(e.target.value)} fullWidth />
              <TextField label="Horas Semanais" type="number" value={formWeekly} onChange={(e) => setFormWeekly(e.target.value === '' ? '' : Number(e.target.value))} fullWidth />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Stacks
                </Typography>
                {stackOptions.length > 0 ? (
                  <FormGroup>
                    {stackOptions.map((stackOption) => (
                      <FormControlLabel
                        key={stackOption.id}
                        control={(
                          <Checkbox
                            checked={selectedStackIds.includes(stackOption.id)}
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
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">Salvar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MembersPage;
