export type ThemeMode = "light" | "dark" | "system";
export type SaveTrigger = "instant" | "blur";

export interface Settings {
  themeMode: ThemeMode;
  editorFontSize: number; // 14 | 16 | 18 | 20 (px)
  autoOpenNewNote: boolean;
  saveTrigger: SaveTrigger;
  reduceMotion: boolean;
  trashExpiryDays: number; // 7 | 14 | 30 | 60 | 90
  confirmDestructiveActions: boolean;
}
