export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  folderId: string | null;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  isPinned: boolean;
  // ISO timestamp set when the note is moved to Trash. Used for 30-day auto-deletion.
  deletedAt?: string | null;
  // Remembers if the note was archived before being trashed, so restore returns it to the right location.
  wasArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = "recent" | "alphabetical" | "created";
export type ViewType =
  | "all"
  | "favorites"
  | "archive"
  | "trash"
  | "folder"
  | "tag";
export type MobileView = "list" | "editor";

// // Settings
export type ThemeMode = "light" | "dark" | "system";
export type SaveTrigger = "instant" | "blur";

export interface Settings {
  // Appearance
  themeMode: ThemeMode;

  // Editor
  editorFontSize: number; // 14 | 16 | 18 | 20 (px)

  // Behavior
  autoOpenNewNote: boolean;
  saveTrigger: SaveTrigger;
  reduceMotion: boolean;

  // Notes management
  trashExpiryDays: number; // 7 | 14 | 30 | 60 | 90
  confirmDestructiveActions: boolean;
}

// // App State
export interface AppState {
  // Notes
  selectedNoteId: string | null;

  // Folders
  selectedFolderId: string | null;

  // Tags
  selectedTagId: string | null;

  // UI State
  viewType: ViewType;
  sortOption: SortOption;
  searchQuery: string;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  settingsOpen: boolean;

  // Mobile UI State
  mobileMenuOpen: boolean;
  mobileView: MobileView;

  // Actions
  setSelectedNote: (id: string | null) => void;
  setSelectedFolder: (id: string | null) => void;
  setSelectedTag: (id: string | null) => void;
  setViewType: (type: ViewType) => void;
  setSortOption: (option: SortOption) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  openSettings: () => void;
  closeSettings: () => void;

  // Mobile Actions
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  setMobileView: (view: MobileView) => void;

  // Note Actions (UI side-effects only)
  selectNewNote: (id: string) => void;

  // Tracks the ID of a freshly-created note that has not yet received content.
  // Cleared the moment the user types anything meaningful, or the note is deleted.
  newNoteId: string | null;
  setNewNoteId: (id: string | null) => void;
}
