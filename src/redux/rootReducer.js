import navBarSlice from "./slices/navBarSlice";
import authSlice from "./slices/authSlice";
import modalSlice from "./slices/modalSlice";

const rootReducer = {
  navBar: navBarSlice,
  auth: authSlice,

  modal: modalSlice,
};

export default rootReducer;
