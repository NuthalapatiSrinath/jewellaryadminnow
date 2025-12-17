import { createSlice } from "@reduxjs/toolkit";

const navBarSlice = createSlice({
  name: "navBar",
  initialState: {
    isSideBarOpen: false, // ✅ MUST BE FALSE
  },
  reducers: {
    toggleNavBar(state) {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    openNavBar(state) {
      state.isSideBarOpen = true;
    },
    closeNavBar(state) {
      state.isSideBarOpen = false;
    },
  },
});

export const { toggleNavBar, openNavBar, closeNavBar } = navBarSlice.actions;
export default navBarSlice.reducer;
