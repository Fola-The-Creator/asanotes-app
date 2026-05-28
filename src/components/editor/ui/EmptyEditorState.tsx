import { motion } from "motion/react";

export function EmptyEditorState() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-grey-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center px-8 max-w-[260px]"
      >
        {/* Abstract note icon */}
        <div className="relative mx-auto mb-6 w-[72px] h-[72px]">
          <div className="absolute inset-0 rounded-2xl bg-grey-100/80" />
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center">
            <div className="space-y-[6px]">
              <div className="h-[2px] w-9 rounded-full bg-grey-300" />
              <div className="h-[2px] w-6 rounded-full bg-grey-200" />
              <div className="h-[2px] w-8 rounded-full bg-grey-300" />
              <div className="h-[2px] w-5 rounded-full bg-grey-200" />
            </div>
          </div>
        </div>

        <h3 className="text-[15px] font-semibold text-grey-700 mb-1.5 tracking-[-0.01em]">
          No note selected
        </h3>
        <p className="text-[13px] text-grey-400 leading-relaxed">
          Pick a note from the list to start writing
        </p>
      </motion.div>
    </div>
  );
}
