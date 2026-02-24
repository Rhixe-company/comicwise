import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UIState {
  activeModal: null | string;
  closeModal(): void;
  openModal(modalId: string): void;

  readingMode: "double" | "long-strip" | "single";
  searchOpen: boolean;

  setReadingMode(mode: "double" | "long-strip" | "single"): void;
  setSearchOpen(open: boolean): void;

  setSidebarOpen(open: boolean): void;
  setTheme(theme: "dark" | "light" | "system"): void;
  sidebarOpen: boolean;

  theme: "dark" | "light" | "system";
  toggleSearch(): void;
  toggleSidebar(): void;
}
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        toggleSidebar: () =>
          set((state: { sidebarOpen: boolean }) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

        theme: "system",
        setTheme: (theme: "dark" | "light" | "system") => set({ theme }),

        readingMode: "single",
        setReadingMode: (mode: "double" | "long-strip" | "single") => set({ readingMode: mode }),

        activeModal: null,
        openModal: (modalId: string) => set({ activeModal: modalId }),
        closeModal: () => set({ activeModal: null }),

        searchOpen: false,
        toggleSearch: () =>
          set((state: { searchOpen: boolean }) => ({ searchOpen: !state.searchOpen })),
        setSearchOpen: (open: boolean) => set({ searchOpen: open }),
      }),
      {
        name: "ui-store",
        partialize: (state) => ({
          theme: state.theme,
          readingMode: state.readingMode,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: "comicwise-ui" }
  )
);
