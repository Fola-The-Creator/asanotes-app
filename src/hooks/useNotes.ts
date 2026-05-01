import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  restoreNote,
  toggleNoteFavorite,
  toggleNotePinned,
  hardDeleteNote,
} from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { Note } from "@/types";

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const selectNewNote = useAppStore((state) => state.selectNewNote);

  return useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        return old ? [newNote, ...old] : [newNote];
      });
      if (selectNewNote) {
        selectNewNote(newNote.id);
      }
      useAppStore.getState().setNewNoteId(newNote.id);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Note> }) =>
      updateNote(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
            : note,
        );
      });

      return { previousNotes };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleNoteFavorite,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id ? { ...note, isFavorite: !note.isFavorite } : note,
        );
      });

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useTogglePinned() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleNotePinned,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note,
        );
      });

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useArchiveNote() {
  const queryClient = useQueryClient();
  const { selectedNoteId, setSelectedNote, setMobileView } =
    useAppStore.getState();

  return useMutation({
    mutationFn: archiveNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? { ...note, isArchived: true, isFavorite: false }
            : note,
        );
      });

      if (selectedNoteId === id) {
        setSelectedNote(null);
      }

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setMobileView("list");
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { selectedNoteId, setSelectedNote, setMobileView } =
    useAppStore.getState();

  return useMutation({
    mutationFn: deleteNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? {
                ...note,
                isDeleted: true,
                isFavorite: false,
                wasArchived: note.isArchived,
                isArchived: false,
                deletedAt: new Date().toISOString(),
              }
            : note,
        );
      });

      if (selectedNoteId === id) {
        setSelectedNote(null);
      }

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // setSelectedNote(null);
      setMobileView("list");
    },
  });
}

// Hard-deletes a note (removes it permanently from the store).
export function useHardDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hardDeleteNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      // Optimistically remove the note from the cache immediately
      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.filter((note) => note.id !== id);
      });

      // If this was the selected note, deselect and return to list view
      const { selectedNoteId, setSelectedNote, setMobileView } =
        useAppStore.getState();
      if (selectedNoteId === id) {
        setSelectedNote(null);
        setMobileView("list");
      }

      // Clear the new-note tracking flag
      useAppStore.getState().setNewNoteId(null);

      return { previousNotes };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useRestoreNote() {
  const queryClient = useQueryClient();
  const { setSelectedNote, setMobileView } = useAppStore.getState();

  return useMutation({
    mutationFn: restoreNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id
            ? {
                ...note,
                isDeleted: false,
                // Restore to previous location
                isArchived: note.wasArchived ?? false,
                deletedAt: null,
                wasArchived: false,
              }
            : note,
        );
      });

      // After restoring, deselect and return to list
      setSelectedNote(null);
      setMobileView("list");

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUnarchiveNote() {
  const queryClient = useQueryClient();
  const { selectedNoteId, setSelectedNote, setMobileView } =
    useAppStore.getState();

  return useMutation({
    mutationFn: unarchiveNote,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

      queryClient.setQueryData<Note[]>(["notes"], (old) => {
        if (!old) return old;
        return old.map((note) =>
          note.id === id ? { ...note, isArchived: false } : note,
        );
      });

      if (selectedNoteId === id) {
        setSelectedNote(null);
        setMobileView("list");
      }

      return { previousNotes };
    },
    onError: (err, id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
