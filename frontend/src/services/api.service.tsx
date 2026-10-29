import type {ILoginData} from "../models/interfaces/ILogin/ILoginData.ts";
import type {ILoginResponse} from "../models/interfaces/ILogin/ILoginResponse.ts";
import type {IOrdersResponseModel} from "../models/interfaces/IOrders/IOrdersResponseModel.ts";
import type {IOrderFilters} from "../models/interfaces/IOrders/IOrderFilters.ts";
import {axiosInstance} from "./http/axios.ts";
import type {IComment} from "../models/interfaces/IComments/IComment.ts";
import type {ICommentResponse} from "../models/interfaces/IComments/ICommentResponse.ts";
import type {IGroup} from "../models/interfaces/IGroup/IGroup.ts";
import type {IOrder} from "../models/interfaces/IOrders/IOrder.ts";
import type {IUpdateOrder} from "../models/interfaces/IOrders/IUpdateOrder.ts";
import type {IOrdersStats} from "../models/interfaces/IOrders/orders-stats.interface.ts";
import type {IUser} from "../models/interfaces/IUser/IUser.ts";
import type {IManager} from "../models/interfaces/IManager/IManager.ts";
import type {IActivateUser} from "../models/interfaces/IUser/IActivateUser.ts";
import type {IFetchAllUsersResponse} from "../models/interfaces/IUser/IFetchAllUsersResponse.ts";



// Auth
export const loginRequest = async (data: ILoginData): Promise<ILoginResponse> => {
    const { data: res } = await axiosInstance.post<ILoginResponse>('/auth/login', data);
    return res;
};

export const getMeRequest = async (): Promise<IUser> => {
    const { data: res } = await axiosInstance.get<IUser>('/auth/me');
    return res;
};

export const activateUserAccount = async (data:IActivateUser): Promise<void> => {
    await axiosInstance.patch('/auth/activate', data);
};
export const resetUserPassword = async (data:IActivateUser): Promise<void> => {
    await axiosInstance.patch('/auth/recovery', data);
};

// Orders
export const getOrders = async (filters: IOrderFilters,): Promise<IOrdersResponseModel> => {
    const { data } = await axiosInstance.get<IOrdersResponseModel>('/orders', {
        params: filters,
    });
      return data;
};

export const updateOrders = async (id: string, payload: IUpdateOrder): Promise<IOrder> => {
    const { data } = await axiosInstance.patch(`/orders/${id}`, payload);
    return data;
};

export const exportOrdersToExcel = async (filters: IOrderFilters): Promise<Blob> => {
    const { data } = await axiosInstance.get('/orders/excel', {
        params: filters,
        responseType: 'blob',
    });
    return data;
};

//Admin
export const getStatsByStatus = async ():Promise<IOrdersStats> => {
    const { data } = await axiosInstance.get('/admin/orders/stats', {});
    return data;

}
export const getAllUsers = async (page: number = 1, limit: number = 5): Promise<IFetchAllUsersResponse> => {
    const { data } = await axiosInstance.get('admin/users', {
        params: {
            limit,
            page,
        }
    });
    return data;
};

export const createManager = async (managerData: IManager):Promise<IUser> => {
    const { data } = await axiosInstance.post<IUser>('admin/managers', managerData);
    return data;
}

export const getActivationLink = async (
  id: number,
): Promise<{ link: string; emailSent: boolean }> => {
    const { data } = await axiosInstance.post<{ link: string; emailSent: boolean }>(
      `/admin/${id}/activation-token`,
    );
    return data;
};

export const getRecoveryLink = async (
  id: number,
): Promise<{ link: string; emailSent: boolean }> => {
    const { data } = await axiosInstance.post<{ link: string; emailSent: boolean }>(
      `/admin/${id}/recovery-token`,
    );
    return data;
};

export const banUser = async (userId: number): Promise<IUser> => {
    const { data } = await axiosInstance.patch<IUser>(`/admin/${userId}/ban`);
    return data;
};

export const unbanUser = async (userId: number): Promise<IUser> => {
    const { data } = await axiosInstance.patch<IUser>(`/admin/${userId}/unban`);
    return data;
};

// Comments
export const createComments = async (orderId: string, data: IComment): Promise<ICommentResponse> => {
    const { data: res } = await axiosInstance.post<ICommentResponse>(`/orders/${orderId}/comments`, data);
    return res;
};

export const getCommentsByOrder = async (orderId: string): Promise<ICommentResponse[]> => {
    const { data: res } = await axiosInstance.get<ICommentResponse[]>(`/orders/${orderId}/comments`);
    return res;
};

// Groups
export const createGroup = async (data: { name: string }) => {
    const { data: res } = await axiosInstance.post<IGroup>('/groups', data);
    return res;
};

export const getGroups = async () => {
    const { data: res } = await axiosInstance.get<IGroup[]>('/groups');
    return res;
};

