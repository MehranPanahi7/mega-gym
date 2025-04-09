import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/authSlices/loginSlice";
import registerReducer from "./slices/authSlices/registerSlice";
import editReducer from "./slices/userSlices/user-actions-slices/edit-usernameSlice";
import editPasswordReducer from "./slices/userSlices/user-actions-slices/edit-userPasswordSlice";
import editEmailReducer from "./slices/userSlices/user-actions-slices/edit-emailSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    editUsername: editReducer,
    editPassword: editPasswordReducer,
    editEmail: editEmailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
