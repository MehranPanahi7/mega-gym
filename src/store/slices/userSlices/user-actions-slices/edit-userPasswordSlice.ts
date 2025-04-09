import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface NewPassword {
  newPassword: string;
}

interface PasswordState {
  loading: boolean;
  success: boolean;
  newPassword: NewPassword | null;
  error: string | null;
}

const initialState: PasswordState = {
  loading: false,
  success: false,
  newPassword: null,
  error: null,
};

// دریافت API تغییر رمز عبور
export const editPassword = createAsyncThunk(
  "user/editPassword",
  async (newPassword: NewPassword, { rejectWithValue }) => {
    try {
      // دریافت توکن
      const tokenRes = await fetch("/api/routes/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) return rejectWithValue("توکن معتبر نیست.");

      const token = tokenData?.token;

      // تغییر رمز عبور
      const res = await fetch("/api/routes/users/actions/user-edit-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPassword),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err || "خطایی هنگام دریافت از سرور رخ داده است.");
    }
  }
);

// ساخت اسلایس تغییر رمز عبور
const editPasswordSlice = createSlice({
  name: "editPassword",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.newPassword = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editPassword.pending, (state) => {
        state.loading = true;
        state.newPassword = null;
        state.success = false;
        state.error = null;
      })
      .addCase(editPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newPassword = action.payload.newHashedPassword;
        state.error = null;
      })
      .addCase(editPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.newPassword = null;
        state.error = (action.payload as string) || "خطا در اسلایس";
      });
  },
});

export const { resetState } = editPasswordSlice.actions;
const editPasswordReducer = editPasswordSlice.reducer;
export default editPasswordReducer;
