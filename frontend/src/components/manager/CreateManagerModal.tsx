import { type SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "../store/store.ts";
import { addManager } from "../../slices/adminSlice.ts";
import type { FC } from "react";
import type { IManager } from "../../models/interfaces/IManager/IManager.ts";
import type { IApiError } from "../../models/interfaces/IError/IApiError.ts";

interface CreateManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateManagerModal: FC<CreateManagerModalProps> = ({ isOpen, onClose }) => {

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm<IManager>();

    const dispatch = useAppDispatch();

    const isApiError = (error: unknown): error is IApiError => {
        return (
          typeof error === 'object' &&
          error !== null &&
          ('message' in error || 'statusCode' in error)
        );
    };

    const handleModalClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const onSubmit: SubmitHandler<IManager> = async (data) => {
        try {
            clearErrors('root');

            await dispatch(addManager(data)).unwrap();
            handleModalClose();

        } catch (err: unknown) {
            let errorMessage = "Failed to create manager";

            if (isApiError(err)) {
                errorMessage = Array.isArray(err.message) ? err.message[0] : (err.message || errorMessage);
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            setError("root", { message: errorMessage });
        }
    };

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onMouseDown={handleModalClose}
      >
          <div
            className="bg-white p-8 rounded-lg w-full max-w-md mx-4 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  <div className="flex flex-col">
                      <label htmlFor="manager-email" className="text-xl font-semibold text-gray-800">
                          Email
                      </label>
                      <input
                        id="manager-email"
                        type="email"
                        autoFocus
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email format"
                            }
                        })}
                        className={`bg-gray-50 p-3 rounded mt-2 border outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="manager@example.com"
                      />
                      {errors.email && <span className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</span>}
                  </div>

                  <div className="flex flex-col">
                      <label htmlFor="manager-name" className="text-xl font-semibold text-gray-800">
                          Name
                      </label>
                      <input
                        id="manager-name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className={`bg-gray-50 p-3 rounded mt-2 border outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Name"
                      />
                      {errors.name && <span className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</span>}
                  </div>

                  <div className="flex flex-col">
                      <label htmlFor="manager-surname" className="text-xl font-semibold text-gray-800">
                          Surname
                      </label>
                      <input
                        id="manager-surname"
                        type="text"
                        {...register("surname", { required: "Surname is required" })}
                        className={`bg-gray-50 p-3 rounded mt-2 border outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
                          errors.surname ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Surname"
                      />
                      {errors.surname && <span className="text-red-500 text-xs mt-1 font-medium">{errors.surname.message}</span>}
                  </div>

                  {errors.root && (
                    <span className="text-red-500 text-sm block mt-2 font-medium bg-red-50 p-3 rounded border border-red-200 text-center">
                        {errors.root.message}
                    </span>
                  )}

                  <div className="flex justify-between gap-4 pt-4">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="bg-gray-400 text-white w-full py-3 rounded font-bold uppercase tracking-wide hover:bg-gray-500 transition-colors"
                      >
                          Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 text-white w-full py-3 rounded font-bold uppercase tracking-wide hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                          {isSubmitting ? "Creating..." : "Create"}
                      </button>
                  </div>

              </form>
          </div>
      </div>
    );
};