import { Clock, Calendar, SortAsc } from "lucide-react";
import type { ViewType, SortOption } from "@/types";
import type React from "react";

export const PINNED_SECTION_VIEWS: ViewType[] = ["all", "favorites", "folder", "tag"];
export const TRASH_EXPIRY_DAYS = 30;

export const viewTitles: Record<ViewType, string> = {
  all: "All Notes",
  favorites: "Favorites",
  archive: "Archive",
  trash: "Trash",
  folder: "Folder",
  tag: "Tag",
};

export const sortOptions: {
  value: SortOption;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "recent", label: "Recently Updated", icon: Clock },
  { value: "created", label: "Date Created", icon: Calendar },
  { value: "alphabetical", label: "Alphabetical", icon: SortAsc },
];
