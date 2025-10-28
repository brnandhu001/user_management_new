import api from '@/services/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users?page=${page}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);


export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', userData);

      // The API returns `id` as a string, convert to number for consistency
      return { ...userData, id: parseInt(response.data.id) };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
  }
);
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: User, { rejectWithValue }) => {
    try {
      await api.put(`/users/${userData.id}`, userData);
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

// 🧩 Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
