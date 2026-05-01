import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, createTag, updateTag, deleteTag } from "@/lib/api";
import { updateNote } from "@/lib/api";
import type { Tag, Note } from "@/types";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createTag({ name }),
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ["tags"] });
      const previousTags = queryClient.getQueryData<Tag[]>(["tags"]);

      const optimisticTag: Tag = {
        id: `tag-optimistic-${Date.now()}`,
        name: name.trim().toLowerCase(),
      };

      queryClient.setQueryData<Tag[]>(["tags"], (old) =>
        old ? [optimisticTag, ...old] : [optimisticTag],
      );

      return { previousTags };
    },
    onError: (_err, _name, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useRenameTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateTag(id, { name }),
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ["tags"] });
      const previousTags = queryClient.getQueryData<Tag[]>(["tags"]);

      queryClient.setQueryData<Tag[]>(["tags"], (old) => {
        if (!old) return old;
        return old.map((t) =>
          t.id === id ? { ...t, name: name.trim().toLowerCase() } : t,
        );
      });

      return { previousTags };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(["tags"], context.previousTags);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Remove tag from any notes that have it
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

      // Remove tag optimistically
      queryClient.setQueryData<Tag[]>(["tags"], (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );

      // Remove tag from all notes optimistically
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

// Assigns a new set of tag IDs to a specific note.
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
