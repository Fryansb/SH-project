import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../services/auth';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error?: string | null;
}

const initialState: AuthState = {
  user: authAPI.getUser(),
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }) => {
  const data = await authAPI.login(email, password);
  return data.user as User;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => { state.loading = false; state.user = action.payload; });
    builder.addCase(login.rejected, (state) => { state.loading = false; state.error = 'Login failed'; });
    builder.addCase(logout.fulfilled, (state) => { state.user = null; });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
