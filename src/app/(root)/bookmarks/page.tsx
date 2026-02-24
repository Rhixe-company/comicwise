import { BookmarkX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ComicCard } from "@/components/layout/ComicCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserBookmarks } from "@/database/queries";

import { auth } from "auth";

import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "My Bookmarks - ComicWise",
  description: "Your bookmarked comics and reading progress",
};

export default async function BookmarksPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/bookmarks");
  }

  const bookmarks = await getUserBookmarks(session.user.id);

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-4 text-center">
          <BookmarkX className="text-muted-foreground mx-auto size-16" />
          <h1 className="text-3xl font-bold">No Bookmarks Yet</h1>
          <p className="text-muted-foreground mx-auto max-w-md">
            Start bookmarking comics you want to read and track your progress here.
          </p>
          <Link href="/comics">
            <Button size="lg">Browse Comics</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1
          className={`
            mb-2 text-3xl font-bold
            md:text-4xl
          `}
        >
          My Bookmarks
        </h1>
        <p className="text-muted-foreground">
          {bookmarks.length} {bookmarks.length === 1 ? "comic" : "comics"} bookmarked
        </p>
      </div>

      <div
        className={`
          grid grid-cols-2 gap-4
          md:grid-cols-3 md:gap-6
          lg:grid-cols-4
        `}
      >
        {bookmarks.map(({ bookmark, comic, chapter }) => {
          if (!comic) return null;

          return (
            <div className="group relative" key={bookmark.comicId}>
              <ComicCard authorName={null} comic={comic} typeName={null} />
              {chapter && (
                <div className="absolute top-2 left-2 z-10">
                  <Link href={`/comics/${comic.id}/read/${chapter.id}`}>
                    <Badge
                      className={`
                        hover:bg-primary/90
                        cursor-pointer
                      `}
                      variant="default"
                    >
                      Continue: Ch. {chapter.chapterNumber}
                    </Badge>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
