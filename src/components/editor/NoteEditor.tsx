"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useSelectedNote } from "@/store/useAppStore";
import {
  useNotes,
  useUpdateNote,
  useToggleFavorite,
  useTogglePinned,
  useArchiveNote,
  useUnarchiveNote,
  useDeleteNote,
  useRestoreNote,
  useHardDeleteNote,
} from "@/hooks/useNotes";
import { useFolders } from "@/hooks/useFolders";
import { useTags } from "@/hooks/useTags";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { NoteTagsModal } from "@/components/notes/NoteTagsModal";
import { MoveToModal } from "@/components/notes/MoveToModal";

import { useNoteEditor } from "./hooks/useNoteEditor";
import { EmptyEditorState } from "./ui/EmptyEditorState";
import { TrashBanner } from "./ui/TrashBanner";
import { EditorHeader } from "./ui/EditorHeader";
import { EditorMeta } from "./ui/EditorMeta";
import { EditorToolbar } from "./ui/EditorToolbar";
import { BubbleMenu } from "./ui/BubbleMenu";
import { TableBubbleMenu } from "./ui/TableBubbleMenu";
import { AIToolsPanel } from "./ui/AiToolsPanel";

export function NoteEditor() {
  const { data: notes = [] } = useNotes();
  const { data: tags = [] } = useTags();
  const { data: folders = [] } = useFolders();
  const selectedNote = useSelectedNote(notes);

  const updateNoteMut = useUpdateNote();
  const toggleFavoriteMut = useToggleFavorite();
  const togglePinnedMut = useTogglePinned();
  const archiveNoteMut = useArchiveNote();
  const unarchiveNoteMut = useUnarchiveNote();
  const deleteNoteMut = useDeleteNote();
  const restoreNoteMut = useRestoreNote();
  const hardDeleteMut = useHardDeleteNote();

  const isInTrash = selectedNote?.isDeleted ?? false;
  const isInArchive =
    (selectedNote?.isArchived && !selectedNote?.isDeleted) ?? false;

  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const [showHardDeleteModal, setShowHardDeleteModal] = useState(false);

  const {
    editor,
    title,
    isSaving,
    lastSaved,
    handleTitleChange,
    flushTitleSave,
    handleEditorBlur,
  } = useNoteEditor({
    selectedNoteId: selectedNote?.id ?? null,
    initialContent: selectedNote?.content ?? "",
    initialTitle: selectedNote?.title ?? "",
    isInTrash,
    updateNoteMut,
    hardDeleteMut,
  });

  if (!selectedNote) {
    return <EmptyEditorState />;
  }

  const noteTags = tags.filter((t) => selectedNote.tags.includes(t.id));

  return (
    <div
      className="flex-1 flex flex-col bg-grey-0 h-full overflow-hidden"
      onBlur={handleEditorBlur}
    >
      <TrashBanner
        isInTrash={isInTrash}
        onRestore={() => restoreNoteMut.mutate(selectedNote.id)}
      />

      <EditorHeader
        title={title}
        isSaving={isSaving}
        lastSaved={lastSaved}
        isInTrash={isInTrash}
        isInArchive={isInArchive}
        isFavorite={selectedNote.isFavorite}
        isPinned={selectedNote.isPinned}
        hasTags={selectedNote.tags.length > 0}
        onTitleChange={handleTitleChange}
        onTitleBlur={flushTitleSave}
        onToggleFavorite={() => toggleFavoriteMut.mutate(selectedNote.id)}
        onRestore={() => restoreNoteMut.mutate(selectedNote.id)}
        onHardDelete={() => setShowHardDeleteModal(true)}
        onUnarchive={() => unarchiveNoteMut.mutate(selectedNote.id)}
        onTogglePin={() => togglePinnedMut.mutate(selectedNote.id)}
        onEditTags={() => setShowTagsModal(true)}
        onMoveToFolder={() => setShowMoveToModal(true)}
        onArchive={() => archiveNoteMut.mutate(selectedNote.id)}
        onMoveToTrash={() => deleteNoteMut.mutate(selectedNote.id)}
      />

      <EditorMeta
        createdAt={selectedNote.createdAt}
        updatedAt={selectedNote.updatedAt}
        tags={noteTags}
      />

      {!isInTrash && <EditorToolbar editor={editor} />}
      {!isInTrash && <AIToolsPanel />}

      <div
        className={cn("flex-1 flex overflow-hidden", isInTrash && "opacity-70")}
      >
        <ScrollArea className="flex-1">
          <div className="p-6 pb-[200px]">
            {editor && (
              <>
                <BubbleMenu editor={editor} />
                <TableBubbleMenu editor={editor} />
              </>
            )}
            <EditorContent editor={editor} />
          </div>
        </ScrollArea>
      </div>

      <NoteTagsModal
        open={showTagsModal && !isInTrash}
        onClose={() => setShowTagsModal(false)}
        note={selectedNote}
        allTags={tags}
      />
      <MoveToModal
        open={showMoveToModal && !isInTrash}
        onClose={() => setShowMoveToModal(false)}
        note={selectedNote}
        folders={folders}
      />

      <DeleteConfirmModal
        open={showHardDeleteModal}
        title="Permanently delete note?"
        description="This action cannot be undone. This note will be permanently removed from your trash."
        onConfirm={() => {
          hardDeleteMut.mutate(selectedNote.id);
          setShowHardDeleteModal(false);
        }}
        onCancel={() => setShowHardDeleteModal(false)}
        isPending={hardDeleteMut.isPending}
      />
    </div>
  );
}
