"use client";

import { Mail, LayoutDashboard, Building2, Zap, CreditCard, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Devices", url: "/dashboard/devices", icon: Building2 },
  { title: "Monitoring Lampu", url: "/dashboard/lampu", icon: Mail },
  { title: "Monitoring Suhu", url: "/dashboard/suhu", icon: Zap },
  { title: "Terminal Kontrol", url: "/dashboard/kontrol", icon: CreditCard },
];

export function DashboardSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const handleLogout = () => (window.location.href = "/login");

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="flex h-full flex-col bg-sidebar text-sidebar-foreground"
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold truncate">Kerjamail</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            href={item.url}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            onClick={() => isMobile && setOpenMobile(false)} // otomatis tutup drawer saat mobile
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </Sidebar>
  );
}
