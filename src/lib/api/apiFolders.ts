import type { Folder } from "@/types";
import { dummyFolders } from "@/lib/dummy-data";

let foldersStore: Folder[] = [...dummyFolders];

export async function getFolders(): Promise<Folder[]> {
  return [...foldersStore];
}

export async function createFolder(data: { name: string }): Promise<Folder> {
  const trimmed = data.name.trim();
  if (!trimmed) throw new Error("Folder name cannot be empty");

  const duplicate = foldersStore.some(
    (f) => f.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (duplicate) throw new Error(`A folder named "${trimmed}" already exists`);

  const newFolder: Folder = {
    id: `folder-${Date.now()}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  foldersStore = [newFolder, ...foldersStore];
  return newFolder;
}

export async function updateFolder(
  id: string,
  updates: { name: string },
): Promise<Folder> {
  const trimmed = updates.name.trim();
  if (!trimmed) throw new Error("Folder name cannot be empty");

  const duplicate = foldersStore.some(
    (f) => f.id !== id && f.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (duplicate) throw new Error(`A folder named "${trimmed}" already exists`);

  let updated: Folder | undefined;
  foldersStore = foldersStore.map((f) => {
    if (f.id === id) {
      updated = { ...f, name: trimmed, updatedAt: new Date().toISOString() };
      return updated;
    }
    return f;
  });
  if (!updated) throw new Error(`Folder ${id} not found`);
  return updated;
}

export async function deleteFolder(id: string): Promise<void> {
  foldersStore = foldersStore.filter((f) => f.id !== id);
}
