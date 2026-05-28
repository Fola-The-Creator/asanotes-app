"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Archive,
  ArchiveRestore,
  Trash2,
  MoreHorizontal,
  FolderInput,
  Undo2,
  Pin,
  PinOff,
  Tag as TagIcon,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { formatDistanceToNow } from "date-fns";
import type { Note, Tag, ViewType } from "@/types";
import { Button } from "@/components/ui/Button";
import { useSelectionStore } from "@/store/useSelectionStore";
import { useLongPress } from "@/hooks";

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  index: number;
  viewType: ViewType;
  tags: Tag[];
  onSelect: () => void;
  onToggleFavorite: () => void;
  onTogglePin: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onHardDelete: () => void;
  onEditTags: () => void;
  onMoveTo: () => void;
}

export function NoteCard({
  note,
  isSelected,
  index,
  viewType,
  tags,
  onSelect,
  onToggleFavorite,
  onTogglePin,
  onArchive,
  onUnarchive,
  onDelete,
  onRestore,
  onHardDelete,
  onEditTags,
  onMoveTo,
}: NoteCardProps) {
  const { selectionMode, selectionTarget, selectedIds, enterSelectionMode, toggleId } =
    useSelectionStore();

  const noteTags = tags.filter((t) => note.tags.includes(t.id));
  const isInTrash = note.isDeleted;
  const isInArchive = note.isArchived && !note.isDeleted;

  const isNoteSelectionMode = selectionMode && selectionTarget === "note";
  const isMultiSelected = isNoteSelectionMode && selectedIds.has(note.id);

  const handleEnterSelection = () => {
    enterSelectionMode("note", note.id);
  };

  const longPressHandlers = useLongPress(handleEnterSelection, onSelect);

  const handleCardClick = () => {
    if (isNoteSelectionMode) {
      toggleId(note.id);
    } else {
      onSelect();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", damping: 32, stiffness: 380, delay: index * 0.018 }}
      {...(isNoteSelectionMode ? { onClick: handleCardClick } : longPressHandlers)}
      className={cn(
        "group relative rounded-md cursor-pointer mb-1.5 overflow-hidden",
        // "transition-[box-shadow,border-color,transform,background-color] duration-200 ease-out",
        "bg-card/70 border border-border",
        isMultiSelected
          ? "border-accent-500/60 bg-accent-500/4"
          : isSelected
            ? "border-accent-500/22"
            : "",
      )}
    >

      {/* Checkbox — selection mode */}
      <AnimatePresence>
        {isNoteSelectionMode && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ type: "spring", damping: 28, stiffness: 400 }}
            className="absolute left-3 top-3 z-10"
          >
            <div
              className={cn(
                "w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-colors duration-150",
                isMultiSelected
                  ? "bg-accent-500 border-accent-500"
                  : "bg-transparent border-grey-400",
              )}
            >
              <AnimatePresence>
                {isMultiSelected && (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 24, stiffness: 500 }}
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className={cn("p-3", note.isPinned && !isInTrash && "pl-[18px]")}>
        {/* Title row */}
        <div
          className={cn(
            "flex items-center justify-between gap-2 mb-1",
            isNoteSelectionMode && "pl-7",
          )}
        >
          <h3
            className={cn(
              "font-semibold text-[13px] leading-snug line-clamp-1 min-w-0",
              isSelected ? "text-grey-900" : "text-grey-800",
            )}
          >
            {note.title || "Untitled"}
          </h3>

          {/* Favorite star */}
          {!isInTrash && !isNoteSelectionMode && !isInArchive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={cn(
                "shrink-0 transition-all duration-150 rounded p-0.5",
                note.isFavorite
                  ? "opacity-100 text-accent-500"
                  : "text-grey-500 hover:text-accent-500",
              )}
            >
              <Star
                className={cn(
                  "w-3.5 h-3.5",
                  note.isFavorite && "fill-accent-500",
                )}
              />
            </button>
          )}
        </div>

        {/* Preview */}
        <p
          className={cn(
            "text-[12px] leading-[1.55] text-grey-500 line-clamp-2 mb-2",
            isNoteSelectionMode && "pl-7",
          )}
        >
          {note.preview || "No additional text"}
        </p>

        {/* Tag pills */}
        {noteTags.length > 0 && !isInTrash && (
          <div
            className={cn(
              "flex items-center gap-1 flex-wrap mb-2",
              isNoteSelectionMode && "pl-7",
            )}
          >
            {noteTags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="tag-pill">
                #{tag.name}
              </span>
            ))}
            {noteTags.length > 2 && (
              <span className="text-[11px] text-grey-500">
                +{noteTags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className={cn(
            "flex items-center justify-between",
            isNoteSelectionMode && "pl-7",
          )}
        >
          <span className="text-[11px] text-grey-500 tabular-nums">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>

          {/* Actions */}
          {!isNoteSelectionMode && (
            <div
              className={cn(
                "flex items-center gap-0.5 duration-150",
              )}
            >
              {/* TRASH context */}
              {isInTrash ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded-xs text-grey-500 hover:text-grey-800"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore();
                      }}
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      Restore note
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        enterSelectionMode("note", note.id);
                      }}
                    >
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Select
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onHardDelete();
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Permanently delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  {/* ARCHIVE context */}
                  {isInArchive ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                          className="w-6 h-6 rounded-xs text-grey-500 hover:text-grey-800"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnarchive();
                          }}
                        >
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Unarchive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTags();
                          }}
                        >
                          <TagIcon className="w-4 h-4 mr-2" />
                          {note.tags.length > 0 ? "Edit tags" : "Add tags"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveTo();
                          }}
                        >
                          <FolderInput className="w-4 h-4 mr-2" />
                          Move to folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            enterSelectionMode("note", note.id);
                          }}
                        >
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Select
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Move to trash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    /* ACTIVE context */
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => e.stopPropagation()}
                          className="w-6 h-6 rounded-xs text-grey-500 hover:text-grey-800"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin();
                          }}
                        >
                          {note.isPinned ? (
                            <PinOff className="w-4 h-4 mr-2" />
                          ) : (
                            <Pin className="w-4 h-4 mr-2" />
                          )}
                          {note.isPinned ? "Unpin note" : "Pin note"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTags();
                          }}
                        >
                          <TagIcon className="w-4 h-4 mr-2" />
                          {note.tags.length > 0 ? "Edit tags" : "Add tags"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveTo();
                          }}
                        >
                          <FolderInput className="w-4 h-4 mr-2" />
                          Move to folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            enterSelectionMode("note", note.id);
                          }}
                        >
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Select
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchive();
                          }}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Move to trash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
