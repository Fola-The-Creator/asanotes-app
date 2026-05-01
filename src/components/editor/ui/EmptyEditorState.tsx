import { motion } from "motion/react";

export function EmptyEditorState() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-grey-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-grey-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-grey-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-grey-900 mb-1">
          Select a note
        </h3>
        <p className="text-sm text-grey-500">
          Choose a note from the list or create a new one
        </p>
      </motion.div>
    </div>
  );
}
