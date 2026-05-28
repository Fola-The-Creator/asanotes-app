import type { Editor } from "@tiptap/react";

export function isNoteDataEmpty(title: string, content: string): boolean {
  const trimmedTitle = title.trim();
  const isTitleEmpty =
    trimmedTitle.length === 0 ||
    trimmedTitle.toLowerCase() === "untitled note";

  if (!isTitleEmpty) return false;

  const plainText = content.replace(/<[^>]*>/g, "").trim();
  return plainText.length === 0;
}

export function isNoteContentEmpty(
  editor: Editor | null,
  title: string,
): boolean {
  const trimmedTitle = title.trim();
  const isTitleEmpty =
    trimmedTitle.length === 0 ||
    trimmedTitle.toLowerCase() === "untitled note";

  if (!isTitleEmpty) return false;
  if (!editor) return true;
  return editor.getText().trim().length === 0;
}
