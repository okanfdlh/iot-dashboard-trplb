"use client";

import { useEffect, useState } from "react";
import { getDevices } from "@/lib/api";
import { toast } from "sonner";
import {
  Cpu,
  CheckCircle2,
  Power,
  Clock,
  Network,
} from "lucide-react";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const data = await getDevices(token);
        setDevices(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const totalDevice = devices.length;
  const activeDevice = devices.filter((d) => d.is_claimed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading devices...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

      {/* HERO */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Monitoring Perangkat IoT
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Kelola dan pantau seluruh perangkat IoT Anda secara real-time
              dengan kontrol yang sederhana dan aman.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatBox title="Total Device" value={totalDevice} />
            <StatBox title="Device Aktif" value={activeDevice} />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="flex items-center gap-2">
        <Network className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Daftar Device
        </h2>
      </div>

      {/* EMPTY STATE */}
      {devices.length === 0 && (
        <div className="bg-muted border border-border rounded-xl p-6 text-center text-muted-foreground">
          Belum ada device yang terdaftar
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard key={device.device_code} device={device} />
        ))}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatBox({ title, value }) {
  return (
    <div className="flex items-center gap-4 bg-muted px-5 py-4 rounded-xl min-w-[160px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
        <Cpu className="h-6 w-6 text-primary-foreground" />
      </div>

      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xl font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function DeviceCard({ device }) {
  const isActive = device.is_claimed;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      
      {/* HEADER */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            {device.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {device.device_code}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            device.device_type === "lampu"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {device.device_type.toUpperCase()}
        </span>
      </div>

      {/* BODY */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <Power className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Status:</span>

          {isActive ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Aktif
            </span>
          ) : (
            <span className="text-muted-foreground font-medium">
              Belum diklaim
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          Terakhir online: {device.last_seen_at}
        </div>
      </div>
    </div>
  );
}
