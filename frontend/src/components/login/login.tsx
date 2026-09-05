import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type RootState, useAppDispatch, useAppSelector } from "../store/store.ts";
import { authActions } from "../../slices/authSlice.ts";
import { getErrorMessage } from "../../utils/mapError.ts";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, token } = useAppSelector((state: RootState) => state.authStoreSlice);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validate = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await dispatch(authActions.login({ login: email, password })).unwrap();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    if (token) navigate("/app/orders");
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#43a047]">
      {/* ЗБІЛЬШЕНО: ширину (w-[350px]), внутрішні відступи (p-8) та проміжки (gap-5) */}
      <div className="bg-white p-8 rounded-md shadow-md w-[350px] flex flex-col gap-5">

        {error && (
          <p className="text-red-500 text-xs text-center font-medium animate-pulse -mb-2">
            {error}
          </p>
        )}

        {/* ЗБІЛЬШЕНО: відстань між полями (gap-5) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[#334155] font-medium text-[14px]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-[#e8f0fe] text-left text-gray-900 rounded-md px-3 py-2.5 outline-none border border-transparent focus:border-[#0da142] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[#334155] font-medium text-[14px]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-[#e8f0fe] text-left text-gray-900 rounded-md px-3 py-2.5 outline-none border border-transparent focus:border-[#0da142] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0da142] text-white py-2.5 rounded-md uppercase font-bold text-[14px] hover:bg-[#0a8736] disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? "LOADING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;