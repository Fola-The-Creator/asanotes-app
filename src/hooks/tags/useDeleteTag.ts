import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag, updateNote } from "@/lib/api";
import type { Tag, Note } from "@/types";

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const notes = queryClient.getQueryData<Note[]>(["notes"]) ?? [];
      const affectedNotes = notes.filter((n) => n.tags.includes(id));
      await Promise.all(
        affectedNotes.map((n) =>
          updateNote(n.id, { tags: n.tags.filter((t) => t !== id) }),
        ),
      );
      await deleteTag(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tags"] });
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      const previousTags = queryClient.getQueryData<Tag[]>(["tags"]);
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Tag[]>(["tags"], (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((n) =>
          n.tags.includes(id)
            ? { ...n, tags: n.tags.filter((t) => t !== id) }
            : n,
        );
      });

      return { previousTags, previousNotes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
