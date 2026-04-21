import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import membersAPI from '../services/members';
import { Member } from '../types';

interface MembersState {
  list: Member[];
  loading: boolean;
  error?: string | null;
}

const initialState: MembersState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchMembers = createAsyncThunk('members/fetch', async () => {
  const data = await membersAPI.list();
  return data as Member[];
});

export const createMember = createAsyncThunk('members/create', async (payload: Partial<Member>) => {
  const data = await membersAPI.create(payload);
  return data as Member;
});

export const updateMember = createAsyncThunk('members/update', async ({ id, payload }: { id: number; payload: Partial<Member> }) => {
  const data = await membersAPI.update(id, payload);
  return data as Member;
});

export const deleteMember = createAsyncThunk('members/delete', async (id: number) => {
  await membersAPI.remove(id);
  return id;
});

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMembers.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchMembers.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; });
    builder.addCase(fetchMembers.rejected, (state) => { state.loading = false; state.error = 'Failed to load members'; });

    builder.addCase(createMember.fulfilled, (state, action) => { state.list.push(action.payload); });
    builder.addCase(updateMember.fulfilled, (state, action) => { state.list = state.list.map((m) => (m.id === action.payload.id ? action.payload : m)); });
    builder.addCase(deleteMember.fulfilled, (state, action) => { state.list = state.list.filter((m) => m.id !== action.payload); });
  },
});

export default membersSlice.reducer;
