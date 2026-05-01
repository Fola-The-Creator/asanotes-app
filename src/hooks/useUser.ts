import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/api";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
}
