"use client";

import { create } from "zustand";
import type { Settings } from "@/types";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "@/constants";

// // Helpers

function loadSettings(): Settings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    // Always merge with defaults so new fields don't break on first load
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function persistSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or unavailable — silently ignore */
  }
}

// // Store Shape

interface SettingsState {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

// // Store

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: loadSettings(),

  updateSetting: (key, value) =>
    set((state) => {
      const next: Settings = { ...state.settings, [key]: value };
      persistSettings(next);
      return { settings: next };
    }),

  resetSettings: () => {
    persistSettings(DEFAULT_SETTINGS);
    set({ settings: { ...DEFAULT_SETTINGS } });
  },
}));

// // Typed Selector

export function useSetting<K extends keyof Settings>(key: K): Settings[K] {
  return useSettingsStore((s) => s.settings[key]);
}
