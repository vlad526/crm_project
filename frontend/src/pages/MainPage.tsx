import {Outlet} from "react-router-dom";
import OrdersPage from "./OrdersPage.tsx";

export const MainPage = () => {


    return (
        <main className="p-6">
            <OrdersPage />
            <Outlet/>
        </main>
    );
};



























