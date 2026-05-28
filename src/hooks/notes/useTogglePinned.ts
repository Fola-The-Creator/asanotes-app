import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleNotePinned } from "@/lib/api";
import type { Note } from "@/types";

export function useTogglePinned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleNotePinned,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note,
        );
      });

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
