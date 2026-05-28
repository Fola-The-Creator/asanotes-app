import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag } from "@/lib/api";
import type { Tag } from "@/types";

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
