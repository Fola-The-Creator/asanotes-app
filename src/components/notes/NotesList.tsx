"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SortAsc,
  Calendar,
  Clock,
  FileText,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, useFilteredNotes } from "@/store/useAppStore";
import {
  useNotes,
  useToggleFavorite,
  useTogglePinned,
  useArchiveNote,
  useDeleteNote,
  useRestoreNote,
  useUnarchiveNote,
  useHardDeleteNote,
} from "@/hooks/useNotes";
import { useFolders } from "@/hooks/useFolders";
import { useTags } from "@/hooks/useTags";
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
import { BulkActionBar, SelectionToggleButton } from "./BulkActionBar";
import { useIsMobile } from "@/hooks/useMobile";
import { PINNED_SECTION_VIEWS } from "@/constants";

export const viewTitles: Record<ViewType, string> = {
  all: "All Notes",
  favorites: "Favorites",
  archive: "Archive",
  trash: "Trash",
  folder: "Folder",
  tag: "Tag",
};

export const sortOptions: {
  value: SortOption;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "recent", label: "Recently Updated", icon: Clock },
  { value: "created", label: "Date Created", icon: Calendar },
  { value: "alphabetical", label: "Alphabetical", icon: SortAsc },
];

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
    bulkDeleteConfirmIds.forEach((id) => deleteNote.mutate(id));
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
    <div className="flex flex-col w-full h-full bg-grey-0 border-r border-grey-200 relative">
      {/* Header */}
      <div className="p-4 border-b border-grey-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-grey-900">
            {getViewTitle()}
          </h2>
          <div className="flex items-center gap-1">
            {/* <SelectionToggleButton /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-grey-600 hover:text-grey-900"
                >
                  {sortOptions.find((s) => s.value === sortOption)?.icon && (
                    <span className="mr-1">
                      {(() => {
                        const Icon = sortOptions.find(
                          (s) => s.value === sortOption,
                        )?.icon;
                        return Icon ? <Icon className="w-4 h-4" /> : null;
                      })()}
                    </span>
                  )}
                  Sort
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
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-500" />
          <Input
            placeholder="Filter notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-grey-100 border-grey-200 text-grey-900 placeholder:text-grey-500"
          />
        </div>
      </div>

      {/* Trash notice banner */}
      <AnimatePresence>
        {viewType === "trash" && (
          <motion.div
            key="trash-banner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden px-2"
          >
            <div className="flex items-start gap-2.5 mt-3 px-3 pt-2.5 pb-4.5 border-b border-grey-200 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-grey-600 shrink-0 mt-0.5" />
              <p className="text-xs text-grey-700 leading-relaxed">
                Notes in Trash are permanently deleted after{" "}
                <span className="font-medium">30 days</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-grey-500 text-sm">
              Loading notes...
            </div>
          ) : totalCount === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-grey-100 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-grey-400" />
              </div>
              <h3 className="text-sm font-medium text-grey-900 mb-1">
                No notes found
              </h3>
              <p className="text-xs text-grey-500">
                {searchQuery
                  ? "Try a different search term"
                  : viewType === "trash"
                    ? "Your trash is empty"
                    : "Create a new note to get started"}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Pinned section */}
              {pinnedNotes.length > 0 && (
                <div className="mb-5">
                  <button
                    onClick={() => setIsPinnedOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 w-full px-3 py-1.5 mb-1 text-[11px] font-semibold uppercase tracking-wider text-grey-500 hover:text-grey-700 transition-colors"
                  >
                    <span>Pinned</span>
                    <motion.span
                      animate={{ rotate: isPinnedOpen ? 0 : -90 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="ml-auto"
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
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        {pinnedNotes.map((note, index) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            isSelected={selectedNoteId === note.id}
                            index={index}
                            viewType={viewType}
                            tags={tags}
                            onSelect={() => handleNoteSelect(note.id)}
                            onToggleFavorite={() =>
                              toggleFavorite.mutate(note.id)
                            }
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {unpinnedNotes.length > 0 && (
                    <div className="mt-3 mb-2 mx-1 border-t border-grey-200" />
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
      <div className="p-3 border-t border-grey-200">
        <p className="text-xs text-grey-500 text-center">
          {totalCount} {totalCount === 1 ? "note" : "notes"}
        </p>
      </div>

      {/* Bulk action bar */}
      <BulkActionBar
        allIds={allFilteredIds}
        onDelete={handleBulkDelete}
        onMoveTo={handleBulkMoveTo}
        onEditTags={handleBulkEditTags}
      />

      {/* Single-note tag modal */}
      {tagModalNote && (
        <NoteTagsModal
          open={!!tagModalNoteId}
          onClose={() => setTagModalNoteId(null)}
          note={tagModalNote}
          allTags={tags}
        />
      )}

      {/* Single-note move modal */}
      {moveToNote && (
        <MoveToModal
          open={!!moveToNoteId}
          onClose={() => setMoveToNoteId(null)}
          note={moveToNote}
          folders={folders}
        />
      )}

      {/* Bulk move modal — reuse MoveToModal with the first selected note as a proxy */}
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

      {/* Bulk tag modal — open with the first selected note */}
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

      {/* Single-note permanent delete confirm */}
      <DeleteConfirmModal
        open={!!hardDeleteNoteId}
        title="Permanently delete note?"
        description={`"${hardDeleteNote_?.title || "This note"}" will be permanently deleted and cannot be recovered. This action is irreversible.`}
        isPending={hardDeleteNote.isPending}
        onConfirm={handleConfirmHardDelete}
        onCancel={() => setHardDeleteNoteId(null)}
      />

      {/* Bulk delete confirm */}
      <DeleteConfirmModal
        open={bulkDeleteConfirmIds.length > 0}
        title={`Move ${bulkDeleteConfirmIds.length} ${bulkDeleteConfirmIds.length === 1 ? "note" : "notes"} to trash?`}
        description="These notes will be moved to trash and can be restored within 30 days."
        isPending={deleteNote.isPending}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteConfirmIds([])}
      />
    </div>
  );
}
