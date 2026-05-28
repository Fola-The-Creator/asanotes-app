"use client";

import { useState } from "react";
import { Tag as TagIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SidebarTagItem } from "./SidebarTagItem";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { useRenameTag, useDeleteTag, useToast } from "@/hooks";
import { useAppStore } from "@/store/useAppStore";
import type { Tag, Note } from "@/types";

interface TagsModalProps {
  open: boolean;
  onClose: () => void;
  tags: Tag[];
  notes: Note[];
}

export function TagsModal({ open, onClose, tags, notes }: TagsModalProps) {
  const { selectedTagId, setSelectedTag } = useAppStore();
  const renameTag = useRenameTag();
  const deleteTag = useDeleteTag();
  const { toast } = useToast();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const getTagNoteCount = (tagId: string) =>
    notes.filter((n) => n.tags.includes(tagId) && !n.isArchived && !n.isDeleted)
      .length;

  const handleRename = (id: string, newName: string) => {
    const dup = tags.some(
      (t) => t.id !== id && t.name.toLowerCase() === newName.toLowerCase(),
    );
    if (dup) {
      toast({ title: `"${newName}" already exists`, variant: "destructive" });
      return;
    }
    renameTag.mutate({ id, name: newName });
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    if (selectedTagId === pendingDeleteId) setSelectedTag(null);
    deleteTag.mutate(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const pendingTag = tags.find((t) => t.id === pendingDeleteId);
  const pendingNoteCount = pendingDeleteId ? getTagNoteCount(pendingDeleteId) : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-sm p-0 gap-0 flex flex-col max-h-[70vh]">
          <DialogHeader className="px-4 pt-4 pb-3 border-b border-grey-200 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-grey-500" />
                <DialogTitle className="text-base">All Tags</DialogTitle>
              </div>
              <div className="flex items-center gap-1">
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
              {tags.length === 0 && (
                <p className="text-xs text-grey-500 text-center py-6">
                  No tags yet. Create tags via a note&apos;s &quot;Add
                  tags&quot; menu.
                </p>
              )}

              {tags.map((tag) => (
                <SidebarTagItem
                  key={tag.id}
                  tag={tag}
                  noteCount={getTagNoteCount(tag.id)}
                  isSelected={selectedTagId === tag.id}
                  onSelect={() => {
                    setSelectedTag(tag.id);
                    onClose();
                  }}
                  onRename={(name) => handleRename(tag.id, name)}
                  onDelete={() => setPendingDeleteId(tag.id)}
                  compact
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Single delete confirm */}
      <DeleteConfirmModal
        open={!!pendingDeleteId}
        title="Delete tag?"
        description={
          pendingNoteCount > 0
            ? `"#${pendingTag?.name}" is used in ${pendingNoteCount} ${pendingNoteCount === 1 ? "note" : "notes"}. It will be removed from all of them.`
            : `"#${pendingTag?.name}" will be permanently deleted.`
        }
        isPending={deleteTag.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
