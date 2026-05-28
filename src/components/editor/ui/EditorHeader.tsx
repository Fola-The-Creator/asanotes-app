import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { EditorMoreMenu } from "./EditorMoreMenu";

interface EditorHeaderProps {
  title: string;
  isSaving: boolean;
  lastSaved: Date | null;
  isInTrash: boolean;
  isInArchive: boolean;
  isFavorite: boolean;
  isPinned: boolean;
  hasTags: boolean;
  onTitleChange: (title: string) => void;
  onTitleBlur: () => void;
  onToggleFavorite: () => void;
  // Menu Handlers
  onRestore: () => void;
  onHardDelete: () => void;
  onUnarchive: () => void;
  onTogglePin: () => void;
  onEditTags: () => void;
  onMoveToFolder: () => void;
  onArchive: () => void;
  onMoveToTrash: () => void;
}

export function EditorHeader({
  title,
  isSaving,
  lastSaved,
  isInTrash,
  isInArchive,
  isFavorite,
  isPinned,
  hasTags,
  onTitleChange,
  onTitleBlur,
  onToggleFavorite,
  ...menuHandlers
}: EditorHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-6 pt-5 pb-2 shrink-0">
      {/* Title + save status */}
      <div className="flex-1 min-w-0">
        <Input
          value={title}
          onChange={(e) => !isInTrash && onTitleChange(e.target.value)}
          onBlur={isInTrash ? undefined : onTitleBlur}
          placeholder="Untitled"
          readOnly={isInTrash}
          className={cn(
            "text-[22px]! font-bold tracking-[-0.02em] leading-tight",
            "border-none bg-transparent! p-0 h-auto",
            "focus-visible:ring-0 shadow-none",
            "text-grey-900 placeholder:text-grey-300",
            isInTrash && "cursor-default select-text opacity-70",
          )}
        />

        {/* Save status — below title, very subtle */}
        {/* {!isInTrash && (
          <div className="h-5 mt-0.5">
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] text-grey-400"
                >
                  Saving…
                </motion.span>
              ) : lastSaved ? (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] text-grey-400"
                >
                  Saved
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        )} */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        {!isInTrash && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={cn(
              "w-8 h-8 rounded-sm",
              isFavorite
                ? "text-accent-500"
                : "text-grey-400 hover:text-grey-700 hover:bg-grey-100",
            )}
          >
            <Star className={cn("w-4 h-4", isFavorite && "fill-accent-500")} />
          </Button>
        )}

        <EditorMoreMenu
          isInTrash={isInTrash}
          isInArchive={isInArchive}
          isPinned={isPinned}
          hasTags={hasTags}
          {...menuHandlers}
        />
      </div>
    </div>
  );
}
