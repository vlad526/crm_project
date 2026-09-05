import { useEffect } from 'react';
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {authActions} from "../../slices/authSlice.ts";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { token, me, loading } = useAppSelector(state => state.authStoreSlice);

    useEffect(() => {
        if (token && !me && !loading) {
            dispatch(authActions.fetchMe());
        }
    }, [dispatch, token, me, loading]);

    return { token, me, loading };
};