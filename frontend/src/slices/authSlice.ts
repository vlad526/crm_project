import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { activateUserAccount, getMeRequest, loginRequest, resetUserPassword } from "../services/api.service.tsx";
import type { ILoginData } from "../models/interfaces/ILogin/ILoginData.ts";
import type { IUser } from "../models/interfaces/IUser/IUser.ts";
import { getErrorMessage } from "../utils/mapError.ts";

type AuthState = {
    me: IUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
};

const initialAuthState: AuthState = {
    me: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
};

export const login = createAsyncThunk<
  string,
  ILoginData,
  { rejectValue: string }
>(
  'auth/login',
  async (data: ILoginData, { rejectWithValue }) => {
      try {
          const response = await loginRequest(data);

          if (!response.accessToken) {
              return rejectWithValue('No token returned from server');
          }

          localStorage.setItem('token', response.accessToken);
          return response.accessToken;
      } catch (error) {

          return rejectWithValue(getErrorMessage(error));
      }
  }
);


export const fetchMe = createAsyncThunk<IUser, void, { rejectValue: string }>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
      try {
          return await getMeRequest();
      } catch (error) {

          return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const activateAccount = createAsyncThunk<void, { token: string; password: string }, { rejectValue: string }>(
  'auth/activateAccount',
  async ({ token, password }, { rejectWithValue }) => {
      try {
          await activateUserAccount({ token, password });
      } catch (error: unknown) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const resetPassword = createAsyncThunk<void, { token: string; password: string }, { rejectValue: string }>(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
      try {
          await resetUserPassword({ token, password });
      } catch (error: unknown) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        logout(state) {
            state.token = null;
            state.me = null;
            state.error = null;
            state.loading = false;
            localStorage.removeItem("token");
        },
        resetAuthState(state) {
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
          // login
          .addCase(login.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
              state.loading = false;
              state.token = action.payload;
          })
          .addCase(login.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Incorrect login or password";
          })

          // fetchMe
          .addCase(fetchMe.pending, (state) => {
              state.loading = true;
          })
          .addCase(fetchMe.fulfilled, (state, action: PayloadAction<IUser>) => {
              state.loading = false;
              state.error = null;
              state.me = action.payload;
          })
          .addCase(fetchMe.rejected, (state, action) => {
              state.loading = false;
              state.token = null;
              state.me = null;
              localStorage.removeItem("token");
              state.error = action.payload ?? "Session expired";
          })

          // activateAccount
          .addCase(activateAccount.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(activateAccount.fulfilled, (state) => {
              state.loading = false;
          })
          .addCase(activateAccount.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to activate account";
          })

          // resetPassword
          .addCase(resetPassword.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(resetPassword.fulfilled, (state) => {
              state.loading = false;
          })
          .addCase(resetPassword.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to reset password";
          });
    },
});

export const { logout, resetAuthState } = authSlice.actions;
export const authActions = { ...authSlice.actions, login, fetchMe, activateAccount, resetPassword };
export default authSlice;