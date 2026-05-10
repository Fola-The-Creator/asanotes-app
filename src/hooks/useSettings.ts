import { useSettingsStore, useSetting } from "@/store/useSettingsStore";
import type { Settings } from "@/types";

/**
 * Convenience hook: returns the full settings object + actions.
 * Use `useSetting(key)` for single-key subscriptions to avoid re-renders.
 */
export function useSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  return { settings, updateSetting, resetSettings };
}

export { useSetting };
export type { Settings };
