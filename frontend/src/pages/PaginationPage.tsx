import {Outlet} from "react-router-dom";
import {Pagination} from "../components/pagination/Pagination.tsx";
import {useAppSelector} from "../components/store/store.ts";




export const PaginationPage = () => {
    const pageData = useAppSelector(state => state.orderStoreSlice.pageData);

    const totalPages = pageData ? Math.ceil(pageData.total / pageData.limit) : 1;
       return (
        <div>

            <Outlet/>
            <Pagination totalPages={totalPages} />




        </div>
    );
};