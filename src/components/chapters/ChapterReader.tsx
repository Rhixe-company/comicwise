"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, List } from "lucide-react";

interface Comic {
  id: number;
  title: string;
  slug: string;
}

interface Chapter {
  id: number;
  slug: string;
  title: string;
  chapterNumber: number;
}

interface ChapterImage {
  id: number;
  imageUrl: string;
  pageNumber: number;
}

interface ChapterReaderProps {
  comic: Comic;
  chapter: Chapter;
  images: ChapterImage[];
  prevChapter: { slug: string; chapterNumber: number } | null;
  nextChapter: { slug: string; chapterNumber: number } | null;
}

export function ChapterReader({
  comic,
  chapter,
  images,
  prevChapter,
  nextChapter,
}: ChapterReaderProps) {
  const [readingMode, setReadingMode] = useState<"vertical" | "horizontal">("vertical");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/comics/${comic.slug}`}>
              <Button variant="ghost" size="icon">
                <Home className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">{comic.title}</h1>
              <p className="text-sm text-muted-foreground">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={readingMode} onValueChange={(value: "vertical" | "horizontal") => setReadingMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>

            <Link href={`/comics/${comic.slug}`}>
              <Button variant="outline" size="icon">
                <List className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {images.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No images available for this chapter.</p>
          </div>
        ) : readingMode === "vertical" ? (
          <div className="mx-auto max-w-4xl space-y-2">
            {images.map((image) => (
              <div key={image.id} className="relative">
                <Image
                  src={image.imageUrl}
                  alt={`Page ${image.pageNumber}`}
                  width={1200}
                  height={1800}
                  className="w-full h-auto"
                  priority={image.pageNumber <= 3}
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

      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {prevChapter ? (
            <Link href={`/comics/${comic.slug}/${prevChapter.chapterNumber}`}>
              <Button variant="outline">
                <ChevronLeft className="mr-2 size-4" />
                Chapter {prevChapter.chapterNumber}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="mr-2 size-4" />
              No Previous
            </Button>
          )}

          <span className="text-sm text-muted-foreground">
            {images.length} pages
          </span>

          {nextChapter ? (
            <Link href={`/comics/${comic.slug}/${nextChapter.chapterNumber}`}>
              <Button variant="outline">
                Chapter {nextChapter.chapterNumber}
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              No Next
              <ChevronRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
