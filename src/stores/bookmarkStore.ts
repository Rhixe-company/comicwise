import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkState {
  addBookmark(comicId: number): void;
  bookmarks: Set<number>;
  clearAll(): void;
  getProgress(comicId: number): number | undefined;
  isBookmarked(comicId: number): boolean;
  readingProgress: Map<number, number>;
  removeBookmark(comicId: number): void;
  updateProgress(comicId: number, chapterId: number): void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: new Set(),
      readingProgress: new Map(),

      addBookmark: (comicId) =>
        set((state) => ({
          bookmarks: new Set(state.bookmarks).add(comicId),
        })),

      removeBookmark: (comicId) =>
        set((state) => {
          const newBookmarks = new Set(state.bookmarks);

          newBookmarks.delete(comicId);
          const newProgress = new Map(state.readingProgress);

          newProgress.delete(comicId);
          return { bookmarks: newBookmarks, readingProgress: newProgress };
        }),

      updateProgress: (comicId, chapterId) =>
        set((state) => ({
          readingProgress: new Map(state.readingProgress).set(comicId, chapterId),
        })),

      isBookmarked: (comicId) => get().bookmarks.has(comicId),

      getProgress: (comicId) => get().readingProgress.get(comicId),

      clearAll: () =>
        set({
          bookmarks: new Set(),
          readingProgress: new Map(),
        }),
    }),
    {
      name: "comicwise-bookmarks",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
