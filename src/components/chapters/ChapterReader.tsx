"use client";

import { ChevronLeft, ChevronRight, Home, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Comic {
  id: number;
  slug: string;
  title: string;
}

interface Chapter {
  chapterNumber: number;
  id: number;
  slug: string;
  title: string;
}

interface ChapterImage {
  id: number;
  imageUrl: string;
  pageNumber: number;
}

interface ChapterReaderProps {
  chapter: Chapter;
  comic: Comic;
  images: ChapterImage[];
  nextChapter: { chapterNumber: number; slug: string; } | null;
  prevChapter: { chapterNumber: number; slug: string; } | null;
}

export function ChapterReader({
  comic,
  chapter,
  images,
  prevChapter,
  nextChapter,
}: ChapterReaderProps) {
  const [readingMode, setReadingMode] = useState<"horizontal" | "vertical">("vertical");

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/comics/${comic.slug}`}>
              <Button size="icon" variant="ghost">
                <Home className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">{comic.title}</h1>
              <p className="text-muted-foreground text-sm">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value: "horizontal" | "vertical") => setReadingMode(value)}
              value={readingMode}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>

            <Link href={`/comics/${comic.slug}`}>
              <Button size="icon" variant="outline">
                <List className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {images.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">No images available for this chapter.</p>
          </div>
        ) : readingMode === "vertical" ? (
          <div className="mx-auto max-w-4xl space-y-2">
            {images.map((image) => (
              <div className="relative" key={image.id}>
                <Image
                  alt={`Page ${image.pageNumber}`}
                  className="h-auto w-full"
                  height={1800}
                  priority={image.pageNumber <= 3}
                  src={image.imageUrl}
                  width={1200}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Horizontal mode - Coming soon!</p>
          </div>
        )}
      </div>

      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky bottom-0 border-t backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          {prevChapter ? (
            <Link href={`/comics/${comic.slug}/${prevChapter.chapterNumber}`}>
              <Button variant="outline">
                <ChevronLeft className="mr-2 size-4" />
                Chapter {prevChapter.chapterNumber}
              </Button>
            </Link>
          ) : (
            <Button disabled variant="outline">
              <ChevronLeft className="mr-2 size-4" />
              No Previous
            </Button>
          )}

          <span className="text-muted-foreground text-sm">{images.length} pages</span>

          {nextChapter ? (
            <Link href={`/comics/${comic.slug}/${nextChapter.chapterNumber}`}>
              <Button variant="outline">
                Chapter {nextChapter.chapterNumber}
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </Link>
          ) : (
            <Button disabled variant="outline">
              No Next
              <ChevronRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
