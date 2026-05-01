"use client";

import { useState, useRef, useEffect } from "react";
import { FolderClosed, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SidebarFolderItem } from "./SidebarFolderItem";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { useRenameFolder, useDeleteFolder } from "@/hooks/useFolders";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import type { Folder, Note } from "@/types";

interface FoldersModalProps {
  open: boolean;
  onClose: () => void;
  folders: Folder[];
  notes: Note[];
  onCreateFolder: (name: string) => void;
}

export function FoldersModal({
  open,
  onClose,
  folders,
  notes,
  onCreateFolder,
}: FoldersModalProps) {
  const { selectedFolderId, setSelectedFolder } = useAppStore();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();
  const { toast } = useToast();

  const [showAddInput, setShowAddInput] = useState(false);
  const [addValue, setAddValue] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (showAddInput) addInputRef.current?.focus();
  }, [showAddInput]);

  const getFolderNoteCount = (folderId: string) =>
    notes.filter(
      (n) => n.folderId === folderId && !n.isArchived && !n.isDeleted,
    ).length;

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowAddInput(false);
      setAddValue("");
    }
  };

  const commitAdd = () => {
    const trimmed = addValue.trim();
    if (!trimmed) {
      setShowAddInput(false);
      return;
    }
    const dup = folders.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (dup) {
      toast({ title: `"${trimmed}" already exists`, variant: "destructive" });
      return;
    }
    onCreateFolder(trimmed);
    setAddValue("");
    setShowAddInput(false);
  };

  const handleRename = (id: string, newName: string) => {
    const dup = folders.some(
      (f) => f.id !== id && f.name.toLowerCase() === newName.toLowerCase(),
    );
    if (dup) {
      toast({ title: `"${newName}" already exists`, variant: "destructive" });
      return;
    }
    renameFolder.mutate({ id, name: newName });
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    if (selectedFolderId === pendingDeleteId) setSelectedFolder(null);
    deleteFolder.mutate(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const pendingFolder = folders.find((f) => f.id === pendingDeleteId);
  const pendingNoteCount = pendingDeleteId
    ? getFolderNoteCount(pendingDeleteId)
    : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-sm p-0 gap-0 flex flex-col max-h-100">
          <DialogHeader className="px-4 pt-4 pb-3 border-b border-grey-200 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderClosed className="w-4 h-4 text-grey-500" />
                <DialogTitle className="text-base">All Folders</DialogTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddInput(true)}
                  className="w-7 h-7 text-grey-500 hover:text-grey-900"
                  aria-label="Add folder"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-7 h-7 text-grey-500 hover:text-grey-900"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-0.5">
              {showAddInput && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-grey-100 mb-1">
                  <FolderClosed className="w-4 h-4 shrink-0 text-grey-500" />
                  <input
                    ref={addInputRef}
                    value={addValue}
                    onChange={(e) => setAddValue(e.target.value)}
                    onKeyDown={handleAddKeyDown}
                    onBlur={commitAdd}
                    placeholder="Folder name"
                    className="flex-1 min-w-0 text-sm bg-transparent text-grey-900 outline-none placeholder:text-grey-400"
                    maxLength={100}
                  />
                </div>
              )}

              {folders.length === 0 && !showAddInput && (
                <p className="text-xs text-grey-500 text-center py-6">
                  No folders yet
                </p>
              )}

              {folders.map((folder) => (
                <SidebarFolderItem
                  key={folder.id}
                  folder={folder}
                  noteCount={getFolderNoteCount(folder.id)}
                  isSelected={selectedFolderId === folder.id}
                  onSelect={() => {
                    setSelectedFolder(folder.id);
                    onClose();
                  }}
                  onRename={(name) => handleRename(folder.id, name)}
                  onDelete={() => setPendingDeleteId(folder.id)}
                  compact
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete confirm via portal */}
      <DeleteConfirmModal
        open={!!pendingDeleteId}
        title="Delete folder?"
        description={
          pendingNoteCount > 0
            ? `"${pendingFolder?.name}" contains ${pendingNoteCount} ${pendingNoteCount === 1 ? "note" : "notes"}. ${pendingNoteCount === 1 ? "It" : "They"} will be moved to uncategorized.`
            : `"${pendingFolder?.name}" will be permanently deleted.`
        }
        isPending={deleteFolder.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
