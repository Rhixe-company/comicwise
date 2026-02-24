"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useBookmarkStore } from "@/stores/bookmarkStore";

interface BookmarkButtonProps {
  chapterId?: number;
  comicId: number;
  onToggle?(isBookmarked: boolean): void;
}

export function BookmarkButton({ comicId, onToggle }: Omit<BookmarkButtonProps, "chapterId">) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const [isLoading, setIsLoading] = useState(false);
  const bookmarked = isBookmarked(comicId);

  async function handleToggle() {
    setIsLoading(true);

    try {
      if (bookmarked) {
        removeBookmark(comicId);
        toast.success("Removed from bookmarks");
      } else {
        addBookmark(comicId);
        toast.success("Added to bookmarks");
      }
      onToggle?.(!bookmarked);
    } catch {
      toast.error("Failed to update bookmark");
      if (bookmarked) {
        addBookmark(comicId);
      } else {
        removeBookmark(comicId);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      disabled={isLoading}
      onClick={handleToggle}
      size="lg"
      variant={bookmarked ? "default" : "outline"}
    >
      {bookmarked ? (
        <BookmarkCheck className="mr-2 size-5" />
      ) : (
        <Bookmark className="mr-2 size-5" />
      )}
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
