"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  baseUrl?: string;
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages, baseUrl = "/comics" }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    router.push(createPageUrl(page));
  };

  const renderPageNumbers = () => {
    const pages: (React.ReactElement | React.ReactNode)[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <Button
          key={1}
          onClick={() => goToPage(1)}
          size="sm"
          variant={currentPage === 1 ? "default" : "outline"}
        >
          1
        </Button>
      );
      if (start > 2) {
        pages.push(
          <span className="px-2" key="ellipsis-start">
            ...
          </span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => goToPage(i)}
          size="sm"
          variant={currentPage === i ? "default" : "outline"}
        >
          {i}
        </Button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span className="px-2" key="ellipsis-end">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          size="sm"
          variant={currentPage === totalPages ? "default" : "outline"}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        size="sm"
        variant="outline"
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <Button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        size="sm"
        variant="outline"
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
