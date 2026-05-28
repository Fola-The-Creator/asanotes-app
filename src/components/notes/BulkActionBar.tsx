"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Trash2,
  FolderInput,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { useSelectionStore } from "@/store/useSelectionStore";
import type React from "react";

interface BulkActionBarProps {
  allIds: string[];
  onDelete: (ids: string[]) => void;
  onMoveTo: (ids: string[]) => void;
  onEditTags: (ids: string[]) => void;
}

/** Floating glass action bar at the bottom of the notes list panel */
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
  const { viewType } = useAppStore();

  const isVisible = selectionMode && selectionTarget === "note";
  const count = selectedIds.size;
  const ids = Array.from(selectedIds);

  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const noneSelected = count === 0;
  const isTrash = viewType === "trash";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="absolute max-lg:-bottom-4 bottom-6 left-3 right-3 z-20"
        >
          <div className="glass backdrop-blur-xl rounded-2xl shadow-lg border border-grey-200/40">
            {/* Top row: Selection info + dismiss */}
            <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[13px] font-semibold text-grey-800 tabular-nums whitespace-nowrap">
                  {count} {count === 1 ? "note" : "notes"} selected
                </span>

                <button
                  onClick={() =>
                    allSelected ? selectAll([]) : selectAll(allIds)
                  }
                  className="text-[12px] text-accent-500 hover:text-accent-400 font-medium whitespace-nowrap transition-colors"
                >
                  {allSelected ? "Deselect all" : noneSelected ? "Select all" : "Select all"}
                </button>
              </div>

              {/* Dismiss button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={exitSelectionMode}
                className="w-7 h-7 rounded-full flex items-center justify-center text-grey-400 hover:bg-grey-200/70 hover:text-grey-700 transition-colors shrink-0"
                aria-label="Cancel selection"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Separator */}
            <div className="h-px bg-grey-200/50 mx-3" />

            {/* Bottom row: Action buttons — wraps gracefully */}
            <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5">
              {isTrash ? (
                <BulkActionButton
                  icon={Trash2}
                  label="Permanently delete"
                  onClick={() => onDelete(ids)}
                  disabled={noneSelected}
                  destructive
                />
              ) : (
                <>
                  <BulkActionButton
                    icon={TagIcon}
                    label="Tags"
                    onClick={() => onEditTags(ids)}
                    disabled={noneSelected}
                  />
                  <BulkActionButton
                    icon={FolderInput}
                    label="Move to"
                    onClick={() => onMoveTo(ids)}
                    disabled={noneSelected}
                  />
                  <BulkActionButton
                    icon={Trash2}
                    label="Delete"
                    onClick={() => onDelete(ids)}
                    disabled={noneSelected}
                    destructive
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface BulkActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

function BulkActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  destructive,
}: BulkActionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
        "text-[12px] font-medium transition-colors disabled:opacity-35 disabled:pointer-events-none",
        destructive
          ? "text-destructive hover:bg-destructive/10"
          : "text-grey-700 hover:bg-grey-200/60 hover:text-grey-900",
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </motion.button>
  );
}

