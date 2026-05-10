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
  Square,
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
import { useLongPress } from "@/hooks/useLongPress";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      {...(isNoteSelectionMode
        ? { onClick: handleCardClick }
        : longPressHandlers)}
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-colors mb-1",
        isMultiSelected
          ? "bg-accent-500/10 border border-accent-500/40"
          : isSelected
            ? "bg-accent-500/7 border border-accent-500/30"
            : "hover:bg-grey-100 border border-transparent",
      )}
    >
      {/* Checkbox overlay in selection mode */}
      <AnimatePresence>
        {isNoteSelectionMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.1 }}
            className="absolute left-2 top-3.5"
          >
            {isMultiSelected ? (
              <CheckSquare className="w-4 h-4 text-accent-500" />
            ) : (
              <Square className="w-4 h-4 text-grey-400" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title row */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 mb-1",
          isNoteSelectionMode && "pl-6",
        )}
      >
        <h3
          className={cn(
            "font-medium text-sm line-clamp-1 break-words min-w-0",
            isSelected ? "text-grey-900" : "text-grey-800",
          )}
        >
          {note.title || "Untitled"}
        </h3>
        {note.isPinned && !isInTrash && (
          <Pin className="w-3 h-3 shrink-0 text-accent-500 fill-accent-500/20" />
        )}
      </div>

      {/* Preview */}
      <p
        className={cn(
          "text-xs text-grey-600 line-clamp-2 mb-2 break-words",
          isNoteSelectionMode && "pl-6",
        )}
      >
        {note.preview}
      </p>

      {/* Tag pills */}
      {noteTags.length > 0 && !isInTrash && (
        <div
          className={cn(
            "flex items-center gap-1 flex-wrap mb-2",
            isNoteSelectionMode && "pl-6",
          )}
        >
          {noteTags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-grey-200 text-grey-600"
            >
              #{tag.name}
            </span>
          ))}
          {noteTags.length > 2 && (
            <span className="text-[10px] text-grey-500">
              +{noteTags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className={cn(
          "flex items-center justify-between",
          isNoteSelectionMode && "pl-6",
        )}
      >
        <span className="text-[10px] text-grey-500">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>

        {/* Hide actions while in selection mode */}
        {!isNoteSelectionMode && (
          <div className="flex items-center gap-1">
            {/* TRASH context */}
            {isInTrash ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="w-6 h-6 text-grey-500 hover:text-grey-900"
                  >
                    <MoreHorizontal className="w-3 h-3" />
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
                {/* Favorite star — active and archive views */}
                {!isInArchive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    className="w-6 h-6 text-grey-500 hover:text-accent-500"
                  >
                    <Star
                      className={cn(
                        "w-3 h-3",
                        note.isFavorite && "fill-accent-500 text-accent-500",
                      )}
                    />
                  </Button>
                )}

                {/* ARCHIVE context */}
                {isInArchive ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                        className="w-6 h-6 text-grey-500 hover:text-grey-900"
                      >
                        <MoreHorizontal className="w-3 h-3" />
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
                        className="w-6 h-6 text-grey-500 hover:text-grey-900"
                      >
                        <MoreHorizontal className="w-3 h-3" />
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
    </motion.div>
  );
}
