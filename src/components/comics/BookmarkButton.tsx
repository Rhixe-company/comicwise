"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { addBookmark, removeBookmark } from "@/lib/actions/bookmark";

interface BookmarkButtonProps {
  comicId: number;
  isAuthenticated: boolean;
  isBookmarked: boolean;
}

export function BookmarkButton({ comicId, isBookmarked, isAuthenticated }: BookmarkButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to bookmark comics");
      router.push("/login-page-01");
      return;
    }

    startTransition(async () => {
      try {
        if (isBookmarked) {
          await removeBookmark(comicId);
          toast.success("Removed from bookmarks");
        } else {
          await addBookmark(comicId);
          toast.success("Added to bookmarks");
        }
        router.refresh();
      } catch {
        toast.error("Failed to update bookmark");
      }
    });
  };

  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={handleToggleBookmark}
      variant={isBookmarked ? "default" : "outline"}
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="mr-2 size-4" />
          Bookmarked
        </>
      ) : (
        <>
          <Bookmark className="mr-2 size-4" />
          Add to Bookmarks
        </>
      )}
    </Button>
  );
}
