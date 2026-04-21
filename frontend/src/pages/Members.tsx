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
} from '@mui/material';
import membersAPI from '../services/members';
import authAPI from '../services/auth';
import { Member } from '../types';

import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, createMember, updateMember, deleteMember } from '../store/membersSlice';

const MembersPage: React.FC = () => {
  const dispatch = useDispatch<import('../store').AppDispatch>();
  const membersState = useSelector((state: any) => state.members);

  const members = membersState.list as Member[];
  const loading = membersState.loading as boolean;
  const error = membersState.error as string | null;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formEmail, setFormEmail] = useState('');
  const [formWeekly, setFormWeekly] = useState<number | ''>('');

  const user = authAPI.getUser();
  const isAdmin = user?.role === 'admin';

  const load = async () => {
    dispatch(fetchMembers());
  };

  useEffect(() => {
    // load via redux
    dispatch(fetchMembers());
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormEmail('');
    setFormWeekly('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormEmail(m.user_email || '');
    setFormWeekly(m.weekly_hours ?? '');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        await dispatch(updateMember({ id: editingMember.id!, payload: { weekly_hours: Number(formWeekly) } }));
      } else {
        await dispatch(createMember({ user: (formEmail as any), weekly_hours: Number(formWeekly) }));
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
                <ListItemText primary={m.user_email || String(m.user)} secondary={`Available: ${m.available_hours}h • Rating: ${m.rating}`} />
              </ListItem>
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>{editingMember ? 'Editar Membro' : 'Criar Membro'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} fullWidth />
              <TextField label="Horas Semanais" type="number" value={formWeekly} onChange={(e) => setFormWeekly(e.target.value === '' ? '' : Number(e.target.value))} fullWidth />
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
