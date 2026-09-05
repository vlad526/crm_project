import {baseUrl} from "../../components/res_constants/info.ts";
import {store} from "../../components/store/store.ts";
import {authActions} from "../../slices/authSlice.ts";
import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    const isPublicRoute = config.url?.includes('/auth/activate') || config.url?.includes('/auth/recovery');
    if (token && !isPublicRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const responseData = error.response?.data;

        const serverMessage = responseData?.messages && Array.isArray(responseData.messages)
            ? responseData.messages[0]
            : responseData?.message;

        const message = serverMessage ||
            (status === 401 || status === 403 ? 'Incorrect login or password' : error.message);

        if (status === 401 && window.location.pathname !== "/login") {
            store.dispatch(authActions.logout());
            window.location.href = "/login";
            return Promise.reject('Session expired');
        }

        return Promise.reject({
            message: message,
            statusCode: status,
            error: responseData?.error || 'Error'
        });
    })

