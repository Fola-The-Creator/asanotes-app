import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveNote } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useArchiveNote() {
  const queryClient = useQueryClient();
  const { selectedNoteId, setSelectedNote, setMobileView } =
    useAppStore.getState();

  return useMutation({
    mutationFn: archiveNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? { ...note, isArchived: true, isFavorite: false }
            : note,
        );
      });

      if (selectedNoteId === id) {
        setSelectedNote(null);
      }

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setMobileView("list");
    },
  });
}
