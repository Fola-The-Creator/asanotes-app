import type { Note } from "@/types";

export function useRecentNotes(notes: Note[] | undefined = []) {
  return [...notes]
    .filter((note) => !note.isArchived && !note.isDeleted)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);
}
