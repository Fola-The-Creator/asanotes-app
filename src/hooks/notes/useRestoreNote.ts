import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreNote } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useRestoreNote() {
  const queryClient = useQueryClient();
  const { setSelectedNote, setMobileView } = useAppStore.getState();

  return useMutation({
    mutationFn: restoreNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? {
                ...note,
                isDeleted: false,
                isArchived: note.wasArchived ?? false,
                deletedAt: null,
                wasArchived: false,
              }
            : note,
        );
      });

      setSelectedNote(null);
      setMobileView("list");

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
