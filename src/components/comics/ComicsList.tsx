"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ComicCard } from "./ComicCard";
import { ComicFilters } from "./ComicFilters";

interface Comic {
  coverImage: string;
  description: string;
  id: number;
  publicationDate: Date;
  rating: null | string;
  slug: string;
  status: string;
  title: string;
  views: number;
}

interface Type {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ComicsListProps {
  comics: Comic[];
  currentPage: number;
  genres: Genre[];
  pageSize: number;
  totalCount: number;
  types: Type[];
}

export function ComicsList({
  comics,
  totalCount,
  currentPage,
  pageSize,
  types,
  genres,
}: ComicsListProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8">
      <ComicFilters genres={genres} types={types} />

      {comics.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-lg">No comics found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {comics.map((comic) => (
              <ComicCard comic={comic} key={comic.id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Link
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                href={`/comics?page=${currentPage - 1}`}
              >
                <Button disabled={currentPage <= 1} size="icon" variant="outline">
                  <ChevronLeft className="size-4" />
                </Button>
              </Link>

              <span className="text-muted-foreground text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Link
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                href={`/comics?page=${currentPage + 1}`}
              >
                <Button disabled={currentPage >= totalPages} size="icon" variant="outline">
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
