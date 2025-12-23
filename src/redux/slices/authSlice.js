import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// ==============================
// Async Thunk: Admin Login
// ==============================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // credentials = { email, password }
      const data = await authService.login(credentials);

      /**
       * Backend response:
       * {
       *   admin_token: "...",
       *   user: { id, email, role }
       * }
       */

      // ✅ Store admin token correctly
      if (data?.admin_token) {
        localStorage.setItem("token", data.admin_token);
      } else {
        throw new Error("Token not received from server");
      }

      // ✅ Return full payload so reducer can use it
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  }
);

// ==============================
// Initial State
// ==============================
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
  loading: false,
  error: null,
};

// ==============================
// Auth Slice
// ==============================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --------------------
      // LOGIN PENDING
      // --------------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // --------------------
      // LOGIN SUCCESS
      // --------------------
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        // ✅ user object from backend
        state.user = action.payload.user;
      })

      // --------------------
      // LOGIN ERROR
      // --------------------
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
