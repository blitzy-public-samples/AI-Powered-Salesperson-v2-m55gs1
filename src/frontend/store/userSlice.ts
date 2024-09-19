import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UserRole } from '@/types';
import { login, logout, register, fetchUserProfile } from '@/services/authService';
import { setToken, removeToken } from '@/utils/storage';

// Define the shape of the user state
interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk<User, { email: string; password: string }>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Call the login service with provided credentials
      const { user, token } = await login(credentials);
      // Store the received token
      setToken(token);
      // Return the logged-in user data
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Call the logout service
      await logout();
      // Remove the stored token
      removeToken();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk<User, { email: string; password: string; name: string }>(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Call the register service with provided user data
      const { user, token } = await register(userData);
      // Store the received token
      setToken(token);
      // Return the registered user data
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for fetching user profile
export const fetchUser = createAsyncThunk<User, void>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Call the fetchUserProfile service
      const user = await fetchUserProfile();
      // Return the fetched profile data
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create the user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

// Export selectors
export const selectUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) => !!state.user.currentUser;
export const selectUserRole = (state: { user: UserState }) => state.user.currentUser?.role;

// Export reducer
export default userSlice.reducer;