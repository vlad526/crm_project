import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App.tsx';
import Login from '../components/login/login.tsx';
import OrdersPage from '../pages/OrdersPage.tsx';
import { MainPage } from '../pages/MainPage.tsx';
import { AdminPage } from '../pages/AdminPage.tsx';
import { AuthActionPage } from '../pages/AuthActionPage.tsx';
import { useAuth } from '../components/hooks/useAuth.ts';
import { UserRoleEnum } from '../enums/user-role.enum.ts';
import type { FC, ReactElement } from 'react';

const AdminRoute: FC<{ children: ReactElement }> = ({ children }) => {
    const { me, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!me) {
        return <Navigate to="/login" replace />;
    }


    const isAdmin = me.role && me.role.toLowerCase() === UserRoleEnum.ADMIN.toLowerCase();

    if (!isAdmin) {
        return <Navigate to="/app/orders" replace />;
    }

    return children;
};

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    { path: "/login", element: <Login /> },
    {
        path: "/app",
        element: <App />,
        children: [
            { path: "", element: <MainPage /> },
            { path: "orders", element: <OrdersPage /> },
        ],
    },
    {
        path: "/admin",
        element: (
          <AdminRoute>
              <AdminPage />
          </AdminRoute>
        ),
    },
    { path: "/auth/activate/:token", element: <AuthActionPage type="activate" /> },
    { path: "/auth/recovery/:token", element: <AuthActionPage type="recovery" /> },
]);