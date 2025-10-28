import api from '@/services/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const SECRET_KEY = import.meta.env.VITE_TOKEN_SECRET || 'fallback-secret';

const decryptToken = (encryptedToken: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};

const storedEncryptedToken = sessionStorage.getItem('authToken');
const decryptedToken = storedEncryptedToken ? decryptToken(storedEncryptedToken) : null;

const initialState: AuthState = {
  token: decryptedToken,
  isAuthenticated: !!decryptedToken,
  loading: false,
  error: null,
};

// 🔹 LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      const token = response.data.token;

      // Encrypt & store token securely
      const encryptedToken = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
      sessionStorage.setItem('authToken', encryptedToken);

      return token;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// 🔹 LOGOUT (calls /logout API)
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const encryptedToken = sessionStorage.getItem('authToken');
      if (!encryptedToken) throw new Error('No token found');

      const token = decryptToken(encryptedToken);
      if (!token) throw new Error('Invalid token');

      // ✅ Call logout API
      await api.post(
        '/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Clear local session
      sessionStorage.removeItem('authToken');
      return true;
    } catch (error: any) {
      console.error('Logout failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// 🔹 SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.isAuthenticated = false;
        sessionStorage.removeItem('authToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
