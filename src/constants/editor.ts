export const EDITOR_CONFIG = {
  AUTOSAVE_DELAY: 500, // ms
  MAX_TITLE_LENGTH: 200,
  MAX_PREVIEW_LENGTH: 150,
} as const;

export const CONTENT_DEBOUNCE_MS = 800;
export const TITLE_DEBOUNCE_MS = 800;

export const HIGHLIGHT_COLORS = [
  { name: "yellow", color: "var(--highlight-yellow)", label: "Yellow" },
  { name: "green", color: "var(--highlight-green)", label: "Green" },
  { name: "blue", color: "var(--highlight-blue)", label: "Blue" },
  { name: "purple", color: "var(--highlight-purple)", label: "Purple" },
  { name: "pink", color: "var(--highlight-pink)", label: "Pink" },
] as const;

export type HandlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "middle-right"
  | "middle-left";

export const HANDLE_CURSORS: Record<HandlePosition, string> = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
  "middle-right": "ew-resize",
  "middle-left": "ew-resize",
};
