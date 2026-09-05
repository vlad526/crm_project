import {createAsyncThunk, createSlice,} from "@reduxjs/toolkit";
import {exportOrdersToExcel, getOrders, updateOrders} from "../services/api.service.tsx";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import type {IOrder} from "../models/interfaces/IOrders/IOrder.ts";
import type {IUpdateOrder} from "../models/interfaces/IOrders/IUpdateOrder.ts";
import {addComment} from "./commentSlice.ts";


type OrderSliceType = {
    pageData: IOrdersResponseModel | null;
    loading: boolean;
    error: string | null;
    filters: IOrderFilters;
    order: string | null;
    isExporting: boolean;

}

const initOrdersSliceState: OrderSliceType  = {
    pageData:null, loading: false, error: null, filters: { page: "1", limit: "25" }, order: null, isExporting: false};



export const loadOrders = createAsyncThunk<
    IOrdersResponseModel,
    IOrderFilters,
    { rejectValue: string }
>(
    "orders/loadOrders",
    async (filters, { rejectWithValue }) => {
        try {
            return await getOrders(filters);
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);

export const loadUpdateOrder = createAsyncThunk<
    IOrder,
    { id: string; payload: IUpdateOrder },
    { rejectValue: string }>(
      "orders/update",
    async ({id, payload}, {rejectWithValue}) => {
        try {

            return await updateOrders(id, payload);
        } catch (error) {
            return rejectWithValue(error as string);
        }
    })


export const exportOrders = createAsyncThunk<
    Blob,
    IOrderFilters,
    { rejectValue: string }
>(
    'orders/exportExcel',
    async (filters, { rejectWithValue }) => {
        try {
            return await exportOrdersToExcel(filters);
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);


const ordersSlice = createSlice({
    name: 'orders',
    initialState: initOrdersSliceState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.pageData = action.payload;
                           })
            .addCase(loadOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to load orders";
            })

            .addCase(loadUpdateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUpdateOrder.fulfilled, (state, action) => {
                state.loading = false;
                if (!state.pageData || !state.pageData.data) return;

                state.pageData.data = state.pageData.data.map(o =>
                    o.id === action.payload.id ? action.payload : o
                );
            })
            .addCase(loadUpdateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to load orders";
            })

            .addCase(addComment.fulfilled, (state, action) => {
            if (!state.pageData || !state.pageData.data) return;

            const { order: updatedOrder, user: manager } = action.payload;

            state.pageData.data = state.pageData.data.map((order) =>
                order.id === updatedOrder.id
                    ? {
                        ...order,
                        manager: manager,
                        status: updatedOrder.status
                    }
                    : order
            );
        })

            .addCase(exportOrders.pending, (state) => {
                state.isExporting = true;
            })
            .addCase(exportOrders.fulfilled, (state) => {
                state.isExporting = false;
            })
            .addCase(exportOrders.rejected, (state) => {
                state.isExporting = false;
            })
    },
});

export const ordersActions = {...ordersSlice.actions, loadOrders, loadUpdateOrder, exportOrdersToExcel};
export default ordersSlice;

