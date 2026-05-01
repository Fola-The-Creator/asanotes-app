"use client";

import { useState, useRef, useEffect } from "react";
import { Tag as TagIcon, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useAssignNoteTags, useCreateTag } from "@/hooks/useTags";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { Note, Tag } from "@/types";

interface NoteTagsModalProps {
  open: boolean;
  onClose: () => void;
  note: Note;
  allTags: Tag[];
}

export function NoteTagsModal({
  open,
  onClose,
  note,
  allTags,
}: NoteTagsModalProps) {
  // Track noteId to reset state when modal re-opens for a different note
  const [trackedNoteId, setTrackedNoteId] = useState(note.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(note.tags);
  const [newTagValue, setNewTagValue] = useState("");
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const newTagInputRef = useRef<HTMLInputElement>(null);

  const assignTags = useAssignNoteTags();
  const createTag = useCreateTag();
  const { toast } = useToast();

  // Reset without useEffect setState
  if (note.id !== trackedNoteId) {
    setTrackedNoteId(note.id);
    setSelectedIds(note.tags);
  }

  useEffect(() => {
    if (showNewTagInput) {
      // Small delay so the input is rendered before we focus it
      const t = setTimeout(() => newTagInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showNewTagInput]);

  const toggleTag = (tagId: string) => {
    setSelectedIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleClose = () => {
    const changed =
      selectedIds.length !== note.tags.length ||
      selectedIds.some((id) => !note.tags.includes(id));
    if (changed) {
      assignTags.mutate({ noteId: note.id, tagIds: selectedIds });
    }
    setShowNewTagInput(false);
    setNewTagValue("");
    onClose();
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitNewTag();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowNewTagInput(false);
      setNewTagValue("");
    }
  };

  const commitNewTag = async () => {
    const trimmed = newTagValue.trim().toLowerCase();
    if (!trimmed) {
      setShowNewTagInput(false);
      return;
    }

    // If it already exists, just select it
    const existing = allTags.find((t) => t.name.toLowerCase() === trimmed);
    if (existing) {
      if (!selectedIds.includes(existing.id)) {
        setSelectedIds((prev) => [...prev, existing.id]);
      }
      setNewTagValue("");
      setShowNewTagInput(false);
      return;
    }

    try {
      const newTag = await createTag.mutateAsync(trimmed);
      setSelectedIds((prev) => [...prev, newTag.id]);
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Failed to create tag",
        variant: "destructive",
      });
    }
    setNewTagValue("");
    setShowNewTagInput(false);
  };

  const hasSelectedAll =
    allTags.length > 0 && allTags.every((t) => selectedIds.includes(t.id));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 flex flex-col max-h-[70vh]">
        {/* Header */}
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-grey-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-grey-500" />
              <DialogTitle className="text-base">
                {selectedIds.length > 0
                  ? `${selectedIds.length} tag${selectedIds.length !== 1 ? "s" : ""} selected`
                  : "Add tags"}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-7 h-7 text-grey-500 hover:text-grey-900 shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Tag pill grid */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="px-4 py-3">
            {allTags.length === 0 && !showNewTagInput ? (
              <p className="text-xs text-grey-500 text-center py-6">
                No tags yet — create your first tag below.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border select-none",
                        isSelected
                          ? "bg-accent-500/15 text-accent-500 border-accent-500/40 hover:bg-accent-500/20"
                          : "bg-grey-100 text-grey-600 border-transparent hover:border-grey-300 hover:text-grey-800",
                      )}
                    >
                      <span className="opacity-70">#</span>
                      {tag.name}
                    </button>
                  );
                })}

                {/* Inline new-tag input rendered as a pill */}
                {showNewTagInput && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-accent-500/40 bg-accent-500/10">
                    <span className="text-accent-500/70">#</span>
                    <input
                      ref={newTagInputRef}
                      value={newTagValue}
                      onChange={(e) => setNewTagValue(e.target.value)}
                      onKeyDown={handleNewTagKeyDown}
                      onBlur={commitNewTag}
                      placeholder="new tag"
                      className="bg-transparent text-accent-500 outline-none placeholder:text-accent-500/40 w-20 min-w-16"
                      maxLength={50}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-grey-200 px-4 py-2.5 shrink-0">
          {showNewTagInput ? (
            <p className="text-xs text-grey-500">
              Press <kbd className="bg-grey-200 px-1 rounded">Enter</kbd> to
              create, <kbd className="bg-grey-200 px-1 rounded">Esc</kbd> to
              cancel
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewTagInput(true)}
                className="inline-flex items-center gap-1.5 text-xs text-grey-500 hover:text-grey-700 transition-colors px-2 py-1 rounded-lg hover:bg-grey-100"
              >
                <Plus className="w-3.5 h-3.5" />
                New tag
              </button>
              {selectedIds.length > 0 && !hasSelectedAll && (
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-grey-400 hover:text-grey-600 transition-colors px-2 py-1 rounded-lg hover:bg-grey-100"
                >
                  Clear all
                </button>
              )}
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={handleClose}
                className="h-7 text-xs bg-accent-500 hover:bg-accent-600 text-white"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
