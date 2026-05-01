"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Quote,
  Minus,
  Table,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Superscript,
  Subscript,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Separator } from "@/components/ui/Separator";

import { type ToolbarButton } from "./ToolbarButton";
import { ButtonGroup } from "./ButtonGroup";
import { HeadingsDropdown } from "./HeadingsDropdown";
import { ListsDropdown } from "./ListsDropdown";
import { HighlightPicker } from "./HighlightPicker";
import { LinkPopover } from "./LinkPopover";
import { ImagePopover } from "./ImagePopover";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  //  History (smart disabled state)
  const history: ToolbarButton[] = [
    {
      icon: Undo,
      label: "Undo",
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      shortcut: "Ctrl+Z",
    },
    {
      icon: Redo,
      label: "Redo",
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      shortcut: "Ctrl+Y",
    },
  ];

  //  Text formatting
  const textFormatting: ToolbarButton[] = [
    {
      icon: Bold,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      shortcut: "Ctrl+B",
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      shortcut: "Ctrl+I",
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      shortcut: "Ctrl+U",
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
    {
      icon: Superscript,
      label: "Superscript",
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive("superscript"),
    },
    {
      icon: Subscript,
      label: "Subscript",
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive("subscript"),
    },
  ];

  //  Code
  const codeFormatting: ToolbarButton[] = [
    {
      icon: Code,
      label: "Inline Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
    {
      icon: Code2,
      label: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive("codeBlock"),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
  ];

  //  Alignment
  const alignment: ToolbarButton[] = [
    {
      icon: AlignLeft,
      label: "Align Left",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      shortcut: "Ctrl+Shift+L",
    },
    {
      icon: AlignCenter,
      label: "Align Center",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      shortcut: "Ctrl+Shift+E",
    },
    {
      icon: AlignRight,
      label: "Align Right",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      shortcut: "Ctrl+Shift+R",
    },
    {
      icon: AlignJustify,
      label: "Justify",
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      shortcut: "Ctrl+Shift+J",
    },
  ];

  //  Blocks
  const blocks: ToolbarButton[] = [
    {
      icon: Minus,
      label: "Divider",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  //  Table insertion
  const tableInsert: ToolbarButton[] = [
    {
      icon: Table,
      label: "Insert Table",
      action: () =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
    },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b border-grey-200 bg-grey-50/50 overflow-x-auto shrink-0">
      <TooltipProvider delayDuration={300}>
        {/* History */}
        <ButtonGroup buttons={history} />
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings dropdown */}
        <HeadingsDropdown editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text formatting */}
        <ButtonGroup buttons={textFormatting} />
        {/* Highlight picker alongside text formatting */}
        <HighlightPicker editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists dropdown */}
        <ListsDropdown editor={editor} />
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ButtonGroup buttons={alignment} />
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Insertions — Link & Image use popovers */}
        <LinkPopover editor={editor} />
        <ImagePopover editor={editor} />
        <ButtonGroup buttons={tableInsert} />
        <ButtonGroup buttons={blocks} />
        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Code */}
        <ButtonGroup buttons={codeFormatting} />
      </TooltipProvider>
    </div>
  );
}
