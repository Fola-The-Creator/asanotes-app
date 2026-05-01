import { motion } from "motion/react";
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
  const noteTags = tags.filter((t) => note.tags.includes(t.id));

  // Determine context based on note state
  const isInTrash = note.isDeleted;
  const isInArchive = note.isArchived && !note.isDeleted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      onClick={onSelect}
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-colors mb-1",
        isSelected
          ? "bg-accent-500/7 border border-accent-500/30"
          : "hover:bg-grey-100 border border-transparent",
      )}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3
          className={cn(
            "font-medium text-sm line-clamp-1",
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
      <p className="text-xs text-grey-600 line-clamp-2 mb-2">{note.preview}</p>

      {/* Tag pills */}
      {noteTags.length > 0 && !isInTrash && (
        <div className="flex items-center gap-1 flex-wrap mb-2">
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
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-grey-500">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>

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
              {/* Favorite star — shown for Active + Archive */}
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
                    {/* Unarchive — primary action */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnarchive();
                      }}
                    >
                      <ArchiveRestore className="w-4 h-4 mr-2" />
                      Unarchive
                    </DropdownMenuItem>

                    {/* Tags */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTags();
                      }}
                    >
                      <TagIcon className="w-4 h-4 mr-2" />
                      {note.tags.length > 0 ? "Edit tags" : "Add tags"}
                    </DropdownMenuItem>

                    {/* Move to */}
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

                    {/* Delete (move to Trash) */}
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
                    {/* Pin */}
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

                    {/* Tags */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTags();
                      }}
                    >
                      <TagIcon className="w-4 h-4 mr-2" />
                      {note.tags.length > 0 ? "Edit tags" : "Add tags"}
                    </DropdownMenuItem>

                    {/* Move to */}
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

                    {/* Archive */}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive();
                      }}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>

                    {/* Delete */}
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
      </div>
    </motion.div>
  );
}
