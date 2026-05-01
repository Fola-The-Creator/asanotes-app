import type { Editor } from "@tiptap/react";

// Returns true when a note has no meaningful content worth keeping.
// Both the title AND the body must be blank for a note to be considered empty.
export function isNoteContentEmpty(
  editor: Editor | null,
  title: string,
): boolean {
  if (title.trim().length > 0) return false;
  if (!editor) return true;
  return editor.getText().trim().length === 0;
}
