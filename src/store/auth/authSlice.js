import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// signupUser and loginUser with enhanced error handling
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FIREBASE_SIGNUP_URL}${process.env.REACT_APP_FIREBASE_API_KEY}`,
        { email, password, returnSecureToken: true }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error?.message || "Signup failed!";
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const loginUrl = `${process.env.REACT_APP_FIREBASE_LOGIN_URL}${process.env.REACT_APP_FIREBASE_API_KEY}`;
      console.log("Login URL:", loginUrl); // Log the final URL for debugging
      const response = await axios.post(loginUrl, {
        email,
        password,
        returnSecureToken: true,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error?.message || "Login failed!";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Signup actions
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login actions
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
