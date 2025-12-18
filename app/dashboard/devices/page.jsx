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
    return <div className="p-8 text-gray-500">Loading devices...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

      {/* HERO */}
      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Monitoring Perangkat IoT
            </h1>
            <p className="mt-2 text-gray-500 max-w-xl">
              Kelola dan pantau seluruh perangkat IoT Anda secara real-time
              dengan kontrol yang sederhana dan aman.
            </p>
          </div>

          <div className="flex gap-4">
            <StatBox title="Total Device" value={totalDevice} />
            <StatBox title="Device Aktif" value={activeDevice} />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="flex items-center gap-2">
        <Network className="h-5 w-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Daftar Device
        </h2>
      </div>

      {/* EMPTY */}
      {devices.length === 0 && (
        <div className="bg-gray-50 border rounded-xl p-6 text-center text-gray-500">
          Belum ada device yang terdaftar
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard key={device.device_code} device={device} />
        ))}
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function StatBox({ title, value }) {
  return (
    <div className="flex items-center gap-3 bg-green-50 px-5 py-4 rounded-xl">
      <Cpu className="h-8 w-8 text-green-600" />
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold text-gray-800">{value}</div>
      </div>
    </div>
  );
}

function DeviceCard({ device }) {
  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {device.name}
          </h3>
          <p className="text-xs text-gray-400">
            {device.device_code}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${
            device.device_type === "lampu"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {device.device_type.toUpperCase()}
        </span>
      </div>

      {/* INFO */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="material-icons-outlined text-base text-gray-400">
            power
          </span>
          Status:
          {device.is_claimed ? (
            <span className="text-green-600 font-semibold ml-1">
              Aktif
            </span>
          ) : (
            <span className="text-gray-400 font-medium ml-1">
              Belum diklaim
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="material-icons-outlined text-sm">
            schedule
          </span>
          Terakhir online: {device.last_seen_at}
        </div>
      </div>
    </div>
  );
}
