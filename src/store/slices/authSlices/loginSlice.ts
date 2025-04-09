import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  success: boolean;
  loading: boolean;
  error: null | string;
  lastAction: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  success: false,
  loading: false,
  error: null,
  lastAction: "", // برای نمایش خطاهای مربوط به لاگین و جلوگیری از نمایش خطاهای دیگر متدها
};

// دریافت لاگین از API
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    userData: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("/api/routes/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok)
        return rejectWithValue(
          data.message || "مشکلی در ورود به سیستم رخ داده است"
        );

      return data;
    } catch (err) {
      console.log("Error on Fetching", err);
      return rejectWithValue("خطایی در برقراری ارتباط رخ داده است");
    }
  }
);

// بررسی وضعیت کاربر
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch("/api/routes/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "مشکل در احراز هویت");

      return data;
    } catch (err) {
      console.log("Error on Fetching", err);
      return rejectWithValue("خطای شبکه هنگام بررسی احراز هویت");
    }
  }
);

// دریافت API خروج از حساب کاریری
export const fetchLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/routes/auth/logout", { method: "GET" });
      const data = await res.json();

      if (!res.ok)
        return rejectWithValue(data.message || "خطا هنگام خروج از حساب کاربری");
      return data;
    } catch (err) {
      console.log("Error on logging out", err);
      return rejectWithValue("خطای شبکه هنگام خروج از حساب کاربری");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.success = false;
      state.loading = false;
      state.error = null;
      state.lastAction = "";
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.isAuthenticated = false;
        state.success = false;
        state.error = null;
        state.lastAction = "loginUser";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.success = true;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.user);
        state.loading = false;
        state.error = null;

        if (action.payload.token) {
          Cookies.set("token", action.payload.token, { expires: 7 });
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "خطای ورود به سیستم";
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.success = false;
        state.lastAction = "loginUser";
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.error = (action.payload as string) || "خطای احراز هویت";
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.success = false;
        state.user = null;
        state.error = null;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        Cookies.remove("token");
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "خطای خروج";
        state.success = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const { logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
