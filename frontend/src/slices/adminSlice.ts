import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IOrdersStats } from "../models/interfaces/IOrders/orders-stats.interface.ts";
import { banUser, createManager, getActivationLink, getAllUsers, getRecoveryLink, getStatsByStatus, unbanUser } from "../services/api.service.tsx";
import type { IUser } from "../models/interfaces/IUser/IUser.ts";
import type { IManager } from "../models/interfaces/IManager/IManager.ts";
import type { IFetchAllUsersResponse } from "../models/interfaces/IUser/IFetchAllUsersResponse.ts";
import { getErrorMessage } from "../utils/mapError.ts";


interface AdminState {
    users: IUser[];
    stats: IOrdersStats | null;
    total: number;
    loading: boolean;
    error: string | null;
}

const initialAdminState: AdminState = {
    users: [],
    stats: null,
    total: 0,
    loading: false,
    error: null,
};

export const fetchOrdersStats = createAsyncThunk(
  'orders/fetchStats',
  async (_, { rejectWithValue }) => {
      try {
          return await getStatsByStatus();
      } catch (error) {
          console.error("API Error:", error);
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
      try {
          return await getAllUsers(page, limit);
      } catch (error) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const addManager = createAsyncThunk(
  'admin/addManager',
  async (managerData: IManager, { rejectWithValue }) => {
      try {
          return await createManager(managerData);
      } catch (error) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const copyActivationLink = createAsyncThunk<
  { userId: number; link: string; emailSent: boolean },
  number,
  { rejectValue: string }
>(
  'admin/copyActivationLink',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getActivationLink(userId);
      return { userId, link: response.link, emailSent: response.emailSent };
    } catch (error) {
      const message = getErrorMessage(error);
      const firstMessage =
        message === 'Incorrect login or password'
          ? 'Failed to copy link'
          : message;
      return rejectWithValue(firstMessage);
    }
  },
);

export const copyRecoveryLink = createAsyncThunk<
  { userId: number; link: string; emailSent: boolean },
  number,
  { rejectValue: string }
>(
  'admin/copyRecoveryLink',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getRecoveryLink(userId);
      return { userId, link: response.link, emailSent: response.emailSent };
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      const finalMessage =
        message === 'Incorrect login or password'
          ? 'Failed to generate or copy recovery link'
          : message;
      return rejectWithValue(finalMessage);
    }
  },
);

export const toggleUserBan = createAsyncThunk(
  'admin/toggleUserBan',
  async ({ userId, action }: { userId: number; action: 'ban' | 'unban' }, { rejectWithValue }) => {
      try {
          return action === 'ban' ? await banUser(userId) : await unbanUser(userId);
      } catch (error) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: initialAdminState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          // fetchOrdersStats
          .addCase(fetchOrdersStats.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchOrdersStats.fulfilled, (state, action: PayloadAction<IOrdersStats>) => {
              state.loading = false;
              state.stats = action.payload;
          })
          .addCase(fetchOrdersStats.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
          })

          // fetchAllUsers
          .addCase(fetchAllUsers.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<IFetchAllUsersResponse>) => {
              state.loading = false;
              const { users, total, stats } = action.payload;
              state.users = users || [];
              state.total = total ?? 0;
              state.stats = stats || null;
          })
          .addCase(fetchAllUsers.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
          })

          // addManager
          .addCase(addManager.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(addManager.fulfilled, (state, action: PayloadAction<IUser>) => {
              state.loading = false;
              state.users.unshift(action.payload);
              state.total += 1; // Оновлюємо лічильник для коректної пагінації
          })
          .addCase(addManager.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
          })

          // copyActivationLink
          .addCase(copyActivationLink.pending, (state) => {
              state.loading = true;
          })
          .addCase(copyActivationLink.fulfilled, (state) => {
              state.loading = false;
          })
          .addCase(copyActivationLink.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
          })

          // copyRecoveryLink
          .addCase(copyRecoveryLink.pending, (state) => {
              state.loading = true;
          })
          .addCase(copyRecoveryLink.fulfilled, (state) => {
              state.loading = false;
          })
          .addCase(copyRecoveryLink.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
          })

          // toggleUserBan
          .addCase(toggleUserBan.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(toggleUserBan.fulfilled, (state, action) => {
              state.loading = false;
              const { userId, action: banAction } = action.meta.arg;
              const user = state.users.find(u => u.id === userId);
              if (user) {
                  user.isActive = (banAction === 'unban');
              }
          })
          .addCase(toggleUserBan.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
          });
    },
});

export const adminActions = { ...adminSlice.actions, fetchAllUsers, addManager, copyActivationLink, copyRecoveryLink, fetchOrdersStats, toggleUserBan };
export default adminSlice;