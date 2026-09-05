import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IGroup } from "../models/interfaces/IGroup/IGroup.ts";
import { createGroup, getGroupById, getGroups } from "../services/api.service.tsx";
import { getErrorMessage } from "../utils/mapError.ts";

interface GroupState {
    groups: IGroup[];
    loading: boolean;
    error: string | null;
}

const initialGroupState: GroupState = {
    groups: [],
    loading: false,
    error: null,
};

export const AddCreateGroup = createAsyncThunk<
  IGroup,
  string,
  { rejectValue: string }
>(
  'groups/createGroup',
  async (name, { rejectWithValue }) => {
      try {
          return await createGroup({ name });
      } catch (error) {
          return rejectWithValue(getErrorMessage(error)); // <-- Використовуємо мапер
      }
  }
);

export const fetchGroups = createAsyncThunk<
  IGroup[],
  void,
  { rejectValue: string }
>(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
      try {
          return await getGroups();
      } catch (error) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const fetchGroupById = createAsyncThunk<
  IGroup,
  number,
  { rejectValue: string }
>(
  "groups/fetchById",
  async (id: number, { rejectWithValue }) => {
      try {
          return await getGroupById(id);
      } catch (error) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

const groupSlice = createSlice({
    name: 'groups',
    initialState: initialGroupState,
    reducers: {},
    extraReducers: (builder) => {
        builder
          // AddCreateGroup
          .addCase(AddCreateGroup.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(AddCreateGroup.fulfilled, (state, action: PayloadAction<IGroup>) => {
              state.loading = false;
              state.groups.push(action.payload);
          })
          .addCase(AddCreateGroup.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to create group";
          })

          // fetchGroups
          .addCase(fetchGroups.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchGroups.fulfilled, (state, action: PayloadAction<IGroup[]>) => {
              state.loading = false;
              state.groups = action.payload;
          })
          .addCase(fetchGroups.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to fetch groups";
          })

          // fetchGroupById
          .addCase(fetchGroupById.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchGroupById.fulfilled, (state, action: PayloadAction<IGroup>) => {
              state.loading = false;

              const existingIndex = state.groups.findIndex(g => g.id === action.payload.id);
              if (existingIndex !== -1) {
                  state.groups[existingIndex] = action.payload;
              } else {
                  state.groups.push(action.payload);
              }
          })
          .addCase(fetchGroupById.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to fetch group by ID";
          });
    },
});

export const groupActions = { ...groupSlice.actions, AddCreateGroup, fetchGroups, fetchGroupById };

export default groupSlice;