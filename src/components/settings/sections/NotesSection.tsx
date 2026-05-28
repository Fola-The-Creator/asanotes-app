"use client";

import { Clock, ShieldAlert } from "lucide-react";
import { useSettings } from "@/hooks";
import { TRASH_EXPIRY_OPTIONS, EXPIRY_LABELS } from "@/constants";
import { SettingToggleRow } from "@/components/settings/SettingToggleRow";

export function NotesSection() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900 mb-1">Notes</h3>
        <p className="text-xs text-grey-500 mb-4">
          Manage how notes are stored, deleted, and protected.
        </p>

        <div className="space-y-1">
          {/* Trash auto-delete */}
          <div className="py-3 border-b border-grey-100">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-grey-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-grey-800">Trash auto-delete</p>
                <p className="text-xs text-grey-500 mt-0.5 leading-relaxed">
                  Notes in Trash are permanently deleted after this period
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {TRASH_EXPIRY_OPTIONS.map((days) => {
                    const isActive = settings.trashExpiryDays === days;
                    return (
                      <button
                        key={days}
                        onClick={() => updateSetting("trashExpiryDays", days)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                          ${isActive
                            ? "bg-accent-500 border-accent-500 text-white"
                            : "bg-grey-100 border-grey-200 text-grey-600 hover:bg-grey-200"
                          }
                        `}
                        aria-pressed={isActive}
                        aria-label={`Set trash expiry to ${EXPIRY_LABELS[days]}`}
                      >
                        {EXPIRY_LABELS[days]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Confirm destructive actions */}
          <SettingToggleRow
            icon={ShieldAlert}
            label="Confirm destructive actions"
            description="Show a confirmation dialog before permanently deleting notes"
            checked={settings.confirmDestructiveActions}
            onCheckedChange={(v) => updateSetting("confirmDestructiveActions", v)}
            id="setting-confirm-delete"
          />
        </div>
      </div>

      {/* Active expiry summary */}
      <div className="rounded-xl bg-grey-100 border border-grey-200 px-4 py-3">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
          <p className="text-xs text-grey-500 leading-relaxed">
            Trashed notes will be permanently deleted after{" "}
            <span className="font-semibold text-grey-800">
              {EXPIRY_LABELS[settings.trashExpiryDays] ?? `${settings.trashExpiryDays} days`}
            </span>
            . This runs automatically when you open the app.
          </p>
        </div>
      </div>
    </div>
  );
}
