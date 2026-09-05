import type {IApiError} from "../models/interfaces/IError/IApiError.ts";

export const getErrorMessage = (err: unknown): string => {
    if (typeof err === "string") return err;

    if (typeof err === "object" && err !== null) {
        const errorObj = err as IApiError;

        const rawMessage = errorObj.messages || errorObj.message;

        if (Array.isArray(rawMessage)) return rawMessage.join(", ");
        if (typeof rawMessage === "string") return rawMessage;
    }

    return "Incorrect login or password";
};