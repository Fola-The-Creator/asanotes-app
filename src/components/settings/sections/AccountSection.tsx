"use client";

import { User, Mail, CalendarDays, Cloud, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";

export function AccountSection() {
  const { data: user } = useUser();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-grey-900 mb-1">Account</h3>
        <p className="text-xs text-grey-500 mb-4">
          Your profile and sync status.
        </p>

        {/* Profile card */}
        <div className="rounded-xl border border-grey-200 bg-grey-100 overflow-hidden">
          {/* Avatar + Name */}
          <div className="p-4 flex items-center gap-3 border-b border-grey-200">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-grey-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent-500/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-accent-600">{initials}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-grey-900 truncate">
                {user?.name ?? "—"}
              </p>
              <p className="text-xs text-grey-500 truncate">{user?.email ?? "—"}</p>
            </div>
          </div>

          {/* Profile details */}
          <div className="divide-y divide-grey-200">
            <ProfileRow icon={User} label="Name" value={user?.name ?? "—"} />
            <ProfileRow icon={Mail} label="Email" value={user?.email ?? "—"} />
            <ProfileRow
              icon={CalendarDays}
              label="Member since"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "—"
              }
            />
          </div>
        </div>
      </div>

      {/* Sync status — placeholder for future backend */}
      <div className="rounded-xl border border-grey-200 bg-grey-100 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-grey-200 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4 text-grey-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-grey-800">Sync &amp; Backup</p>
              <p className="text-xs text-grey-500">Cloud sync coming soon</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 bg-grey-200 text-grey-500 rounded-full">
            Soon
          </span>
        </div>
      </div>

      {/* Sign-out placeholder */}
      <Button
        variant="outline"
        className="w-full justify-center text-grey-600 border-grey-200 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </div>
  );
}

// Internal helper

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Icon className="w-3.5 h-3.5 text-grey-400 shrink-0" />
      <span className="text-xs text-grey-500 w-20 shrink-0">{label}</span>
      <span className="text-xs text-grey-800 font-medium truncate min-w-0">{value}</span>
    </div>
  );
}
