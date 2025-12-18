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

// Mock data notifikasi
const mockNotifications = [
  {
    id: 1,
    type: "domain",
    message: "Domain example.com berhasil diverifikasi",
    time: "2 jam lalu",
    read: false,
  },
  {
    id: 2,
    type: "mailbox",
    message: "Mailbox support@example.com baru dibuat",
    time: "5 jam lalu",
    read: false,
  },
  {
    id: 3,
    type: "alias",
    message: "Alias contact@example.com dikonfigurasi",
    time: "1 hari lalu",
    read: true,
  },
];

export function DashboardTopbar() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-card px-6">
      <SidebarTrigger className="-ml-2" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">IOT Dashboard TRPL B</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 bg-card p-2">
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex flex-col p-2">
                <span className="text-sm font-medium text-foreground">{notif.message}</span>
                <span className="text-xs text-muted-foreground">{notif.time}</span>
              </DropdownMenuItem>
            ))}
            {notifications.length === 0 && (
              <DropdownMenuItem className="text-sm text-muted-foreground">Tidak ada notifikasi</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
