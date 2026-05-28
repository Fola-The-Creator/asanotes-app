import { useState, useRef, useEffect, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { ResizableImage } from "@/components/editor/extensions/ResizableImage";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import SuperscriptExt from "@tiptap/extension-superscript";
import SubscriptExt from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { CONTENT_DEBOUNCE_MS, TITLE_DEBOUNCE_MS } from "@/constants";
import { useAppStore } from "@/store/useAppStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { isNoteContentEmpty } from "@/lib/noteUtils";
import type { UseMutationResult } from "@tanstack/react-query";

const lowlight = createLowlight(common);

interface UseNoteEditorProps {
  selectedNoteId: string | null;
  initialContent: string;
  initialTitle: string;
  isInTrash: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateNoteMut: UseMutationResult<any, any, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hardDeleteMut: UseMutationResult<any, any, any>;
}

export function useNoteEditor({
  selectedNoteId,
  initialContent,
  initialTitle,
  isInTrash,
  updateNoteMut,
  hardDeleteMut,
}: UseNoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const pendingContentRef = useRef<{
    noteId: string;
    content: string;
    preview: string;
  } | null>(null);
  const pendingTitleRef = useRef<{
    noteId: string;
    title: string;
  } | null>(null);

  const contentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const noteIdRef = useRef<string | null>(selectedNoteId);
  const titleRef = useRef<string>(initialTitle);
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);
  const updateMutRef = useRef(updateNoteMut);
  const hardDeleteMutRef = useRef(hardDeleteMut);
  const prevNoteIdRef = useRef<string | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  // Sync refs every render
  useEffect(() => {
    noteIdRef.current = selectedNoteId;
    updateMutRef.current = updateNoteMut;
    hardDeleteMutRef.current = hardDeleteMut;
    titleRef.current = title;
  });

  // Timer helpers
  const clearContentTimer = useCallback(() => {
    if (contentTimerRef.current) {
      clearTimeout(contentTimerRef.current);
      contentTimerRef.current = null;
    }
  }, []);

  const clearTitleTimer = useCallback(() => {
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current);
      titleTimerRef.current = null;
    }
  }, []);

  const clearAllPending = useCallback(() => {
    clearContentTimer();
    clearTitleTimer();
    pendingContentRef.current = null;
    pendingTitleRef.current = null;
  }, [clearContentTimer, clearTitleTimer]);

  // Save flushers
  const flushContentSave = useCallback(() => {
    const pending = pendingContentRef.current;
    if (!pending) return;

    clearContentTimer();
    pendingContentRef.current = null;

    const savedForId = pending.noteId;
    setIsSaving(true);

    updateMutRef.current.mutate(
      {
        id: savedForId,
        updates: { content: pending.content, preview: pending.preview },
      },
      {
        onSuccess: () => {
          if (noteIdRef.current === savedForId) {
            hasUnsavedChangesRef.current = false;
            setIsSaving(false);
            setLastSaved(new Date());
          }
        },
        onError: () => {
          if (noteIdRef.current === savedForId) {
            setIsSaving(false);
          }
        },
      },
    );
  }, [clearContentTimer]);

  const flushTitleSave = useCallback(() => {
    const pending = pendingTitleRef.current;
    if (!pending) return;

    clearTitleTimer();
    pendingTitleRef.current = null;
    updateMutRef.current.mutate({
      id: pending.noteId,
      updates: { title: pending.title },
    });
  }, [clearTitleTimer]);

  const flushAllPending = useCallback(() => {
    flushContentSave();
    flushTitleSave();
  }, [flushContentSave, flushTitleSave]);

  // Delete the note if it has no content and no title
  const maybeDeleteIfEmpty = useCallback(() => {
    const noteId = noteIdRef.current;
    if (!noteId || !editorRef.current) return;
    if (!isNoteContentEmpty(editorRef.current, titleRef.current)) return;

    clearAllPending();
    hardDeleteMutRef.current.mutate(noteId);
  }, [clearAllPending]);

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: "text-accent-500 underline cursor-pointer" },
      }),
      ResizableImage.configure({
        HTMLAttributes: { class: "max-w-full rounded-lg" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      SuperscriptExt,
      SubscriptExt,
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: { class: "code-block" },
      }),
      Placeholder.configure({ placeholder: "Start writing your note..." }),
    ],
    content: initialContent,
    editable: !isInTrash,
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm max-w-none focus:outline-none min-h-[calc(100vh-300px)]",
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onUpdate: ({ editor }) => {
      editorRef.current = editor;
      const content = editor.getHTML();
      const text = editor.getText();

      if (noteIdRef.current) {
        pendingContentRef.current = {
          noteId: noteIdRef.current,
          content,
          preview: text.length > 150 ? text.slice(0, 150) + "..." : text,
        };
      }

      if (!hasUnsavedChangesRef.current) {
        hasUnsavedChangesRef.current = true;
        setLastSaved(null);
      }

      const { saveTrigger } = useSettingsStore.getState().settings;
      if (saveTrigger === "blur") return;

      clearContentTimer();
      contentTimerRef.current = setTimeout(
        flushContentSave,
        CONTENT_DEBOUNCE_MS,
      );
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    editor?.setEditable(!isInTrash);
  }, [editor, isInTrash]);

  // Handle note switching auto-save and empty-note deletion
  useEffect(() => {
    if (!editor) return;

    const prevNoteId = prevNoteIdRef.current;

    if (prevNoteId && prevNoteId !== selectedNoteId) {
      if (isNoteContentEmpty(editor, titleRef.current)) {
        clearAllPending();
        hardDeleteMutRef.current.mutate(prevNoteId);
      } else {
        flushAllPending();
      }
    }

    if (selectedNoteId) {
      setTitle(initialTitle);
      titleRef.current = initialTitle;
      setIsSaving(false);
      setLastSaved(null);
      hasUnsavedChangesRef.current = false;
      clearAllPending();

      const targetContent = initialContent || "<p></p>";
      if (editor.getHTML() !== targetContent) {
        editor.commands.setContent(targetContent, false);
      }
    }

    prevNoteIdRef.current = selectedNoteId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNoteId, editor]);

  // Delete empty note when command palette opens
  useEffect(() => {
    let prev = useAppStore.getState().commandPaletteOpen;
    return useAppStore.subscribe((state) => {
      if (state.commandPaletteOpen && !prev) {
        maybeDeleteIfEmpty();
      }
      prev = state.commandPaletteOpen;
    });
  }, [maybeDeleteIfEmpty]);

  // Save pending changes and delete empty note when the component unmounts
  useEffect(() => {
    return () => {
      if (editorRef.current && noteIdRef.current) {
        if (isNoteContentEmpty(editorRef.current, titleRef.current)) {
          clearAllPending();
          hardDeleteMutRef.current.mutate(noteIdRef.current);
        } else {
          flushAllPending();
        }
      } else {
        clearAllPending();
      }
    };
  }, [clearAllPending, flushAllPending]);

  // Handlers
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      titleRef.current = newTitle;
      if (noteIdRef.current) {
        pendingTitleRef.current = {
          noteId: noteIdRef.current,
          title: newTitle,
        };
      }
      clearTitleTimer();
      titleTimerRef.current = setTimeout(flushTitleSave, TITLE_DEBOUNCE_MS);
    },
    [clearTitleTimer, flushTitleSave],
  );

  const handleEditorBlur = useCallback(
    (e: React.FocusEvent) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      if (!isInTrash) flushContentSave();
    },
    [isInTrash, flushContentSave],
  );

  return {
    editor,
    title,
    isSaving,
    lastSaved,
    handleTitleChange,
    flushTitleSave,
    handleEditorBlur,
  };
}
