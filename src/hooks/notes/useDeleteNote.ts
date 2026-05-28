import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { selectedNoteId, setSelectedNote, setMobileView } =
    useAppStore.getState();

  return useMutation({
    mutationFn: deleteNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? {
                ...note,
                isDeleted: true,
                isFavorite: false,
                wasArchived: note.isArchived,
                isArchived: false,
                deletedAt: new Date().toISOString(),
              }
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
