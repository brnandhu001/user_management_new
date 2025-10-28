import api from '@/services/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: sessionStorage.getItem('token'),
  isAuthenticated: !!sessionStorage.getItem('token'),
  loading: false,
  error: null,
};

const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET || 'fallback-secret';

export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/login', credentials);
      const token = response.data.token;

      // ✅ Encrypt token using AES
      const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();

      // Store encrypted token in sessionStorage
      sessionStorage.setItem('authToken', encryptedToken);

      return token; // or return response.data if you need user info
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
