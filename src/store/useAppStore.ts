import { create } from "zustand";
import type { AppState, Note, ViewType, MobileView } from "@/types";

export const useAppStore = create<AppState>((set) => ({
  // Initial State
  selectedNoteId: null,
  selectedFolderId: null,
  selectedTagId: null,
  viewType: "all",
  sortOption: "recent",
  searchQuery: "",
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  settingsOpen: false,
  mobileMenuOpen: false,
  mobileView: "list" as MobileView,

  // Setters
  setSelectedNote: (id) => set({ selectedNoteId: id }),
  setSelectedFolder: (id) =>
    set({
      selectedFolderId: id,
      viewType: "folder" as ViewType,
      selectedTagId: null,
      mobileMenuOpen: false,
      mobileView: "list" as MobileView,
    }),
  setSelectedTag: (id) =>
    set({
      selectedTagId: id,
      viewType: "tag" as ViewType,
      selectedFolderId: null,
      mobileMenuOpen: false,
      mobileView: "list" as MobileView,
    }),
  setViewType: (type) =>
    set({
      viewType: type,
      selectedNoteId: null,
      selectedFolderId: null,
      selectedTagId: null,
      mobileMenuOpen: false,
      mobileView: "list" as MobileView,
    }),
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  setMobileView: (view) => set({ mobileView: view }),
  setSortOption: (option) => set({ sortOption: option }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),

  // Note UI Actions
  selectNewNote: (id) =>
    set({
      selectedNoteId: id,
      mobileView: "editor" as MobileView,
      mobileMenuOpen: false,
    }),
}));
