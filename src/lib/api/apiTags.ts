import type { Tag } from "@/types";
import { dummyTags } from "@/lib/dummy-data";

let tagsStore: Tag[] = [...dummyTags];

export async function getTags(): Promise<Tag[]> {
  return [...tagsStore];
}

export async function createTag(data: { name: string }): Promise<Tag> {
  const trimmed = data.name.trim().toLowerCase();
  if (!trimmed) throw new Error("Tag name cannot be empty");

  const duplicate = tagsStore.some(
    (t) => t.name.toLowerCase() === trimmed,
  );
  if (duplicate) throw new Error(`A tag named "${trimmed}" already exists`);

  const newTag: Tag = {
    id: `tag-${Date.now()}`,
    name: trimmed,
  };
  tagsStore = [newTag, ...tagsStore];
  return newTag;
}

export async function updateTag(
  id: string,
  updates: { name: string },
): Promise<Tag> {
  const trimmed = updates.name.trim().toLowerCase();
  if (!trimmed) throw new Error("Tag name cannot be empty");

  const duplicate = tagsStore.some(
    (t) => t.id !== id && t.name.toLowerCase() === trimmed,
  );
  if (duplicate) throw new Error(`A tag named "${trimmed}" already exists`);

  let updated: Tag | undefined;
  tagsStore = tagsStore.map((t) => {
    if (t.id === id) {
      updated = { ...t, name: trimmed };
      return updated;
    }
    return t;
  });
  if (!updated) throw new Error(`Tag ${id} not found`);
  return updated;
}

export async function deleteTag(id: string): Promise<void> {
  tagsStore = tagsStore.filter((t) => t.id !== id);
}
