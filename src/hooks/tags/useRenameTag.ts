import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag } from "@/lib/api";
import type { Tag } from "@/types";

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
