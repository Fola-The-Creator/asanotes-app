"use client";

import { useState } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SidebarTagItem } from "./SidebarTagItem";
import { TagsModal } from "./TagsModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { useRenameTag, useDeleteTag, useToast } from "@/hooks";
import { useAppStore } from "@/store/useAppStore";
import type { Tag, Note } from "@/types";

import { SIDEBAR_MAX_VISIBLE_ITEMS as MAX_VISIBLE } from "@/constants";

interface TagsSectionProps {
  tags: Tag[];
  notes: Note[];
}

export function TagsSection({ tags, notes }: TagsSectionProps) {
  const { selectedTagId, setSelectedTag } = useAppStore();
  const renameTag = useRenameTag();
  const deleteTag = useDeleteTag();
  const { toast } = useToast();

  const [expanded, setExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
  const pendingNoteCount = pendingDeleteId
    ? getTagNoteCount(pendingDeleteId)
    : 0;

  const visibleTags = tags.slice(0, MAX_VISIBLE);
  const hiddenCount = Math.max(0, tags.length - MAX_VISIBLE);

  return (
    <div className="pt-2">
      {/* Section header — no + button; tag creation lives in NoteTagsModal */}
      <div className="flex items-center gap-1 px-3 py-1">
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
          Tags
        </button>
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
              {tags.length === 0 && (
                <p className="text-xs text-grey-500 px-3 py-1.5">No tags yet</p>
              )}

              {visibleTags.map((tag) => (
                <SidebarTagItem
                  key={tag.id}
                  tag={tag}
                  noteCount={getTagNoteCount(tag.id)}
                  isSelected={selectedTagId === tag.id}
                  onSelect={() => setSelectedTag(tag.id)}
                  onRename={(name) => handleRename(tag.id, name)}
                  onDelete={() => setPendingDeleteId(tag.id)}
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
      <TagsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        tags={tags}
        notes={notes}
      />

      {/* Delete confirmation — portal */}
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
    </div>
  );
}
