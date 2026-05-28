import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/lib/api";
import type { Folder } from "@/types";

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
