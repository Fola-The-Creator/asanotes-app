"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  FileText,
  ChevronDown,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  useNotes,
  useToggleFavorite,
  useTogglePinned,
  useArchiveNote,
  useDeleteNote,
  useRestoreNote,
  useUnarchiveNote,
  useHardDeleteNote,
  useFolders,
  useTags,
  useIsMobile,
  useFilteredNotes,
} from "@/hooks";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import type { SortOption, ViewType } from "@/types";
import { NoteCard } from "./NoteCard";
import { NoteTagsModal } from "./NoteTagsModal";
import { MoveToModal } from "./MoveToModal";
import { BulkActionBar } from "./BulkActionBar";
import { SelectionToggleButton } from "./SelectionToggleButton";
import { PINNED_SECTION_VIEWS, viewTitles, sortOptions, EXPIRY_LABELS } from "@/constants";

export function NotesList() {
  const isMobile = useIsMobile();
  const {
    viewType,
    sortOption,
    searchQuery,
    selectedNoteId,
    selectedFolderId,
    selectedTagId,
    setSelectedNote,
    setMobileView,
    setSortOption,
    setSearchQuery,
  } = useAppStore();

  const trashExpiryDays = useSettingsStore((s) => s.settings.trashExpiryDays);

  const { data: notes = [], isLoading } = useNotes();
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();

  const toggleFavorite = useToggleFavorite();
  const togglePinned = useTogglePinned();
  const archiveNote = useArchiveNote();
  const unarchiveNote = useUnarchiveNote();
  const deleteNote = useDeleteNote();
  const restoreNote = useRestoreNote();
  const hardDeleteNote = useHardDeleteNote();

  const [isPinnedOpen, setIsPinnedOpen] = useState(true);

  // Single-note modal state
  const [tagModalNoteId, setTagModalNoteId] = useState<string | null>(null);
  const [moveToNoteId, setMoveToNoteId] = useState<string | null>(null);
  const [hardDeleteNoteId, setHardDeleteNoteId] = useState<string | null>(null);

  // Bulk-action modal state
  const [bulkTagNoteIds, setBulkTagNoteIds] = useState<string[]>([]);
  const [bulkMoveNoteIds, setBulkMoveNoteIds] = useState<string[]>([]);
  const [bulkDeleteConfirmIds, setBulkDeleteConfirmIds] = useState<string[]>([]);

  const { exitSelectionMode } = useSelectionStore();

  const handleNoteSelect = (id: string) => {
    setSelectedNote(id);
    if (isMobile) setMobileView("editor");
  };

  const filteredNotes = useFilteredNotes(notes);

  const showPinnedSection = PINNED_SECTION_VIEWS.includes(viewType);
  const pinnedNotes = showPinnedSection
    ? filteredNotes.filter((n) => n.isPinned)
    : [];
  const unpinnedNotes = showPinnedSection
    ? filteredNotes.filter((n) => !n.isPinned)
    : filteredNotes;

  const totalCount = filteredNotes.length;
  const allFilteredIds = filteredNotes.map((n) => n.id);

  const getViewTitle = () => {
    if (viewType === "folder" && selectedFolderId) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      return folder?.name || "Folder";
    }
    if (viewType === "tag" && selectedTagId) {
      const tag = tags.find((t) => t.id === selectedTagId);
      return tag ? `#${tag.name}` : "Tag";
    }
    return viewTitles[viewType];
  };

  const tagModalNote = tagModalNoteId
    ? notes.find((n) => n.id === tagModalNoteId)
    : null;

  const moveToNote = moveToNoteId
    ? notes.find((n) => n.id === moveToNoteId)
    : null;

  const hardDeleteNote_ = hardDeleteNoteId
    ? notes.find((n) => n.id === hardDeleteNoteId)
    : null;

  const handleConfirmHardDelete = () => {
    if (!hardDeleteNoteId) return;
    hardDeleteNote.mutate(hardDeleteNoteId);
    setHardDeleteNoteId(null);
  };

  const handleBulkDelete = (ids: string[]) => {
    setBulkDeleteConfirmIds(ids);
  };

  const confirmBulkDelete = () => {
    if (viewType === "trash") {
      bulkDeleteConfirmIds.forEach((id) => hardDeleteNote.mutate(id));
    } else {
      bulkDeleteConfirmIds.forEach((id) => deleteNote.mutate(id));
    }
    setBulkDeleteConfirmIds([]);
    exitSelectionMode();
  };

  const handleBulkMoveTo = (ids: string[]) => {
    setBulkMoveNoteIds(ids);
  };

  const handleBulkEditTags = (ids: string[]) => {
    setBulkTagNoteIds(ids);
  };

  return (
    <div className="flex flex-col w-full h-full bg-grey-0 border-r border-grey-200/60 relative">
      {/* Header */}
      <div className="px-3 pt-4 pb-3 border-b border-grey-200/60 shrink-0">
        {/* View title row */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-grey-900 tracking-[-0.01em]">
            {getViewTitle()}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-grey-400 hover:text-grey-700 hover:bg-grey-100/80"
              >
                {(() => {
                  const Icon = sortOptions.find((s) => s.value === sortOption)?.icon ?? Clock;
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortOption(option.value)}
                  className={cn(sortOption === option.value && "bg-grey-100")}
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-grey-400 pointer-events-none" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-[13px] bg-grey-100/80 border-grey-200/60 rounded-md placeholder:text-grey-400 focus-visible:bg-grey-100 focus-visible:border-grey-300"
          />
        </div>
      </div>

      {/* Trash notice */}
      <AnimatePresence>
        {viewType === "trash" && (
          <motion.div
            key="trash-banner"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 pt-3 shrink-0"
          >
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-grey-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-grey-600 leading-relaxed">
                Notes are permanently deleted after{" "}
                <span className="font-semibold text-grey-700">
                  {EXPIRY_LABELS[trashExpiryDays] ?? `${trashExpiryDays} days`}
                </span>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="px-2 pt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-grey-500 text-sm">
              Loading notes...
            </div>
          ) : totalCount === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-16 text-center px-4"
            >
              <div className="relative mx-auto mb-6 w-[72px] h-[72px]">
          <div className="absolute inset-0 rounded-2xl bg-grey-100/80" />
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
            <div className="space-y-[6px]">
              <div className="h-[2px] w-9 rounded-full bg-grey-300" />
              <div className="h-[2px] w-6 rounded-full bg-grey-200" />
              <div className="h-[2px] w-8 rounded-full bg-grey-300" />
              <div className="h-[2px] w-5 rounded-full bg-grey-200" />
            </div>
          </div>
        </div>
              <h3 className="text-[14px] font-semibold text-grey-700 mb-1">
                No notes found
              </h3>
              <p className="text-[12px] text-grey-400 leading-relaxed">
                {searchQuery
                  ? "Try a different search term"
                  : viewType === "trash"
                    ? "Your trash is empty"
                    : "Create a note to get started"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Pinned section */}
              {pinnedNotes.length > 0 && (
                <div className="mb-3">
                  {/* Pinned header */}
                  <button
                    onClick={() => setIsPinnedOpen((prev) => !prev)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 mb-2 group rounded-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500/70 shrink-0" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-500/80">
                      Pinned
                    </span>
                    <motion.span
                      animate={{ rotate: isPinnedOpen ? 0 : -90 }}
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      className="ml-auto text-grey-400 group-hover:text-grey-600 transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isPinnedOpen && (
                      <motion.div
                        key="pinned-notes"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 32, stiffness: 320 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="space-y-1">
                          {pinnedNotes.map((note, index) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              isSelected={selectedNoteId === note.id}
                              index={index}
                              viewType={viewType}
                              tags={tags}
                              onSelect={() => handleNoteSelect(note.id)}
                              onToggleFavorite={() => toggleFavorite.mutate(note.id)}
                              onTogglePin={() => togglePinned.mutate(note.id)}
                              onArchive={() => archiveNote.mutate(note.id)}
                              onUnarchive={() => unarchiveNote.mutate(note.id)}
                              onDelete={() => deleteNote.mutate(note.id)}
                              onRestore={() => restoreNote.mutate(note.id)}
                              onHardDelete={() => setHardDeleteNoteId(note.id)}
                              onEditTags={() => setTagModalNoteId(note.id)}
                              onMoveTo={() => setMoveToNoteId(note.id)}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Separator */}
                  {unpinnedNotes.length > 0 && (
                    <div className="mt-3 mb-2 px-1">
                      <div className="h-px bg-grey-200/50" />
                      <p className="text-[10px] uppercase tracking-[0.08em] text-grey-400 font-semibold px-1 mt-2 mb-1">
                        Other Notes
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Regular notes */}
              {unpinnedNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={selectedNoteId === note.id}
                  index={index}
                  viewType={viewType}
                  tags={tags}
                  onSelect={() => handleNoteSelect(note.id)}
                  onToggleFavorite={() => toggleFavorite.mutate(note.id)}
                  onTogglePin={() => togglePinned.mutate(note.id)}
                  onArchive={() => archiveNote.mutate(note.id)}
                  onUnarchive={() => unarchiveNote.mutate(note.id)}
                  onDelete={() => deleteNote.mutate(note.id)}
                  onRestore={() => restoreNote.mutate(note.id)}
                  onHardDelete={() => setHardDeleteNoteId(note.id)}
                  onEditTags={() => setTagModalNoteId(note.id)}
                  onMoveTo={() => setMoveToNoteId(note.id)}
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}  
      <div className="flex items-center px-4 py-2.5 border-t border-grey-200/60 shrink-0">
        {/* <p className="text-[11px] text-grey-400 tabular-nums">
          {totalCount} {totalCount === 1 ? "note" : "notes"}
        </p> */}
      </div>

      {/* Bulk action bar */}
      <BulkActionBar
        allIds={allFilteredIds}
        onDelete={handleBulkDelete}
        onMoveTo={handleBulkMoveTo}
        onEditTags={handleBulkEditTags}
      />

      {/* Single-note modals */}
      {tagModalNote && (
        <NoteTagsModal
          open={!!tagModalNoteId}
          onClose={() => setTagModalNoteId(null)}
          note={tagModalNote}
          allTags={tags}
        />
      )}

      {moveToNote && (
        <MoveToModal
          open={!!moveToNoteId}
          onClose={() => setMoveToNoteId(null)}
          note={moveToNote}
          folders={folders}
        />
      )}

      {/* Bulk move */}
      {bulkMoveNoteIds.length > 0 && (
        <MoveToModal
          open={true}
          onClose={() => {
            setBulkMoveNoteIds([]);
            exitSelectionMode();
          }}
          note={notes.find((n) => n.id === bulkMoveNoteIds[0])!}
          folders={folders}
          bulkNoteIds={bulkMoveNoteIds}
        />
      )}

      {/* Bulk tags */}
      {bulkTagNoteIds.length > 0 && (
        <NoteTagsModal
          open={true}
          onClose={() => {
            setBulkTagNoteIds([]);
            exitSelectionMode();
          }}
          note={notes.find((n) => n.id === bulkTagNoteIds[0])!}
          allTags={tags}
          bulkNoteIds={bulkTagNoteIds}
        />
      )}

      {/* Single hard-delete confirm */}
      <DeleteConfirmModal
        open={!!hardDeleteNoteId}
        title="Permanently delete note?"
        description={`"${hardDeleteNote_?.title || "This note"}" will be permanently deleted and cannot be recovered.`}
        isPending={hardDeleteNote.isPending}
        onConfirm={handleConfirmHardDelete}
        onCancel={() => setHardDeleteNoteId(null)}
      />

      {/* Bulk delete confirm */}
      <DeleteConfirmModal
        open={bulkDeleteConfirmIds.length > 0}
        title={
          viewType === "trash"
            ? `Permanently delete ${bulkDeleteConfirmIds.length} ${bulkDeleteConfirmIds.length === 1 ? "note" : "notes"}?`
            : `Move ${bulkDeleteConfirmIds.length} ${bulkDeleteConfirmIds.length === 1 ? "note" : "notes"} to trash?`
        }
        description={
          viewType === "trash"
            ? "These notes will be permanently deleted and cannot be recovered."
            : "These notes will be moved to trash and can be restored within 30 days."
        }
        isPending={viewType === "trash" ? hardDeleteNote.isPending : deleteNote.isPending}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirmIds([])}
      />
    </div>
  );
}
