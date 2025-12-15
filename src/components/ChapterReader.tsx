"use client";

import { ChevronLeft, ChevronRight, Home, List, Maximize, Minimize } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "ui/button";
import { Skeleton } from "ui/skeleton";

interface Chapter {
  id: number;
  title: string;
  chapterNumber: number;
  comicId: number;
}

interface Comic {
  id: number;
  title: string;
}

interface ChapterImage {
  id: number;
  imageUrl: string;
  pageNumber: number;
}

interface ReaderProps {
  chapter: Chapter;
  comic: Comic;
  images: ChapterImage[];
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export function ChapterReader({ chapter, comic, images, prevChapter, nextChapter }: ReaderProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = images.length;

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (prevChapter) {
      router.push(`/comics/${comic.id}/read/${prevChapter.id}`);
    }
  }, [currentPage, prevChapter, router, comic.id]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (nextChapter) {
      router.push(`/comics/${comic.id}/read/${nextChapter.id}`);
    }
  }, [currentPage, totalPages, nextChapter, router, comic.id]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevPage();
      }
      if (e.key === "ArrowRight") {
        handleNextPage();
      }
      if (e.key === "f") {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePrevPage, handleNextPage, toggleFullscreen]);

  const currentImage = images[currentPage - 1];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div
        className={`
        sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur
      `}
      >
        <div
          className={`
          container mx-auto flex h-16 items-center justify-between px-4
        `}
        >
          <div className="flex items-center gap-4">
            <Link href={`/comics/${comic.id}`}>
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div
              className={`
              hidden
              md:block
            `}
            >
              <h2 className="font-semibold">{comic.title}</h2>
              <p className="text-sm text-gray-400">{chapter.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className={`
                hidden
                md:inline-flex
              `}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize
                  className={`
                h-5 w-5
              `}
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Reader */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Current Page */}
          <div className="relative overflow-hidden rounded-lg bg-gray-900">
            {isLoading && <Skeleton className="absolute inset-0 bg-gray-800" />}
            {currentImage && (
              <Image
                src={currentImage.imageUrl}
                alt={`Page ${currentPage}`}
                width={1200}
                height={1800}
                className="h-auto w-full"
                onLoad={() => setIsLoading(false)}
                priority
              />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 1 && !prevChapter} size="lg">
              <ChevronLeft className="mr-2 h-5 w-5" />
              {currentPage === 1 && prevChapter ? "Previous Chapter" : "Previous"}
            </Button>

            <Link href={`/comics/${comic.id}`}>
              <Button variant="outline" size="lg">
                <List className="mr-2 h-5 w-5" />
                Chapters
              </Button>
            </Link>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages && !nextChapter}
              size="lg"
            >
              {currentPage === totalPages && nextChapter ? "Next Chapter" : "Next"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Page Thumbnails */}
          <div
            className={`
            mt-8 grid grid-cols-5 gap-2
            md:grid-cols-10
          `}
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`
                  relative aspect-2/3 overflow-hidden rounded border-2
                  transition-all
                  ${
                    currentPage === index + 1
                      ? "scale-105 border-white"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }
                `}
              >
                <Image
                  src={image.imageUrl}
                  alt={`Page ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div
        className={`
          fixed right-4 bottom-4 hidden rounded-lg border border-white/10
          bg-black/90 p-4 text-xs backdrop-blur
          md:block
        `}
      >
        <p className="mb-2 font-semibold">Keyboard Shortcuts</p>
        <ul className="space-y-1 text-gray-400">
          <li>← Previous Page</li>
          <li>→ Next Page</li>
          <li>F Fullscreen</li>
        </ul>
      </div>
    </div>
  );
}
