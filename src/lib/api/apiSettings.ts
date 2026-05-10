import type { Settings } from "@/types";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "@/constants";

function loadFromStorage(): Settings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    // Merge with defaults so new fields added later are always present
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function getSettings(): Promise<Settings> {
  return loadFromStorage();
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  if (typeof window === "undefined") return settings;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail — storage may be full or unavailable
  }
  return settings;
}
