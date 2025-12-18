"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Thermometer,
  Droplets,
  Lightbulb,
  Power,
  Server,
  ArrowRight,
  Activity,
  Cpu,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  getSuhu,
  getCahaya,
  getTerminalStatus,
  getDevices,
} from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState({
    suhu: null,
    lampu: null,
    terminal: null,
    devices: [],
    terminalCode: null,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

  const fetchData = async () => {
    try {
      const token = getToken();
      if (!token) return (window.location.href = "/login");

      const devicesRes = await getDevices(token);
      const lampDevice = devicesRes.find((d) => d.device_type === "lampu");
      const terminalDevice = devicesRes.find(
        (d) => d.device_type === "terminal" || d.device_type === "relay"
      );

      const lampId = lampDevice?.device_code || "lamp-B001";
      const termCode = terminalDevice?.device_code;

      const [suhuRes, lampuRes, terminalRes] = await Promise.all([
        getSuhu(token).catch(() => null),
        getCahaya(token, lampId).catch(() => null),
        termCode ? getTerminalStatus(token, termCode).catch(() => null) : null,
      ]);

      setData({
        suhu: suhuRes?.data || null,
        lampu: lampuRes?.unit || null,
        terminal: terminalRes,
        devices: devicesRes,
        terminalCode: termCode,
      });

      setLastUpdated(new Date());
    } catch (err) {
      toast.error("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="text-sm">Memuat dashboard IoT...</span>
        </div>
      </div>
    );
  }

  const { suhu, lampu, terminal, devices, terminalCode } = data;
  const activeDevices = devices.filter((d) => d.is_claimed).length;

  return (
    <div className="space-y-6 px-4 md:px-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          IoT Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitoring sistem real-time
          {lastUpdated && (
            <span className="ml-2 text-xs">
              • Update {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* SUHU */}
        <DashboardCard
          title="Suhu Ruangan"
          icon={<Thermometer className="text-blue-500" />}
          href="/dashboard/suhu"
        >
          {suhu ? (
            <>
              <div className="text-4xl font-bold text-foreground">
                {suhu.room_temperature_c}°C
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4" />
                  {suhu.room_humidity_percent}%
                </span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600">
                  {suhu.comfort_status}
                </span>
              </div>
            </>
          ) : (
            <EmptyText />
          )}
        </DashboardCard>

        {/* LAMPU */}
        <DashboardCard
          title="Pencahayaan"
          icon={<Lightbulb className="text-yellow-500" />}
          href="/dashboard/lampu"
        >
          {lampu ? (
            <>
              <div
                className={`text-2xl font-bold ${
                  lampu.lamp_status === "ON"
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                }`}
              >
                {lampu.lamp_status}
              </div>
              <p className="text-sm text-muted-foreground">
                Mode {lampu.mode} • {lampu.current_lux} Lux
              </p>
            </>
          ) : (
            <EmptyText />
          )}
        </DashboardCard>

        {/* TERMINAL */}
        <DashboardCard
          title="Terminal Relay"
          icon={<Zap className="text-green-500" />}
          href={
            terminalCode
              ? `/dashboard/kontrol/${terminalCode}`
              : "/dashboard/kontrol"
          }
        >
          {terminal ? (
            <div className="grid grid-cols-2 gap-3 text-center">
              <RelayBox label="Relay 1" active={terminal.is_on1} />
              <RelayBox label="Relay 2" active={terminal.is_on2} />
            </div>
          ) : (
            <EmptyText />
          )}
        </DashboardCard>

        {/* DEVICES */}
        <DashboardCard
          title="Total Devices"
          icon={<Cpu className="text-purple-500" />}
          href="/dashboard/devices"
        >
          <div className="text-4xl font-bold text-foreground">
            {devices.length}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1 text-green-600">
              <Activity className="h-3 w-3" />
              {activeDevices} Aktif
            </span>
            • {devices.length - activeDevices} Offline
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function DashboardCard({ title, icon, href, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-muted p-2">{icon}</div>
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>

      <div className="space-y-2">{children}</div>

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Lihat detail
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function RelayBox({ label, active }) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        active
          ? "bg-green-500/10 text-green-600"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <div className="text-xs">{label}</div>
      <div className="font-bold">{active ? "ON" : "OFF"}</div>
    </div>
  );
}

function EmptyText() {
  return (
    <p className="text-sm italic text-muted-foreground">
      Data tidak tersedia
    </p>
  );
}
