"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronRight, Plus, FolderClosed, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { SidebarFolderItem } from "./SidebarFolderItem";
import { FoldersModal } from "./FoldersModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import {
  useCreateFolder,
  useRenameFolder,
  useDeleteFolder,
  useToast,
} from "@/hooks";
import { useAppStore } from "@/store/useAppStore";
import type { Folder, Note } from "@/types";

import { SIDEBAR_MAX_VISIBLE_ITEMS as MAX_VISIBLE } from "@/constants";

interface FoldersSectionProps {
  folders: Folder[];
  notes: Note[];
}

export function FoldersSection({ folders, notes }: FoldersSectionProps) {
  const { selectedFolderId, setSelectedFolder } = useAppStore();
  const createFolder = useCreateFolder();
  const renameFolder = useRenameFolder();
  const deleteFolder = useDeleteFolder();
  const { toast } = useToast();

  const [expanded, setExpanded] = useState(true);
  const [showAddInput, setShowAddInput] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

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
    createFolder.mutate(trimmed);
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

  const visibleFolders = folders.slice(0, MAX_VISIBLE);
  const hiddenCount = Math.max(0, folders.length - MAX_VISIBLE);

  return (
    <div className="pt-4">
      {/* Section header */}
      <div className="flex items-center gap-1 pl-3 pr-2 py-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1 text-[10px] font-semibold text-grey-500 uppercase tracking-[0.08em] hover:text-grey-600 transition-colors"
        >
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight className="w-3 h-3" />
          </motion.div>
          Folders
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setExpanded(true);
            setShowAddInput(true);
          }}
          className="w-5 h-5 text-grey-500 hover:text-grey-600"
          aria-label="Add folder"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-0.5">
              {/* Inline add input */}
              {showAddInput && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-grey-100 mx-1">
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

              {visibleFolders.map((folder) => (
                <SidebarFolderItem
                  key={folder.id}
                  folder={folder}
                  noteCount={getFolderNoteCount(folder.id)}
                  isSelected={selectedFolderId === folder.id}
                  onSelect={() => setSelectedFolder(folder.id)}
                  onRename={(name) => handleRename(folder.id, name)}
                  onDelete={() => setPendingDeleteId(folder.id)}
                />
              ))}

              {hiddenCount > 0 && (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full px-3 py-1.5 text-[12px] text-grey-500 hover:text-grey-700 hover:bg-grey-100/70 rounded-md transition-colors text-left flex items-center gap-3"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                  <span>{hiddenCount} more</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full list modal */}
      <FoldersModal
        open={showModal}
        onClose={() => setShowModal(false)}
        folders={folders}
        notes={notes}
        onCreateFolder={(name) => createFolder.mutate(name)}
      />

      {/* Delete confirmation*/}
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
    </div>
  );
}
