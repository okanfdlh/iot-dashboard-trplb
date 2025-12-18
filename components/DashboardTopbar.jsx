"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

// Mock data notifikasi
const mockNotifications = [
  
];

export function DashboardTopbar() {
  const [notifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-6">
      <SidebarTrigger className="-ml-2" />

      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">
          IoT Dashboard TRPL B
        </h1>

        <div className="flex items-center gap-2">
          {/* 🌙 Theme Toggle */}
          <ThemeToggle />

          {/* 🔔 Notification */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 bg-card p-2">
              {notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="flex flex-col items-start p-2"
                >
                  <span className="text-sm font-medium text-foreground">
                    {notif.message}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notif.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
