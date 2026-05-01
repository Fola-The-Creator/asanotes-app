"use client";

import { useState, useRef, useEffect } from "react";
import {
  FolderClosed,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import type { Folder } from "@/types";

interface SidebarFolderItemProps {
  folder: Folder;
  noteCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  compact?: boolean;
}

export function SidebarFolderItem({
  folder,
  noteCount,
  isSelected,
  onSelect,
  onRename,
  onDelete,
  compact = false,
}: SidebarFolderItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus rename input
  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== folder.name) {
      onRename(trimmed);
    }
    setIsRenaming(false);
  };

  const cancelRename = () => {
    setRenameValue(folder.name);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelRename();
    }
  };

  if (isRenaming) {
    return (
      <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-grey-100">
        <FolderClosed className="w-4 h-4 shrink-0 text-grey-500" />
        <input
          ref={inputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitRename}
          className="flex-1 min-w-0 text-sm bg-transparent text-grey-900 outline-none"
          maxLength={100}
        />
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            commitRename();
          }}
          className="p-0.5 text-grey-500 hover:text-green-600 rounded"
          aria-label="Confirm rename"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            cancelRename();
          }}
          className="p-0.5 text-grey-500 hover:text-destructive rounded"
          aria-label="Cancel rename"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        isSelected
          ? "bg-grey-200 text-grey-900"
          : "text-grey-600 hover:bg-grey-100 hover:text-grey-900",
        compact && "py-1.5",
      )}
    >
      {/* Clickable area */}
      <button
        onClick={onSelect}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <FolderClosed
          className={cn(
            "w-4 h-4 shrink-0 text-grey-500",
            isSelected ? "text-grey-900" : "group-hover:text-grey-900",
          )}
        />
        <span className="flex-1 truncate max-w-[150px]">{folder.name}</span>
      </button>

      {/* Note count — hidden on hover for desktop, always hidden on touch (menu replaces it) */}
      <span
        className={cn(
          "text-xs text-grey-500 shrink-0 transition-opacity",
          "group-hover:opacity-0 [@media(hover:none)]:hidden",
        )}
      >
        {noteCount}
      </span>

      {/* Context menu — opacity-0 on desktop until hover; always visible on touch */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button
            className={cn(
              "absolute right-2 p-1 rounded text-grey-500 hover:text-grey-900 hover:bg-grey-200 transition-opacity",
              "opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100",
            )}
            aria-label={`Options for ${folder.name}`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setRenameValue(folder.name);
              setIsRenaming(true);
            }}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Rename
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
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
