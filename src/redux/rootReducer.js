import navBarSlice from "./slices/navBarSlice";
import authSlice from "./slices/authSlice";
import modalSlice from "./slices/modalSlice";
// 1. Import the new slice
import diamondSlice from "./slices/diamondSlice";

const rootReducer = {
  navBar: navBarSlice,
  auth: authSlice,
  modal: modalSlice,
  // 2. Add it here
  diamonds: diamondSlice,
};

export default rootReducer;
