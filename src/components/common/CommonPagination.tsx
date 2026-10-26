import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import React, { useEffect, useState } from "react";

interface CommonPaginationProps {
    pagination: {
        current_page: number;
        last_page: number;
    };
    onPageChange?: (page: number) => void;
}

export const CommonPagination: React.FC<CommonPaginationProps> = ({
    pagination,
    onPageChange,
}) => {
    const { current_page, last_page } = pagination;
    const [maxPagesToShow, setMaxPagesToShow] = useState(10);

    // Dynamically adjust visible pages based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) {
                setMaxPagesToShow(3);
            } else if (window.innerWidth < 768) {
                setMaxPagesToShow(5);
            } else {
                setMaxPagesToShow(10);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClick = (e: React.MouseEvent, page: number) => {
        e.preventDefault();
        if (onPageChange && page >= 1 && page <= last_page) {
            onPageChange(page);
        }
    };

    const getPages = () => {
        const pages: (number | string)[] = [];
        let startPage = Math.max(current_page - Math.floor(maxPagesToShow / 2), 1);
        const endPage = Math.min(startPage + maxPagesToShow - 1, last_page);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(endPage - maxPagesToShow + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (startPage > 1) {
            if (startPage > 2) pages.unshift("...");
            pages.unshift(1);
        }

        if (endPage < last_page) {
            if (endPage < last_page - 1) pages.push("...");
            pages.push(last_page);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <Pagination className="mt-8 mb-6 flex w-full justify-center px-2 sm:mt-12 sm:mb-8">
            <PaginationContent className="mx-auto flex w-full flex-wrap justify-center gap-y-2">
                {/* Previous Page Button */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        className={`h-8 px-2 text-xs transition-all border sm:h-10 sm:px-4 sm:text-sm ${current_page === 1
                            ? "pointer-events-none opacity-40"
                            : "cursor-pointer hover:bg-muted"
                            }`}
                        onClick={(e) => handleClick(e, current_page - 1)}
                    />
                </PaginationItem>

                {/* Page Number List */}
                <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
                    {pages.map((page, idx) =>
                        page === "..." ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis className="w-6 text-muted-foreground sm:w-8" />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={`page-${page}`}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === current_page}
                                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold border transition-all sm:h-10 sm:w-10 sm:text-sm ${page === current_page
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs hover:bg-primary/90 hover:text-primary-foreground"
                                        : "bg-background text-foreground border-border hover:border-primary hover:bg-primary/10 hover:text-primary"
                                        }`}
                                    onClick={(e) => handleClick(e, page as number)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}
                </div>

                {/* Next Page Button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        className={`h-8 px-2 text-xs transition-all border sm:h-10 sm:px-4 sm:text-sm ${current_page === last_page
                            ? "pointer-events-none opacity-40"
                            : "cursor-pointer hover:bg-muted"
                            }`}
                        onClick={(e) => handleClick(e, current_page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CommonPagination;