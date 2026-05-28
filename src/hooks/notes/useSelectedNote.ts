import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useSelectedNote(notes: Note[] | undefined = []) {
  const { selectedNoteId } = useAppStore();
  return notes.find((note) => note.id === selectedNoteId) || null;
}
