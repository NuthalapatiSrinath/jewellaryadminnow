// src/redux/slices/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: null,
  props: {}, // We need this to pass data to modals
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.type = action.payload.type;
      state.props = action.payload.props || {};
    },
    closeModal: (state) => {
      state.type = null;
      state.props = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
