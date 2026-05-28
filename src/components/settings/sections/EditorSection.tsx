"use client";

import { useEffect } from "react";
import { Type } from "lucide-react";
import { useSettings } from "@/hooks";
import { EDITOR_FONT_SIZE_OPTIONS } from "@/constants";

export function EditorSection() {
  const { settings, updateSetting } = useSettings();

  // Apply font size CSS variable immediately on change
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--editor-font-size",
        `${settings.editorFontSize}px`,
      );
    }
  }, [settings.editorFontSize]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900 mb-1">Editor</h3>
        <p className="text-xs text-grey-500 mb-4">
          Customize how notes look while you&apos;re writing.
        </p>

        {/* Font size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-grey-500" />
            <label className="text-xs font-medium text-grey-600 uppercase tracking-wide">
              Font Size
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-1">
            {EDITOR_FONT_SIZE_OPTIONS.map((size) => {
              const isActive = settings.editorFontSize === size;
              return (
                <button
                  key={size}
                  onClick={() => updateSetting("editorFontSize", size)}
                  className={`
                    py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "border-accent-500 bg-accent-500/8 text-accent-500"
                      : "border-grey-200 bg-grey-100 text-grey-600 hover:border-grey-300 hover:bg-grey-200"
                    }
                  `}
                  aria-pressed={isActive}
                  aria-label={`Set editor font size to ${size}px`}
                >
                  {size}px
                </button>
              );
            })}
          </div>
          {/* Live preview */}
          <div className="mt-3 p-3 rounded-lg bg-grey-100 border border-grey-200">
            <p
              className="text-grey-700 leading-relaxed transition-all duration-150"
              style={{ fontSize: settings.editorFontSize }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
