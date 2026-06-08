import type { ViewType, SortOption, MobileView } from "./note";

export interface AppState {
  selectedNoteId: string | null;
  selectedFolderId: string | null;
  selectedTagId: string | null;
  viewType: ViewType;
  sortOption: SortOption;
  searchQuery: string;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  settingsOpen: boolean;
  mobileMenuOpen: boolean;
  mobileView: MobileView;

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

  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  setMobileView: (view: MobileView) => void;

  selectNewNote: (id: string) => void;
}
