import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../components/store/store.ts";
import { useForm } from "react-hook-form";
import { authActions, resetAuthState } from "../slices/authSlice.ts";
import { toast } from "react-hot-toast";
import Input from "../components/ui/input.tsx";
import { useEffect } from "react";
import type { IApiError } from '../models/interfaces/IError/IApiError.ts';

interface IActivateForm {
    password: string;
    confirmPassword?: string;
}

export const AuthActionPage = ({ type }: { type: 'activate' | 'recovery' }) => {
    const { token } = useParams<{ token: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.authStoreSlice);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<IActivateForm>();

    useEffect(() => {
        localStorage.clear();
        dispatch(resetAuthState());
    }, [dispatch, token]);

    const isApiError = (error: unknown): error is IApiError => {
        return (
          typeof error === 'object' &&
          error !== null &&
          ('message' in error || 'statusCode' in error)
        );
    };

    const onSubmit = async (formData: IActivateForm) => {
        try {
            const action = type === 'activate'
              ? authActions.activateAccount
              : authActions.resetPassword;

            await dispatch(action({
                token: token || "",
                password: formData.password
            })).unwrap();

            localStorage.clear();
            dispatch(authActions.logout());

            toast.success(type === 'activate' ? "Account activated!" : "Password updated!");
            reset();
            navigate("/login", { replace: true });
        } catch (err: unknown) {
            let errorMessage = "An error occurred. Please try again.";

            if (isApiError(err)) {
                errorMessage = Array.isArray(err.message) ? err.message[0] : (err.message || errorMessage);
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            toast.error(errorMessage);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#43a047]">

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-[340px] flex flex-col gap-5">

              <div>
                  <label htmlFor="password" className="block text-[15px] font-semibold text-gray-800 mb-2">
                      {type === 'activate' ? 'Password' : 'Password'}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Min 8 chars" }
                    })}
                    placeholder={type === 'activate' ? 'Password' : 'Password'}
                    className={`w-full bg-gray-100 border-transparent focus:bg-white focus:outline-none focus:!ring-2 focus:!ring-[#43a047] focus:!border-[#43a047] text-left rounded-md px-3 py-2.5 transition-colors placeholder:text-gray-400 ${
                      errors.password ? '!border-red-500 !ring-2 !ring-red-500 bg-red-50' : ''
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium text-center">{errors.password.message}</p>}
              </div>

              <div>
                  <label htmlFor="confirmPassword" className="block text-[15px] font-semibold text-gray-800 mb-2">
                      Confirm Password
                  </label>
                  <Input
                    id='confirmPassword'
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === watch('password') || "Passwords do not match"
                    })}
                    placeholder="Confirm Password"
                    className={`w-full bg-gray-100 border-transparent focus:bg-white focus:outline-none focus:!ring-2 focus:!ring-[#43a047] focus:!border-[#43a047] text-left rounded-md px-3 py-2.5 transition-colors placeholder:text-gray-400 ${
                      errors.confirmPassword ? '!border-red-500 !ring-2 !ring-red-500 bg-red-50' : ''
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium text-center">{errors.confirmPassword.message}</p>}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#43a047] text-white py-2.5 rounded-md uppercase font-bold tracking-wider hover:bg-[#388e3c] disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-3"
              >
                  {loading ? "Processing..." : (type === 'activate' ? "Activate" : "Reset")}
              </button>
          </form>
      </div>
    );
};