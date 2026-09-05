import { useMemo } from "react";

type PaginationItem = number | "dots";

interface UsePaginationParams {
    currentPage: number;
    totalPages: number;
    siblings?: number;
}

export const usePagination = ({
                                  currentPage,
                                  totalPages,
                                  siblings = 2,
                              }: UsePaginationParams): PaginationItem[] => {
    return useMemo(() => {
        if (totalPages <= 1) return [];

        const range: PaginationItem[] = [];

        const firstPage = 1;
        const lastPage = totalPages;

        const leftSibling = Math.max(currentPage - siblings, firstPage + 1);
        const rightSibling = Math.min(currentPage + siblings, lastPage - 1);

        range.push(firstPage);
        if (leftSibling > firstPage + 1) {
            range.push("dots");
        }
        for (let page = leftSibling; page <= rightSibling; page++) {
            range.push(page);
        }
        if (rightSibling < lastPage - 1) {
            range.push("dots");
        }
        if (lastPage !== firstPage) {
            range.push(lastPage);
        }

        return range;
    }, [currentPage, totalPages, siblings]);
};
