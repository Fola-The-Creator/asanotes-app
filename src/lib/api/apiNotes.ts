import type { Note } from "@/types";
import { dummyNotes } from "@/lib/dummy-data";
import { TRASH_EXPIRY_DAYS } from "@/constants";

// In-memory store
let notesStore: Note[] = [...dummyNotes];

// Purge notes that have been in the Trash for more than 30 days.
function purgeExpiredNotes(): void {
  const cutoff = Date.now() - TRASH_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  notesStore = notesStore.filter((note) => {
    if (!note.isDeleted) return true;
    if (!note.deletedAt) return true;
    return new Date(note.deletedAt).getTime() > cutoff;
  });
}

export async function getNotes(): Promise<Note[]> {
  purgeExpiredNotes();
  return [...notesStore];
}

export async function createNote(
  data: Partial<Note> & { folderId?: string | null },
): Promise<Note> {
  const newNote: Note = {
    id: `note-${Date.now()}`,
    title: "Untitled Note",
    content: "",
    preview: "",
    folderId: data.folderId ?? null,
    tags: [],
    isFavorite: false,
    isArchived: false,
    isDeleted: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
  notesStore = [newNote, ...notesStore];
  return newNote;
}

export async function updateNote(
  id: string,
  updates: Partial<Note>,
): Promise<Note> {
  let updated: Note | undefined;
  notesStore = notesStore.map((note) => {
    if (note.id === id) {
      updated = { ...note, ...updates, updatedAt: new Date().toISOString() };
      return updated;
    }
    return note;
  });
  if (!updated) throw new Error(`Note ${id} not found`);
  return updated;
}

export async function toggleNoteFavorite(id: string): Promise<Note> {
  let updated: Note | undefined;
  notesStore = notesStore.map((note) => {
    if (note.id === id) {
      updated = { ...note, isFavorite: !note.isFavorite };
      return updated;
    }
    return note;
  });
  if (!updated) throw new Error(`Note ${id} not found`);
  return updated;
}

export async function toggleNotePinned(id: string): Promise<Note> {
  let updated: Note | undefined;
  notesStore = notesStore.map((note) => {
    if (note.id === id) {
      updated = { ...note, isPinned: !note.isPinned };
      return updated;
    }
    return note;
  });
  if (!updated) throw new Error(`Note ${id} not found`);
  return updated;
}

export async function archiveNote(id: string): Promise<Note> {
  return updateNote(id, { isArchived: true, isFavorite: false });
}

export async function deleteNote(id: string): Promise<Note> {
  // Capture wasArchived so we can restore to the correct location later
  const note = notesStore.find((n) => n.id === id);
  return updateNote(id, {
    isDeleted: true,
    isFavorite: false,
    wasArchived: note?.isArchived ?? false,
    isArchived: false,
    deletedAt: new Date().toISOString(),
  });
}

// Moves an archived note back to Active notes only.
export async function unarchiveNote(id: string): Promise<Note> {
  return updateNote(id, { isArchived: false });
}

// Restores a note from Trash to its previous location
export async function restoreNote(id: string): Promise<Note> {
  const note = notesStore.find((n) => n.id === id);
  return updateNote(id, {
    isDeleted: false,
    isArchived: note?.wasArchived ?? false,
    deletedAt: null,
    wasArchived: false,
  });
}

// Permanently removes a note from the store.
export async function hardDeleteNote(id: string): Promise<void> {
  notesStore = notesStore.filter((note) => note.id !== id);
}
