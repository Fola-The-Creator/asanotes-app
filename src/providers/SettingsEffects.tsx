"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

// This is kept separate from SettingsModal so effects run even when the modal is closed

export function SettingsEffects() {
  const settings = useSettingsStore((s) => s.settings);

  // Editor font size
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--editor-font-size",
      `${settings.editorFontSize}px`,
    );
  }, [settings.editorFontSize]);

  // Reduce motion
  useEffect(() => {
    if (settings.reduceMotion) {
      document.documentElement.setAttribute("data-reduce-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduce-motion");
    }
  }, [settings.reduceMotion]);

  return null;
}
