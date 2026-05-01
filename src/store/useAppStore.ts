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

  // Note UI Actions
  selectNewNote: (id) =>
    set({
      selectedNoteId: id,
      mobileView: "editor" as MobileView,
      mobileMenuOpen: false,
    }),

  // Tracks whether the currently selected note was just created (no content yet)
  newNoteId: null,
  setNewNoteId: (id) => set({ newNoteId: id }),
}));

// Selectors
export const useFilteredNotes = (notes: Note[] | undefined = []) => {
  const { viewType, selectedFolderId, selectedTagId, searchQuery, sortOption } =
    useAppStore();

  let filtered = [...notes].filter((note) => {
    // Filter by view type
    switch (viewType) {
      case "favorites":
        return note.isFavorite && !note.isArchived && !note.isDeleted;
      case "archive":
        return note.isArchived && !note.isDeleted;
      case "trash":
        return note.isDeleted;
      case "folder":
        return (
          note.folderId === selectedFolderId &&
          !note.isArchived &&
          !note.isDeleted
        );
      case "tag":
        return (
          note.tags.includes(selectedTagId || "") &&
          !note.isArchived &&
          !note.isDeleted
        );
      case "all":
      default:
        return !note.isArchived && !note.isDeleted;
    }
  });

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.preview.toLowerCase().includes(query),
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortOption) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "created":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "recent":
      default:
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  });

  return filtered;
};

export const useSelectedNote = (notes: Note[] | undefined = []) => {
  const { selectedNoteId } = useAppStore();
  return notes.find((note) => note.id === selectedNoteId) || null;
};

export const useRecentNotes = (notes: Note[] | undefined = []) => {
  return [...notes]
    .filter((note) => !note.isArchived && !note.isDeleted)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);
};
