"use client";

import { BubbleMenu as TiptapBubbleMenu, type Editor } from "@tiptap/react";
import { motion } from "motion/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { LinkPopover } from "./LinkPopover";

import { HIGHLIGHT_COLORS } from "@/constants";

interface BubbleMenuProps {
  editor: Editor | null;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      label: "Underline",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      label: "Strikethrough",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      label: "Code",
    },
  ];

  return (
    <TiptapBubbleMenu
      editor={editor}
      pluginKey="textBubbleMenu"
      shouldShow={({ editor, state }) => {
        if (editor.isActive("table")) return false;
        const { from, to } = state.selection;
        return from !== to;
      }}
      tippyOptions={{ duration: 100, placement: "top" }}
      className="flex items-center gap-0.5 p-1 rounded-lg bg-grey-100 border border-grey-200 shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-0.5"
      >
        <TooltipProvider delayDuration={200}>
          {buttons.map((button) => (
            <Tooltip key={button.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={button.action}
                  className={cn(
                    "w-7 h-7",
                    button.isActive
                      ? "bg-grey-200 text-accent-500"
                      : "text-grey-600 hover:text-grey-900 hover:bg-grey-200",
                  )}
                >
                  <button.icon className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{button.label}</TooltipContent>
            </Tooltip>
          ))}

          {/* Thin separator */}
          <div className="w-px h-4 bg-grey-300 mx-0.5" />

          {/* Link popover */}
          <LinkPopover editor={editor} iconSize="sm" />

          {/* Thin separator */}
          <div className="w-px h-4 bg-grey-300 mx-0.5" />

          {/* Highlight colour picker */}
          <Tooltip>
            <DropdownMenu modal={false}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-7 h-7",
                      editor.isActive("highlight")
                        ? "bg-grey-200 text-accent-500"
                        : "text-grey-600 hover:text-grey-900 hover:bg-grey-200",
                    )}
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Highlight</TooltipContent>
              <DropdownMenuContent portaled={false} align="start" className="p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  {HIGHLIGHT_COLORS.map(({ name, color, label }) => (
                    <Tooltip key={name}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (editor.chain().focus() as any)
                              .toggleHighlight({ color: name })
                              .run()
                          }
                          className="w-5 h-5 rounded-full border-2 border-transparent hover:border-grey-400 transition-all focus:outline-none focus:border-accent-500"
                          style={{ backgroundColor: color }}
                          aria-label={`Highlight ${label}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                {editor.isActive("highlight") && (
                  <button
                    onClick={() =>
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (editor.chain().focus() as any).unsetHighlight().run()
                    }
                    className="w-full text-left text-xs text-grey-500 hover:text-grey-700 px-1 py-0.5 rounded transition-colors"
                  >
                    Remove highlight
                  </button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </TiptapBubbleMenu>
  );
}
