import type { User } from "@/types";
import { dummyUser } from "@/lib/dummy-data";

export async function getUser(): Promise<User> {
  return { ...dummyUser };
}