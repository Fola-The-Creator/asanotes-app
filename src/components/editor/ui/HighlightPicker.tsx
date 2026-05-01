"use client";

import { useState } from "react";
import { type Editor } from "@tiptap/react";
import { Highlighter } from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { HIGHLIGHT_COLORS } from "@/constants";

export function HighlightPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  const isAnyHighlight = editor.isActive("highlight");

  const applyHighlight = (colorName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.chain().focus() as any).toggleHighlight({ color: colorName }).run();
    setOpen(false);
  };

  const removeHighlight = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor.chain().focus() as any).unsetHighlight().run();
    setOpen(false);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-8 h-8 relative transition-colors",
                  isAnyHighlight
                    ? "bg-grey-200 text-accent-500"
                    : "text-grey-600 hover:text-grey-900 hover:bg-grey-100",
                )}
              >
                <Highlighter className="w-4 h-4" />
                {/* Active colour swatch */}
                <span
                  className={cn(
                    "absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full",
                    !isAnyHighlight && "hidden",
                  )}
                  style={{ backgroundColor: "var(--highlight-yellow)" }}
                />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Highlight</TooltipContent>
          <DropdownMenuContent align="start" className="p-2">
            <div className="text-xs text-grey-500 mb-1.5 px-1 font-medium">
              Highlight colour
            </div>
            <div className="flex items-center gap-1.5 mb-1.5">
              {HIGHLIGHT_COLORS.map(({ name, color, label }) => (
                <TooltipProvider key={name} delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => applyHighlight(color)}
                        className="w-6 h-6 rounded-full border-2 border-transparent hover:border-grey-400 transition-all focus:outline-none focus:border-accent-500"
                        style={{ backgroundColor: color }}
                        aria-label={label}
                      />
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {isAnyHighlight && (
              <DropdownMenuItem
                onClick={removeHighlight}
                className="text-xs text-grey-500 cursor-pointer"
              >
                Remove highlight
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
