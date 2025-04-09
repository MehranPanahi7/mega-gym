import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface NewEmail {
  newEmail: string;
}

interface EmailState {
  loading: boolean;
  success: boolean;
  newEmail: NewEmail | null;
  error: string | null;
}

const initialState: EmailState = {
  loading: false,
  success: false,
  newEmail: null,
  error: null,
};

// دریافت از API
export const editEmail = createAsyncThunk(
  "user/email",
  async (newEmail: NewEmail, { rejectWithValue }) => {
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

      // دریافت API تغییر ایمیل
      const res = await fetch("/api/routes/users/actions/user-edit-email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmail),
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
  name: "editEmail",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.newEmail = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editEmail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.newEmail = null;
        state.error = null;
      })
      .addCase(editEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newEmail = action.payload.newEmail;
        state.error = null;
      })
      .addCase(editEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.newEmail = null;
        state.error = (action.payload as string) || "خطا در اسلایس";
      });
  },
});

export const { resetState } = editSlice.actions;
const editEmailReducer = editSlice.reducer;
export default editEmailReducer;
