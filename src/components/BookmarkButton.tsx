"use client";

import { useBookmarkStore } from "@/stores/bookmarkStore";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "ui/button";

interface BookmarkButtonProps {
  comicId: number;
  chapterId?: number;
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
      onClick={handleToggle}
      disabled={isLoading}
      variant={bookmarked ? "default" : "outline"}
      size="lg"
    >
      {bookmarked ? (
        <BookmarkCheck className="mr-2 h-5 w-5" />
      ) : (
        <Bookmark className="mr-2 h-5 w-5" />
      )}
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
