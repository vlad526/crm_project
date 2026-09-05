import React from "react";
import { useSearchParams } from "react-router-dom";
import { usePagination } from "../hooks/usePagination.ts";


const baseBtn =
  "w-9 h-9 rounded-full flex items-center justify-center " +
  "text-white font-medium transition-colors " +
  "disabled:bg-green-200 disabled:cursor-not-allowed disabled:text-gray-500";

interface PaginationProps {
    totalPages: number;
    siblings?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          totalPages,
                                                          siblings = 2,
                                                      }) => {
    const [searchParams, setSearchParams] = useSearchParams();


    const parsedPage = parseInt(searchParams.get("page") || "1", 10);
    const validPage = isNaN(parsedPage) ? 1 : parsedPage;


    const currentPage = Math.min(Math.max(validPage, 1), Math.max(totalPages, 1));

    const paginationRange = usePagination({
        currentPage,
        totalPages,
        siblings,
    });

    const setPage = (page: number) => {
        const safePage = Math.min(Math.max(page, 1), totalPages);


        const params = new URLSearchParams(searchParams);
        params.set("page", safePage.toString());
        setSearchParams(params);
    };


    if (totalPages <= 1 || paginationRange.length === 0) return null;

    return (
      <nav aria-label="Pagination" className="flex justify-center m-4">
          <ul className="flex gap-2 list-none p-0">
              <li>
                  <button
                    className={`${baseBtn} bg-[#43a047] hover:bg-green-600`}
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                      {"<"}
                  </button>
              </li>

              {paginationRange.map((item, index) => {
                  if (item === "dots") {
                      return (
                        <li
                          key={`dots-${index}`}
                          className="w-9 h-9 flex items-center justify-center text-green-600"
                          aria-hidden
                        >
                            …
                        </li>
                      );
                  }

                  const page = item as number;

                  return (
                    <li key={`page-${page}`}>
                        <button
                          onClick={() => setPage(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={`${baseBtn} ${
                            page === currentPage
                              ? "bg-green-700 hover:bg-green-700"
                              : "bg-[#43a047] hover:bg-green-600"
                          }`}
                        >
                            {page}
                        </button>
                    </li>
                  );
              })}

              <li>
                  <button
                    className={`${baseBtn} bg-[#43a047] hover:bg-green-600`}
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                      {">"}
                  </button>
              </li>
          </ul>
      </nav>
    );
};