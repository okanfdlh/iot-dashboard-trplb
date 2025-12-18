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
  Zap
} from "lucide-react";
import {
  getSuhu,
  getCahaya,
  getTerminalStatus,
  getDevices
} from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [data, setData] = useState({
    suhu: null,
    lampu: null,
    terminal: null,
    devices: [],
    terminalCode: null
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Helper: Get Token
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

  // Helper: Fetch Data
  const fetchData = async () => {
    try {
      const token = getToken();
      if (!token) return (window.location.href = "/login");

      // 1. Fetch Devices first to identify IDs
      const devicesRes = await getDevices(token);
      
      // Find specific devices
      const lampDevice = devicesRes.find(d => d.device_type === 'lampu');
      // Assume terminal type is 'terminal' or 'relay'. 
      // Adjust if your API returns something different (e.g. 'terminal_iot')
      const terminalDevice = devicesRes.find(d => d.device_type === 'terminal' || d.device_type === 'relay');
      
      const lampId = lampDevice?.device_code || "lamp-B001";
      const termCode = terminalDevice?.device_code;

      // 2. Fetch statuses in parallel
      const promises = [
        getSuhu(token).catch(e => ({ error: true, message: e.message })),
        getCahaya(token, lampId).catch(e => ({ error: true, message: e.message })),
      ];

      if (termCode) {
        promises.push(getTerminalStatus(token, termCode).catch(e => ({ error: true, message: e.message })));
      } else {
        promises.push(Promise.resolve(null));
      }

      const [suhuRes, lampuRes, terminalRes] = await Promise.all(promises);

      setData({
        suhu: suhuRes?.data || null,
        lampu: lampuRes?.unit || null,
        terminal: terminalRes || null,
        devices: devicesRes,
        terminalCode: termCode
      });
      
      setLastUpdated(new Date());

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Gagal memperbarui data dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Effect: Init & Interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5s refresh
    return () => clearInterval(interval);
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
          <p>Memuat Dashboard IoT...</p>
        </div>
      </div>
    );
  }

  // Formatting Helpers
  const getComfortColor = (status) => {
    if (status === "Dingin") return "text-blue-600 bg-blue-50 border-blue-200";
    if (status === "Nyaman") return "text-green-600 bg-green-50 border-green-200";
    if (status === "Panas") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const { suhu, lampu, terminal, devices, terminalCode } = data;
  const activeDevices = devices.filter(d => d.is_claimed).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">IoT Overview</h1>
          <p className="text-gray-500 text-sm">
            Monitoring sistem secara real-time. 
            {lastUpdated && <span className="ml-1 text-xs text-gray-400">Update: {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div className="flex gap-2">
           {/* Add global actions here if needed */}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: SUHU */}
        <div className="bg-white rounded-xl border shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Thermometer className="h-24 w-24 text-blue-500" />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Thermometer className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Suhu Ruangan</h3>
          </div>

          <div className="space-y-4 relative z-10">
            {suhu ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-800">{suhu.room_temperature_c}</span>
                  <span className="text-gray-500">°C</span>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      {suhu.room_humidity_percent}% RH
                   </div>
                   <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getComfortColor(suhu.comfort_status)}`}>
                     {suhu.comfort_status}
                   </span>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm italic py-4">Data tidak tersedia</div>
            )}
          </div>

          <Link href="/dashboard/suhu" className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t text-sm text-blue-600 font-medium flex items-center justify-between hover:bg-blue-50 transition-colors">
            Lihat Detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* CARD 2: LAMPU */}
        <div className="bg-white rounded-xl border shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Lightbulb className={`h-24 w-24 ${lampu?.lamp_status === 'ON' ? 'text-yellow-500' : 'text-gray-400'}`} />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-lg ${lampu?.lamp_status === 'ON' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              <Lightbulb className={`h-5 w-5 ${lampu?.lamp_status === 'ON' ? 'text-yellow-600' : 'text-gray-500'}`} />
            </div>
            <h3 className="font-semibold text-gray-700">Pencahayaan</h3>
          </div>

          <div className="space-y-4 relative z-10">
            {lampu ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${lampu.lamp_status === 'ON' ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {lampu.lamp_status}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase font-medium">
                    {lampu.mode}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500">
                   Intensitas: <b className="text-gray-700">{lampu.current_lux}</b> Lux
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm italic py-4">Offline / Error</div>
            )}
          </div>

          <Link href="/dashboard/lampu" className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t text-sm text-yellow-600 font-medium flex items-center justify-between hover:bg-yellow-50 transition-colors">
            Kontrol Lampu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* CARD 3: TERMINAL */}
        <div className="bg-white rounded-xl border shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="h-24 w-24 text-green-500" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Power className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Terminal Relay</h3>
          </div>

          <div className="space-y-4 relative z-10">
            {terminal ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border text-center ${terminal.is_on1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-xs text-gray-500 mb-1">Relay 1</div>
                    <div className={`font-bold ${terminal.is_on1 ? 'text-green-600' : 'text-gray-500'}`}>
                      {terminal.is_on1 ? 'ON' : 'OFF'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${terminal.is_on2 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="text-xs text-gray-500 mb-1">Relay 2</div>
                    <div className={`font-bold ${terminal.is_on2 ? 'text-green-600' : 'text-gray-500'}`}>
                      {terminal.is_on2 ? 'ON' : 'OFF'}
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-400">
                  Mode: <span className="font-medium text-gray-600">Manual</span>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm italic py-4">
                {terminalCode ? "Menghubungkan..." : "Terminal tidak ditemukan"}
              </div>
            )}
          </div>

          <Link 
            href={terminalCode ? `/dashboard/kontrol/${terminalCode}` : "/dashboard/kontrol"} 
            className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t text-sm text-green-600 font-medium flex items-center justify-between hover:bg-green-50 transition-colors"
          >
            Akses Kontrol
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* CARD 4: DEVICES */}
        <div className="bg-white rounded-xl border shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Server className="h-24 w-24 text-purple-500" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Cpu className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Total Devices</h3>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-800">{devices.length}</span>
              <span className="text-sm text-gray-500">Unit</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <Activity className="h-3 w-3" />
                {activeDevices} Aktif
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">
                {devices.length - activeDevices} Offline
              </span>
            </div>
          </div>

          <Link href="/dashboard/devices" className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t text-sm text-purple-600 font-medium flex items-center justify-between hover:bg-purple-50 transition-colors">
             Kelola Device
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>

      {/* QUICK STATUS / ALERTS (Optional) */}
      {/* 
        This section could be used for critical alerts, e.g., High Temperature or Device Offline.
        For now, we keep it simple as per request "Mudah dibaca dalam < 5 detik"
      */}
      
    </div>
  );
}
