import type { Settings } from "@/types";

export const SETTINGS_STORAGE_KEY = "asanote-settings";

export const DEFAULT_SETTINGS: Settings = {
  themeMode: "system",
  editorFontSize: 16,
  autoOpenNewNote: true,
  saveTrigger: "instant",
  reduceMotion: false,
  trashExpiryDays: 30,
  confirmDestructiveActions: true,
};

export const EDITOR_FONT_SIZE_OPTIONS = [14, 16, 18, 20] as const;
export const TRASH_EXPIRY_OPTIONS = [7, 14, 30, 60, 90] as const;

export const EXPIRY_LABELS: Record<number, string> = {
  7: "7 days",
  14: "14 days",
  30: "30 days",
  60: "60 days",
  90: "90 days",
};
