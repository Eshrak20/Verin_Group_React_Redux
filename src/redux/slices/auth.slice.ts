
import { getAuthToken, getAuthTokenType } from "@/lib/authCookie";
import type { VerifyOtpUser } from "@/types/auth.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: VerifyOtpUser | null;
  token: string | null;
  tokenType: string | null;
  isAuthenticated: boolean;
}

const savedToken = getAuthToken();

const initialState: AuthState = {
  user: null,
  token: savedToken,
  tokenType: savedToken ? getAuthTokenType() : null,
  isAuthenticated: Boolean(savedToken),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: VerifyOtpUser;
        token: string;
        tokenType: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenType = action.payload.tokenType;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tokenType = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
