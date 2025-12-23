import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import diamondService from "../../services/diamondService";

// Async Thunks
export const fetchDiamonds = createAsyncThunk(
  "diamonds/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await diamondService.getAllDiamonds(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch diamonds"
      );
    }
  }
);

export const fetchDiamondFilters = createAsyncThunk(
  "diamonds/fetchFilters",
  async (_, { rejectWithValue }) => {
    try {
      return await diamondService.getFilters();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteDiamond = createAsyncThunk(
  "diamonds/delete",
  async (id, { rejectWithValue }) => {
    try {
      await diamondService.deleteDiamond(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleDiamondStatus = createAsyncThunk(
  "diamonds/toggleStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const data = await diamondService.toggleActivation(id, isActive);
      return { id, isActive, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const diamondSlice = createSlice({
  name: "diamonds",
  initialState: {
    items: [],
    pagination: { currentPage: 1, totalPages: 1 },
    filterOptions: { shapes: [], colors: [] }, // Default structure
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchDiamonds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiamonds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.diamonds;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDiamonds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Filters
      .addCase(fetchDiamondFilters.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      // Delete
      .addCase(deleteDiamond.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      // Toggle Status
      .addCase(toggleDiamondStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i._id === action.payload.id);
        if (index !== -1) {
          state.items[index].active = action.payload.isActive;
        }
      });
  },
});

export default diamondSlice.reducer;
