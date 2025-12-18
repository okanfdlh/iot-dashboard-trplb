"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  Sun,
  Settings,
  Timer,
  Hand,
} from "lucide-react";
import {
  getCahaya,
  setCahayaMode,
  setCahayaManual,
} from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DEVICE_ID = "lamp-B001";

export default function CahayaPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

  const loadData = async () => {
    try {
      const token = getToken();
      if (!token) return (window.location.href = "/login");

      const res = await getCahaya(token, DEVICE_ID);
      setData(res);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const i = setInterval(loadData, 5000);
    return () => clearInterval(i);
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!data) return null;

  const { unit } = data;
  const lampOn = unit.lamp_status === "ON";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Lightbulb className="h-9 w-9 text-green-600" />
        <h1 className="font-bold text-green-600 border-b">
          Monitoring Lampu & Cahaya
        </h1>
      </div>

      {/* INFO */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Status Lampu */}
        <div className="rounded-2xl border p-8 text-center bg-white">
          <Lightbulb
            className={`mx-auto h-24 w-24 transition-colors ${
              lampOn ? "text-yellow-500" : "text-gray-400"
            }`}
          />
          <div className="text-sm text-gray-500 mt-4">Status Lampu</div>
          <div className="text-2xl font-bold">
            {unit.lamp_status}
          </div>
        </div>

        {/* Intensitas */}
        <div className="rounded-2xl border p-6 text-center bg-yellow-50">
          <Sun className="mx-auto h-12 w-12 text-yellow-600 mb-3" />
          <div className="text-xs text-gray-500 uppercase">
            Intensitas Cahaya
          </div>
          <div className="text-2xl font-bold">
            {unit.current_lux} lux
          </div>
        </div>

        {/* Mode */}
        <div className="rounded-2xl border p-6 text-center bg-blue-50">
          <Settings className="mx-auto h-12 w-12 text-blue-600 mb-3" />
          <div className="text-xs text-gray-500 uppercase">
            Mode Operasi
          </div>
          <div className="text-2xl font-bold">
            {unit.mode}
          </div>
        </div>
      </div>

      {/* CONTROL */}
      <div className="border rounded-2xl p-6 bg-white space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-green-600">
          <Settings className="h-5 w-5" />
          Pengaturan Lampu
        </h2>

        <div className="flex gap-3">
          <Button
            onClick={async () => {
              try {
                const token = getToken();
                await setCahayaMode(token, DEVICE_ID, "AUTO_LUX");
                toast.success("Mode AUTO_LUX diaktifkan");
                loadData();
              } catch (e) {
                toast.error(e.message);
              }
            }}
            variant="outline"
          >
            <Sun className="h-4 w-4 mr-2" />
            Auto Lux
          </Button>

          <Button
            onClick={async () => {
              try {
                const token = getToken();
                await setCahayaMode(token, DEVICE_ID, "AUTO_TIME");
                toast.success("Mode AUTO_TIME diaktifkan");
                loadData();
              } catch (e) {
                toast.error(e.message);
              }
            }}
            variant="outline"
          >
            <Timer className="h-4 w-4 mr-2" />
            Auto Time
          </Button>

          <Button
            onClick={async () => {
              try {
                const token = getToken();
                await setCahayaMode(token, DEVICE_ID, "MANUAL");
                toast.success("Mode MANUAL diaktifkan");
                loadData();
              } catch (e) {
                toast.error(e.message);
              }
            }}
            variant="outline"
          >
            <Hand className="h-4 w-4 mr-2" />
            Manual
          </Button>
        </div>

        {/* MANUAL BUTTON */}
        <Button
          onClick={async () => {
            try {
              const token = getToken();
              await setCahayaManual(
                token,
                DEVICE_ID,
                lampOn ? "OFF" : "ON"
              );
              loadData();
            } catch (e) {
              toast.error(e.message);
            }
          }}
          className={lampOn ? "bg-red-600 hover:bg-red-700" : "bg-green-600"}
        >
          {lampOn ? "Matikan Lampu" : "Nyalakan Lampu"}
        </Button>
      </div>
    </div>
  );
}
