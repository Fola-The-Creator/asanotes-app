import { useQuery } from "@tanstack/react-query";
import { getFolders } from "@/lib/api";

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
}
