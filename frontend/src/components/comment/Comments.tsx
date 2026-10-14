import { useEffect, useState, type KeyboardEvent } from "react";
import type { IComment } from "../../models/interfaces/IComments/IComment.ts";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { commentActions } from "../../slices/commentSlice.ts";
import { usePermissions } from "../hooks/usePermissions.ts";
import type { IApiError } from "../../models/interfaces/IError/IApiError.ts";

interface CommentsProps {
    orderId: string;
}

export const Comments = ({ orderId }: CommentsProps) => {
    const dispatch = useAppDispatch();
    const { items: comments, loading, error } = useAppSelector((state) => state.commentStoreSlice);

    const [inputValue, setInputValue] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { pageData } = useAppSelector((state) => state.orderStoreSlice);

    const currentOrder = pageData?.data.find(o => String(o.id) === String(orderId));
    const { canComment } = usePermissions(currentOrder);

    useEffect(() => {
        if (orderId) {
            dispatch(commentActions.fetchComments(orderId));
        }

        return () => {
            dispatch(commentActions.clearComment());
        };
    }, [dispatch, orderId]);

    const handleSubmit = async () => {
        if (!inputValue.trim() || !canComment) return;

        setSubmitError(null);

        const commentData: IComment = {
            text: inputValue.trim(),
        };

        try {
            await dispatch(commentActions.addComment({ orderId, data: commentData })).unwrap();
            setInputValue("");
        } catch (err: unknown) {
            let message = "Failed to submit comment";
            if (typeof err === "object" && err !== null && ("message" in err || "statusCode" in err)) {
                const apiErr = err as IApiError;
                message = Array.isArray(apiErr.message) ? apiErr.message[0] : (apiErr.message || message);
            } else if (typeof err === "string") {
                message = err;
            }
            setSubmitError(message);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading && canComment && inputValue.trim()) {
            handleSubmit();
        }
    };

    return (
      <div className="p-5 max-w-[600px]">

          {(error || submitError) && (
            <div className="text-red-500 mb-2 font-medium text-sm border border-red-200 bg-red-50 p-2 rounded">
                Error: {submitError || error}
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-2.5 mb-2.5 min-h-[50px] max-h-64 overflow-y-auto bg-gray-50/50">
              {loading && comments.length === 0 && (
                <div className="text-center text-gray-400 py-2">Loading...</div>
              )}

              {!loading && comments.length === 0 && !error && (
                <div className="text-center text-gray-400 py-2">No comments yet</div>
              )}

              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-start border-b border-gray-200 py-2 last:border-b-0 animate-fadeIn"
                >
                    <span className="text-gray-800 text-sm break-words pr-4">{c.text}</span>

                    <span className="text-[10px] text-gray-500 text-right shrink-0">
                        <span className="font-semibold text-gray-700">{c.user?.name} {c.user?.surname}</span> <br />
                        {new Date(c.created_at).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
              ))}
          </div>

          <div className="flex gap-2.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    if (submitError) setSubmitError(null);
                }}
                onKeyDown={handleKeyDown}
                disabled={loading || !canComment}
                placeholder={canComment ? "Write a comment..." : "Access denied"}
                className="grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#43a047] disabled:bg-gray-100 disabled:text-gray-400 transition-all"
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !inputValue.trim() || !canComment}
                className="bg-[#43a047] text-white px-5 py-2 rounded-md cursor-pointer hover:bg-[#2e7d32] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-bold text-sm tracking-wide"
              >
                  SUBMIT
              </button>
          </div>
      </div>
    );
};