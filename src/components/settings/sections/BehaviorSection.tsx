"use client";

import { Zap, FilePlus, Save, Activity } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { SettingToggleRow } from "@/components/settings/SettingToggleRow";

export function BehaviorSection() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900 mb-1">Behavior</h3>
        <p className="text-xs text-grey-500 mb-4">
          Control how the app responds to your actions.
        </p>

        <div className="space-y-1">
          {/* Auto-open new note */}
          <SettingToggleRow
            icon={FilePlus}
            label="Auto-open new note"
            description="Jump into the editor immediately after creating a note"
            checked={settings.autoOpenNewNote}
            onCheckedChange={(v) => updateSetting("autoOpenNewNote", v)}
            id="setting-auto-open"
          />

          {/* Save trigger */}
          <div className="py-3 border-b border-grey-100 last:border-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5 min-w-0">
                <Save className="w-4 h-4 text-grey-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-grey-800">Save trigger</p>
                  <p className="text-xs text-grey-500 mt-0.5 leading-relaxed">
                    When changes are saved to the note
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0 mt-0.5">
                {(["instant", "blur"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateSetting("saveTrigger", opt)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 capitalize
                      ${settings.saveTrigger === opt
                        ? "bg-accent-500 border-accent-500 text-white"
                        : "bg-grey-100 border-grey-200 text-grey-600 hover:bg-grey-200"
                      }
                    `}
                    aria-pressed={settings.saveTrigger === opt}
                  >
                    {opt === "instant" ? "Auto" : "On blur"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reduce motion */}
          <SettingToggleRow
            icon={Activity}
            label="Reduce motion"
            description="Disables slide and spring animations for better performance"
            checked={settings.reduceMotion}
            onCheckedChange={(v) => updateSetting("reduceMotion", v)}
            id="setting-reduce-motion"
          />
        </div>
      </div>

      {/* Save trigger hint */}
      <div className="rounded-xl bg-grey-100 border border-grey-200 px-4 py-3">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-grey-800">
              {settings.saveTrigger === "instant" ? "Auto-save active" : "Blur-save active"}
            </p>
            <p className="text-xs text-grey-500 mt-0.5 leading-relaxed">
              {settings.saveTrigger === "instant"
                ? "Notes are saved automatically as you type, after a short pause."
                : "Notes are saved when you click outside the editor area."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
