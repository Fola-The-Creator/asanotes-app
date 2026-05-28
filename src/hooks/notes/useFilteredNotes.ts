import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useFilteredNotes(notes: Note[] | undefined = []) {
  const { viewType, selectedFolderId, selectedTagId, searchQuery, sortOption } =
    useAppStore();

  let filtered = [...notes].filter((note) => {
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

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.preview.toLowerCase().includes(query),
    );
  }

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
}
