import { create } from "zustand";

type SelectionTarget = "note";

interface SelectionState {
  selectionMode: boolean;
  selectionTarget: SelectionTarget | null;
  selectedIds: Set<string>;

  enterSelectionMode: (target: SelectionTarget, initialId?: string) => void;
  exitSelectionMode: () => void;
  toggleId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectionMode: false,
  selectionTarget: null,
  selectedIds: new Set(),

  enterSelectionMode: (target, initialId) =>
    set({
      selectionMode: true,
      selectionTarget: target,
      selectedIds: initialId ? new Set([initialId]) : new Set(),
    }),

  exitSelectionMode: () =>
    set({ selectionMode: false, selectionTarget: null, selectedIds: new Set() }),

  toggleId: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),

  selectAll: (ids) => set({ selectedIds: new Set(ids) }),

  clearSelection: () => set({ selectedIds: new Set() }),
}));
