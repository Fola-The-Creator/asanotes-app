"use client";

import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSelectionStore } from "@/store/useSelectionStore";

export function SelectionToggleButton() {
  const { selectionMode, selectionTarget, enterSelectionMode, exitSelectionMode } =
    useSelectionStore();

  const active = selectionMode && selectionTarget === "note";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => (active ? exitSelectionMode() : enterSelectionMode("note"))}
      className={cn(
        "w-7 h-7",
        active
          ? "text-accent-500 bg-accent-500/10"
          : "text-grey-500 hover:text-grey-800",
      )}
      aria-label={active ? "Cancel selection" : "Select notes"}
    >
      <CheckSquare className="w-3.5 h-3.5" />
    </Button>
  );
}
