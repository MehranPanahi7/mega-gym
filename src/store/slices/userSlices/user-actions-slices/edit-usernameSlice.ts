// store/slices/users/user-actions-slices/edit-usernameSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface NewUsername {
  newUsername: string;
}

interface UsernameState {
  loading: boolean;
  success: boolean;
  newUsername: NewUsername | null;
  error: string | null;
}

const initialState: UsernameState = {
  loading: false,
  success: false,
  newUsername: null,
  error: null,
};

// دریافت از API
export const editUsername = createAsyncThunk(
  "user/username",
  async (newUsername: NewUsername, { rejectWithValue }) => {
    try {
      // دریافت توکن
      const tokenRes = await fetch("/api/routes/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) return rejectWithValue("توکن معتبر نیست.");

      const token = tokenData?.token;

      // دریافت API تغییر نام کاربری
      const res = await fetch("/api/routes/users/actions/user-edit-username", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUsername),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err || "خطایی هنگام دریافت از سرور رخ داده است.");
    }
  }
);

// ساخت اسلایس
const editSlice = createSlice({
  name: "editUsername",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.newUsername = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editUsername.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.newUsername = null;
        state.error = null;
      })
      .addCase(editUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newUsername = action.payload.newUsername;
        state.error = null;
      })
      .addCase(editUsername.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.newUsername = null;
        state.error = (action.payload as string) || "خطا در اسلایس";
      });
  },
});

export const { resetState } = editSlice.actions;
const editReducer = editSlice.reducer;
export default editReducer;
