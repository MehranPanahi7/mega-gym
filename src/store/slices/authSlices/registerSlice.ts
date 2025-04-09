import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
  user_id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  success: boolean;
  loading: boolean;
  error: null | string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  success: false,
  loading: false,
  error: null,
};

// دریافت ثبت نام از API
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: { username: string; user_email: string; user_password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/routes/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok)
        return rejectWithValue(
          data.message || "مشکلی هنگام ثبت نام کاربر پیش آمده است."
        );

      return data;
    } catch (err) {
      console.log("Error on Fetching", err);
      return rejectWithValue(err);
    }
  }
);

// ساخت اسلایس
const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.success = false;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success = true;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.success = false;
        state.error = (action.payload as string) || "خطای ریداکس رخ داده است.";
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { resetState } = registerSlice.actions;
const registerReducer = registerSlice.reducer;
export default registerReducer;
