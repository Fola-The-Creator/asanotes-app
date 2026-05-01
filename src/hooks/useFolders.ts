import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/lib/api";
import { updateNote } from "@/lib/api";
import type { Folder, Note } from "@/types";

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createFolder({ name }),
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

      const optimisticFolder: Folder = {
        id: `folder-optimistic-${Date.now()}`,
        name: name.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Folder[]>(["folders"], (old) =>
        old ? [optimisticFolder, ...old] : [optimisticFolder],
      );

      return { previousFolders };
    },
    onError: (_err, _name, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders"], context.previousFolders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useRenameFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateFolder(id, { name }),
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData<Folder[]>(["folders"]);

      queryClient.setQueryData<Folder[]>(["folders"], (old) => {
        if (!old) return old;
        return old.map((f) =>
          f.id === id
            ? { ...f, name: name.trim(), updatedAt: new Date().toISOString() }
            : f,
        );
      });

      return { previousFolders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders"], context.previousFolders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Uncategorize notes that belong to this folder
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

      // Remove the folder optimistically
      queryClient.setQueryData<Folder[]>(["folders"], (old) =>
        old ? old.filter((f) => f.id !== id) : [],
      );

      // Uncategorize notes optimistically
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
