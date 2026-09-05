import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ICommentResponse } from "../models/interfaces/IComments/ICommentResponse.ts";
import type { IComment } from "../models/interfaces/IComments/IComment.ts";
import { createComments, getCommentsByOrder } from "../services/api.service.tsx";
import { getErrorMessage } from "../utils/mapError.ts";

interface CommentState {
    items: ICommentResponse[];
    loading: boolean;
    error: string | null;
}

const initialCommentState: CommentState = {
    items: [],
    loading: false,
    error: null,
};


export const addComment = createAsyncThunk<
  ICommentResponse,
  { orderId: string; data: IComment },
  { rejectValue: string }
>(
  'comment/addComment',
  async ({ orderId, data }, { rejectWithValue }) => {
      try {
          return await createComments(orderId, data);
      } catch (error) {

          return rejectWithValue(getErrorMessage(error));
      }
  },
);

export const fetchComments = createAsyncThunk<
  ICommentResponse[],
  string,
  { rejectValue: string }
>(
  'comments/fetchByOrder',
  async (orderId, { rejectWithValue }) => {
      try {
          return await getCommentsByOrder(orderId);
      } catch (error) {
          return rejectWithValue(getErrorMessage(error));
      }
  }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState: initialCommentState,
    reducers: {
        clearComment(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
          // addComment
          .addCase(addComment.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(addComment.fulfilled, (state, action) => {
              state.loading = false;
              state.items.push(action.payload);
          })
          .addCase(addComment.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to add comment";
          })

          // fetchComments
          .addCase(fetchComments.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchComments.fulfilled, (state, action: PayloadAction<ICommentResponse[]>) => {
              state.loading = false;
              state.items = action.payload;
          })
          .addCase(fetchComments.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload ?? "Failed to fetch comments";
          });
    },
});

export const { clearComment } = commentSlice.actions;
export const commentActions = { ...commentSlice.actions, addComment, fetchComments };
export default commentSlice;