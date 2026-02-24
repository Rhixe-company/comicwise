"use client";

import { BookmarkX, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { removeBookmark } from "@/lib/actions/bookmark";

interface Bookmark {
  comic: {
    coverImage: string;
    id: number;
    rating: null | string;
    slug: string;
    status: string;
    title: string;
  };
  lastReadChapter: {
    chapterNumber: number;
    id: number;
    slug: string;
    title: string;
  } | null;
  notes: null | string;
  updatedAt: Date;
}

interface BookmarksListProps {
  bookmarks: Bookmark[];
}

export function BookmarksList({ bookmarks }: BookmarksListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = async (comicId: number) => {
    startTransition(async () => {
      try {
        await removeBookmark(comicId);
        toast.success("Bookmark removed");
        router.refresh();
      } catch {
        toast.error("Failed to remove bookmark");
      }
    });
  };

  if (bookmarks.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4 text-lg">No bookmarks yet</p>
        <Link href="/comics">
          <Button>Browse Comics</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <Card className="overflow-hidden" key={bookmark.comic.id}>
          <div className="flex gap-4 p-4">
            <Link className="shrink-0" href={`/comics/${bookmark.comic.slug}`}>
              <div className="relative h-32 w-24 overflow-hidden rounded-sm">
                <Image
                  alt={bookmark.comic.title}
                  className="object-cover"
                  fill
                  src={bookmark.comic.coverImage}
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link href={`/comics/${bookmark.comic.slug}`}>
                  <h3 className="mb-1 line-clamp-2 font-semibold hover:underline">
                    {bookmark.comic.title}
                  </h3>
                </Link>
                <Badge className="mb-2 text-xs" variant="secondary">
                  {bookmark.comic.status}
                </Badge>

                {bookmark.lastReadChapter && (
                  <p className="text-muted-foreground text-xs">
                    Last read: Ch. {bookmark.lastReadChapter.chapterNumber}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {bookmark.lastReadChapter ? (
                  <Link
                    className="flex-1"
                    href={`/comics/${bookmark.comic.slug}/${bookmark.lastReadChapter.slug}`}
                  >
                    <Button className="w-full" size="sm" variant="outline">
                      <Play className="mr-1 size-3" />
                      Continue
                    </Button>
                  </Link>
                ) : (
                  <Link className="flex-1" href={`/comics/${bookmark.comic.slug}`}>
                    <Button className="w-full" size="sm" variant="outline">
                      <Play className="mr-1 size-3" />
                      Start
                    </Button>
                  </Link>
                )}

                <Button
                  disabled={isPending}
                  onClick={() => handleRemove(bookmark.comic.id)}
                  size="sm"
                  variant="ghost"
                >
                  <BookmarkX className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
