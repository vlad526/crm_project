import {AdminPanel} from "../components/adminPanel/AdminPanel.tsx";
import {Header} from "../components/header/Header.tsx";
import {Pagination} from "../components/pagination/Pagination.tsx";
import {useAppDispatch, useAppSelector} from "../components/store/store.ts";
import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {fetchAllUsers} from "../slices/adminSlice.ts";


const USERS_PER_PAGE = 5;

export const AdminPage = () => {
  const dispatch = useAppDispatch();


  const { total } = useAppSelector(state => state.adminStoreSlice);

  const totalPages = Math.ceil(total / USERS_PER_PAGE) || 1;

  const [searchParams] = useSearchParams();


  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage, limit: USERS_PER_PAGE }));
  }, [dispatch, currentPage]);

  return (

    <main className="w-full bg-gray-50 min-h-screen">
      <Header/>
      <AdminPanel />
      <Pagination totalPages={totalPages} />
    </main>
  );
};