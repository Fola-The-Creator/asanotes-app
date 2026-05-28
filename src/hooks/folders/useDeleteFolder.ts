import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder, updateNote } from "@/lib/api";
import type { Folder, Note } from "@/types";

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const notes = queryClient.getQueryData<Note[]>(["notes"]) ?? [];
      const affectedNotes = notes.filter((n) => n.folderId === id);
      await Promise.all(affectedNotes.map((n) => updateNote(n.id, { folderId: null })));
      await deleteFolder(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Folder[]>(["folders"], (old) =>
        old ? old.filter((f) => f.id !== id) : [],
      );

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((n) =>
          n.folderId === id ? { ...n, folderId: null } : n,
        );
      });

      return { previousFolders, previousNotes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders"], context.previousFolders);
      }
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
