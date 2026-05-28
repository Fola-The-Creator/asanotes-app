import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hardDeleteNote } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useHardDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.filter((note) => note.id !== id);
      });

      const { selectedNoteId, setSelectedNote, setMobileView } =
        useAppStore.getState();
      if (selectedNoteId === id) {
        setSelectedNote(null);
        setMobileView("list");
      }

      useAppStore.getState().setNewNoteId(null);

      return { previousNotes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
