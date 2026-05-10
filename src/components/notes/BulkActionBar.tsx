"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Trash2,
  FolderInput,
  Tag as TagIcon,
  X,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSelectionStore } from "@/store/useSelectionStore";

interface BulkActionBarProps {
  allIds: string[];
  onDelete: (ids: string[]) => void;
  onMoveTo: (ids: string[]) => void;
  onEditTags: (ids: string[]) => void;
}

export function BulkActionBar({
  allIds,
  onDelete,
  onMoveTo,
  onEditTags,
}: BulkActionBarProps) {
  const {
    selectionMode,
    selectionTarget,
    selectedIds,
    exitSelectionMode,
    selectAll,
  } = useSelectionStore();

  const isVisible = selectionMode && selectionTarget === "note";
  const count = selectedIds.size;
  const ids = Array.from(selectedIds);

  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="absolute top-0 inset-x-0 z-20 px-3 py-5.5 bg-grey-50 border-b border-grey-200 flex flex-col gap-2"
        >
          {/* Top row: count + select all + dismiss */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-grey-700">
              {count} {count === 1 ? "note" : "notes"} selected
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  allSelected ? selectAll([]) : selectAll(allIds)
                }
                className={cn(
                  "text-xs px-2 py-1 rounded-md transition-colors",
                  allSelected
                    ? "text-accent-500 bg-accent-500/10"
                    : "text-grey-600 hover:bg-grey-100",
                )}
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={exitSelectionMode}
                className="w-7 h-7 text-grey-500 hover:text-grey-900"
                aria-label="Cancel selection"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditTags(ids)}
              disabled={count === 0}
              className="flex-1 justify-center gap-1.5 border border-grey-300 text-grey-600 hover:text-grey-900 hover:bg-grey-100"
            >
              <TagIcon className="w-4 h-4" />
              <span className="text-xs">Tags</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveTo(ids)}
              disabled={count === 0}
              className="flex-1 justify-center gap-1.5 border border-grey-300 text-grey-600 hover:text-grey-900 hover:bg-grey-100"
            >
              <FolderInput className="w-4 h-4" />
              <span className="text-xs">Move</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(ids)}
              disabled={count === 0}
              className="flex-1 justify-center gap-1.5 border border-grey-300 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-xs">Delete</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Standalone icon button used inside the notes list header to enter selection mode
export function SelectionToggleButton() {
  const {
    selectionMode,
    selectionTarget,
    enterSelectionMode,
    exitSelectionMode,
  } = useSelectionStore();

  const active = selectionMode && selectionTarget === "note";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        active ? exitSelectionMode() : enterSelectionMode("note")
      }
      className={cn(
        "w-8 h-8",
        active
          ? "text-accent-500 bg-accent-500/10"
          : "text-grey-600 hover:text-grey-900",
      )}
      aria-label={active ? "Cancel selection" : "Select notes"}
    >
      <CheckSquare className="w-4 h-4" />
    </Button>
  );
}
