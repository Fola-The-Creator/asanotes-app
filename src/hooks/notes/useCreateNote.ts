import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import type { Note } from "@/types";

export function useCreateNote() {
  const queryClient = useQueryClient();
  const selectNewNote = useAppStore((state) => state.selectNewNote);

  return useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        return old ? [newNote, ...old] : [newNote];
      });
      const { autoOpenNewNote } = useSettingsStore.getState().settings;
      if (autoOpenNewNote && selectNewNote) {
        selectNewNote(newNote.id);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
