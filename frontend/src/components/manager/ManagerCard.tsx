import { type FC, useState } from "react";
import type { IUser } from "../../models/interfaces/IUser/IUser.ts";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { adminActions } from "../../slices/adminSlice.ts";
import { toast } from "react-hot-toast";
import type { IApiError } from "../../models/interfaces/IError/IApiError.ts";

type State = {
    user: IUser;
};

export const ManagerCard: FC<State> = ({ user }) => {
    const [copyStep, setCopyStep] = useState<"idle" | "ready" | "copied">("idle");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isBanLoading, setIsBanLoading] = useState(false);

    const dispatch = useAppDispatch();
    const me = useAppSelector((state) => state.authStoreSlice.me);

    const isSelf = Boolean(me && Number(me.id) === Number(user.id));
    const isBanned = Boolean(user.isBanned);
    const isActive = Boolean(user.isActive);

    const fallbackCopyToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        textArea.remove();
        if (!successful) {
            throw new Error("Fallback copy failed");
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return;
            }
        } catch {
        }
        fallbackCopyToClipboard(text);
    };

    const handleActionClick = async () => {
        if (isSelf || isBanned || isActionLoading) return;

        if (copyStep === "idle") {
            setCopyStep("ready");
        } else if (copyStep === "ready") {
            const action = isActive
              ? adminActions.copyRecoveryLink
              : adminActions.copyActivationLink;

            setIsActionLoading(true);
            try {
                const response = await dispatch(action(user.id)).unwrap();
                const link = response?.link;
                const emailSent = response?.emailSent;

                if (link) {
                    await copyToClipboard(link);
                    setCopyStep("copied");
                    setTimeout(() => setCopyStep("idle"), 3000);

                    if (emailSent === false) {
                        toast(
                          "Link copied, but email failed to send (check SMTP settings)!",
                          { icon: "⚠️", duration: 5000 }
                        );
                    } else if (emailSent === true) {
                        toast.success("Link copied and email sent successfully!");
                    }
                }
            } catch (err: unknown) {
                let errorMessage = "Failed to copy link";
                if (
                  typeof err === "object" &&
                  err !== null &&
                  ("message" in err || "statusCode" in err)
                ) {
                    const apiErr = err as IApiError;
                    errorMessage = Array.isArray(apiErr.message)
                      ? apiErr.message[0]
                      : apiErr.message || errorMessage;
                } else if (typeof err === "string") {
                    errorMessage = err;
                }

                toast.error(errorMessage);
                setCopyStep("idle");
            } finally {
                setIsActionLoading(false);
            }
        }
    };

    const handleToggleBan = async (userId: number, action: "ban" | "unban") => {
        setCopyStep("idle");
        if (isSelf || isBanLoading) return;

        setIsBanLoading(true);
        try {
            await dispatch(adminActions.toggleUserBan({ userId, action })).unwrap();
            toast.success(action === "ban" ? "Manager banned" : "Manager unbanned");
        } catch (err: unknown) {
            let errorMessage = `Failed to ${action} manager`;
            if (
              typeof err === "object" &&
              err !== null &&
              ("message" in err || "statusCode" in err)
            ) {
                const apiErr = err as IApiError;
                errorMessage = Array.isArray(apiErr.message)
                  ? apiErr.message[0]
                  : apiErr.message || errorMessage;
            } else if (typeof err === "string") {
                errorMessage = err;
            }
            toast.error(errorMessage);
        } finally {
            setIsBanLoading(false);
        }
    };

    return (
      <div
        className={`border-2 rounded-xl p-4 flex justify-between items-start transition-all ${
          isSelf ? "border-blue-400 bg-blue-50/10" : "border-green-600"
        }`}
      >
          <div className="text-sm space-y-1">
              <div className="flex items-center gap-2">
                  <p className="font-bold">id: {user.id}</p>
                  {isSelf && (
                    <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                            You
                        </span>
                  )}
                  {isBanned && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold">
                            Banned
                        </span>
                  )}
              </div>

              <p>email: {user.email}</p>
              <p>name: {user.name}</p>
              <p>surname: {user.surname}</p>
              <p>
                  is_active:{" "}
                  <span
                    className={
                        isActive
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                    }
                  >
                        {String(isActive)}
                    </span>
              </p>
              <p>
                  is_banned:{" "}
                  <span
                    className={
                        isBanned
                          ? "text-red-600 font-medium"
                          : "text-green-600 font-medium"
                    }
                  >
                        {String(isBanned)}
                    </span>
              </p>

              <p>
                  last login:{" "}
                  {user.lastLogin || user.last_login
                    ? new Date((user.lastLogin || user.last_login)!).toLocaleString()
                    : "Never"}
              </p>
          </div>

          <div className="flex flex-col items-end gap-3 min-w-[300px]">
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600 bg-gray-50 p-2 rounded w-full border border-gray-100">
                  <p>
                      Total:{" "}
                      <span className="font-semibold text-gray-800">
                            {user.stats?.total || 0}
                        </span>
                  </p>
                  <p>
                      Agree:{" "}
                      <span className="font-semibold text-gray-800">
                            {user.stats?.agree || 0}
                        </span>
                  </p>
                  <p>
                      In work:{" "}
                      <span className="font-semibold text-gray-800">
                            {user.stats?.in_work || 0}
                        </span>
                  </p>
                  <p>
                      Disagree:{" "}
                      <span className="font-semibold text-gray-800">
                            {user.stats?.disagree || 0}
                        </span>
                  </p>
                  <p>
                      Dubbing:{" "}
                      <span className="font-semibold text-gray-800">
                            {user.stats?.dubbing || 0}
                        </span>
                  </p>
                  <p>
                      New:{" "}
                      <span className="font-semibold text-gray-800">
                            {user.stats?.new || 0}
                        </span>
                  </p>
              </div>

              <div className="flex gap-2 w-full justify-end">
                  <button
                    type="button"
                    onClick={handleActionClick}
                    disabled={isActionLoading || isSelf || isBanned || copyStep === "copied"}
                    className={`h-8.5 flex items-center justify-center px-4 rounded text-[12px] uppercase font-bold border transition-all flex-1 ${
                      isSelf || isBanned
                        ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
                        : copyStep === "idle"
                          ? "bg-green-600 text-white border-green-600 hover:bg-green-700 cursor-pointer"
                          : "bg-green-500 text-white border-green-600 hover:bg-green-700 cursor-pointer"
                    } ${copyStep === "copied" ? "cursor-default" : ""}`}
                    title={
                        isSelf
                          ? "You cannot manage your own links"
                          : isBanned
                            ? "User is banned"
                            : ""
                    }
                  >
                      {copyStep === "idle" &&
                        (isActive ? "Recovery Password" : "Activate")}
                      {copyStep === "ready" &&
                        (isActionLoading ? "Loading..." : "Copy to clipboard")}
                      {copyStep === "copied" && "Link copied"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBan(user.id, "ban")}
                    disabled={isBanLoading || isSelf || isBanned}
                    className={`min-w-17.5 h-8.5 flex items-center justify-center px-3 rounded text-[12px] uppercase font-bold transition-colors ${
                      !isBanLoading && !isSelf && !isBanned
                        ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={isSelf ? "You cannot ban yourself" : ""}
                  >
                      Ban
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBan(user.id, "unban")}
                    disabled={isBanLoading || isSelf || !isBanned}
                    className={`min-w-17.5 h-8.5 flex items-center justify-center px-3 rounded text-[12px] uppercase font-bold transition-colors ${
                      !isBanLoading && !isSelf && isBanned
                        ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={isSelf ? "You cannot unban yourself" : ""}
                  >
                      Unban
                  </button>
              </div>
          </div>
      </div>
    );
};