import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/lib/api";
import type { Note } from "@/types";

export function useAssignNoteTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, tagIds }: { noteId: string; tagIds: string[] }) =>
      updateNote(noteId, { tags: tagIds }),
    onMutate: async ({ noteId, tagIds }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((n) =>
          n.id === noteId
            ? { ...n, tags: tagIds, updatedAt: new Date().toISOString() }
            : n,
        );
      });

      return { previousNotes };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
