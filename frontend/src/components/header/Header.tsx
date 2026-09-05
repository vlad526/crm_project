import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { logout } from "../../slices/authSlice.ts";
import { fetchOrdersStats } from "../../slices/adminSlice.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminIcon from '../../assets/admin-icon.png';
import logoutIcon from '../../assets/logout-icon.png';

export const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { me } = useAppSelector((state) => state.authStoreSlice);
    const isAdmin = me?.role === 'admin';

    const { error } = useAppSelector(state => state.adminStoreSlice);

    useEffect(() => {
        if (error === 'Unauthorized') {
            navigate('/login');
        }
    }, [error, navigate]);

    const handleAdminPanel = () => {
        dispatch(fetchOrdersStats());
        navigate("/admin");
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
      <div className="w-full">
          <header className="bg-[#43a047] p-6 flex items-center justify-between shadow-sm">
              <div
                className="text-2xl font-bold text-white cursor-pointer select-none"
                onClick={() => navigate('/app/orders')}
                title="Go to Orders"
              >
                  Logo
              </div>


              <div className="flex items-center text-xl text-white gap-4">
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                        <span className="font-medium tracking-wide">admin</span>
                        <button
                          type="button"
                          onClick={handleAdminPanel}
                          title="Admin Panel"
                          aria-label="Open Admin Panel"
                          style={{ backgroundImage: `url(${adminIcon})` }}
                          className="bg-[#2e7d32] hover:bg-[#1b5e20] transition-colors bg-center bg-no-repeat bg-[length:20px_20px] w-10 h-10 rounded-[5px]"
                        />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    aria-label="Logout"
                    style={{ backgroundImage: `url(${logoutIcon})` }}
                    className="bg-[#2e7d32] hover:bg-[#1b5e20] transition-colors bg-center bg-no-repeat bg-[length:20px_20px] w-10 h-10 rounded-[5px]"
                  />
              </div>
          </header>
      </div>
    );
};