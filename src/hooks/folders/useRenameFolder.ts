import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFolder } from "@/lib/api";
import type { Folder } from "@/types";

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
