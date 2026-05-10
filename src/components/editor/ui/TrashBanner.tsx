import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Undo2 } from "lucide-react";

interface TrashBannerProps {
  isInTrash: boolean;
  onRestore: () => void;
}

export function TrashBanner({ isInTrash, onRestore }: TrashBannerProps) {
  return (
    <AnimatePresence>
      {isInTrash && (
        <motion.div
          key="trash-notice"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 mx-4 mt-3 px-4 py-2.5 rounded-lg bg-grey-100 border border-grey-200">
            <div className="flex items-center gap-2.5">
              <p className="text-xs text-grey-700">
                This note is in the {" "}
                <span className="font-semibold">Trash</span> and is read-only.
                Restore it to make edits.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRestore}
              className="text-xs h-7 px-3 text-grey-700 hover:bg-grey-200 shrink-0"
            >
              <Undo2 className="w-3.5 h-3.5 mr-1.5" />
              Restore
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
