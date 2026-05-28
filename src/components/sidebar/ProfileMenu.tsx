"use client";

import {
  Settings,
  Sparkles,
  HelpCircle,
  BookOpen,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useUser } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface ProfileMenuProps {
  collapsed?: boolean;
}

export function ProfileMenu({ collapsed = false }: ProfileMenuProps) {
  const { openSettings } = useAppStore();
  const { data: user } = useUser();

  const initials = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-2.5 rounded-lg transition-colors",
            "hover:bg-grey-100/80 active:bg-grey-200/60 outline-none",
            "focus-visible:ring-2 focus-visible:ring-accent-500/30",
            collapsed
              ? "justify-center p-2"
              : "px-3 py-2.5",
          )}
          aria-label="Account menu"
        >
          {/* Avatar */}
          {user?.avatar ? (
            /*eslint-disable-next-line @next/next/no-img-element*/
            <img
              src={user.avatar}
              alt={user?.name || "User"}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-grey-200/60"
            />
          ) : (
            <div className="w-8 h-8 rounded-full shrink-0 bg-accent-500/15 flex items-center justify-center text-[12px] font-semibold text-accent-500">
              {initials}
            </div>
          )}

          {/* Name + email */}
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-medium text-grey-900 truncate leading-tight">
                  {user?.name || "Loading..."}
                </p>
                <p className="text-[11px] text-grey-500 truncate leading-tight mt-0.5">
                  {user?.email || ""}
                </p>
              </div>

              <ChevronsUpDown className="w-3.5 h-3.5 text-grey-400 shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={collapsed ? "right" : "top"}
        align={collapsed ? "end" : "start"}
        sideOffset={8}
        className="w-[220px]"
      >
        {/* User identity header */}
        <DropdownMenuLabel className="font-normal pb-2">
          <div className="flex items-center gap-2.5">
            {user?.avatar ? (
              /*eslint-disable-next-line @next/next/no-img-element*/
              <img
                src={user.avatar}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full shrink-0 bg-accent-500/15 flex items-center justify-center text-[12px] font-semibold text-accent-500">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-grey-900 truncate">
                {user?.name || "Loading..."}
              </p>
              <p className="text-[11px] text-grey-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Primary actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={openSettings}>
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Sparkles className="w-4 h-4" />
            Upgrade plan
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Resources */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HelpCircle className="w-4 h-4" />
            Get help
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpen className="w-4 h-4" />
            Learn more
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Destructive */}
        <DropdownMenuItem variant="destructive">
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
