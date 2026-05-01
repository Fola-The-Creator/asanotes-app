"use client";

import { FolderClosed, Inbox } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useUpdateNote } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";
import type { Folder, Note } from "@/types";

interface MoveToModalProps {
  open: boolean;
  onClose: () => void;
  note: Note;
  folders: Folder[];
}

export function MoveToModal({ open, onClose, note, folders }: MoveToModalProps) {
  const updateNote = useUpdateNote();

  const handleMove = (folderId: string | null) => {
    if (folderId === note.folderId) {
      onClose();
      return;
    }
    updateNote.mutate({ id: note.id, updates: { folderId } });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xs p-0 gap-0 flex flex-col max-h-[70vh]">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-grey-200 shrink-0">
          <DialogTitle className="text-base">Move to folder</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="p-2 space-y-0.5">
            {/* Uncategorized option */}
            <button
              onClick={() => handleMove(null)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                note.folderId === null
                  ? "bg-grey-200 text-grey-900"
                  : "text-grey-600 hover:bg-grey-100 hover:text-grey-900",
              )}
            >
              <Inbox className="w-4 h-4 shrink-0 text-grey-500" />
              <span className="flex-1">Uncategorized</span>
              {note.folderId === null && (
                <span className="text-[10px] text-grey-500 bg-grey-200 px-1.5 py-0.5 rounded">
                  current
                </span>
              )}
            </button>

            {/* Folder list */}
            {folders.length === 0 && (
              <p className="text-xs text-grey-500 text-center py-4">
                No folders yet
              </p>
            )}

            {folders.map((folder) => {
              const isCurrent = note.folderId === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => handleMove(folder.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                    isCurrent
                      ? "bg-grey-200 text-grey-900"
                      : "text-grey-600 hover:bg-grey-100 hover:text-grey-900",
                  )}
                >
                  <FolderClosed className="w-4 h-4 shrink-0 text-grey-500" />
                  <span className="flex-1 truncate">{folder.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] text-grey-500 bg-grey-200 px-1.5 py-0.5 rounded shrink-0">
                      current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
