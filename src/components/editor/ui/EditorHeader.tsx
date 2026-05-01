import { motion, AnimatePresence } from "motion/react";
import { Cloud, CloudOff, Star } from "lucide-react";
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
    <div className="flex items-center gap-6 justify-between p-4 border-b border-grey-200">
      <div className="flex items-center gap-3 flex-1">
        <Input
          value={title}
          onChange={(e) => !isInTrash && onTitleChange(e.target.value)}
          onBlur={isInTrash ? undefined : onTitleBlur}
          placeholder="Untitled"
          readOnly={isInTrash}
          className={cn(
            "text-xl! font-semibold border-none bg-transparent! p-0 h-auto focus-visible:ring-0 text-grey-900 placeholder:text-grey-400 shadow-none",
            isInTrash && "cursor-default select-text"
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        {!isInTrash && (
          <AnimatePresence mode="wait">
            <motion.div
              key={isSaving ? "saving" : "saved"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-xs text-grey-500"
            >
              {isSaving ? (
                <>
                  <CloudOff className="w-3.5 h-3.5" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-green-500" />
                  <span>Saved</span>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        )}

        {!isInTrash && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={cn(
              "w-8 h-8",
              isFavorite ? "text-accent-500" : "text-grey-500 hover:text-grey-900"
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
