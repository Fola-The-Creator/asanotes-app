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
  deletedAt?: string | null;
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
