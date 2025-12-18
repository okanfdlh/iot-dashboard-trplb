"use client";

import {
  LayoutDashboard,
  Cpu,
  Lightbulb,
  Thermometer,
  ToggleLeft,
  LogOut,
} from "lucide-react";

import { NavLink } from "@/components/NavLink";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Devices",
    url: "/dashboard/devices",
    icon: Cpu,
  },
  {
    title: "Monitoring Lampu",
    url: "/dashboard/lampu",
    icon: Lightbulb,
  },
  {
    title: "Monitoring Suhu",
    url: "/dashboard/suhu",
    icon: Thermometer,
  },
  {
    title: "Terminal Kontrol",
    url: "/dashboard/kontrol",
    icon: ToggleLeft,
  },
];


export function DashboardSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ambil token dari cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      // panggil API logout kalau token ada
      if (token) {
        await logout(token);
      }

      toast.success("Logout berhasil");
    } catch (error) {
      console.error(error);
      toast.error("Gagal logout, sesi dihapus");
    } finally {
      // hapus cookie agar middleware block dashboard
      document.cookie = "token=; path=/; max-age=0";
      router.push("/login");
    }
  };

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="flex h-full flex-col bg-sidebar text-sidebar-foreground"
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Cpu className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold truncate">IOT</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            href={item.url}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition"
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            onClick={() => isMobile && setOpenMobile(false)}
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
