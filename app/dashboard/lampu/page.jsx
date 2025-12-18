"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Sun, Settings, Timer, Hand } from "lucide-react";
import { getCahaya, setCahayaMode, setCahayaManual } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DEVICE_ID = "lamp-B001";

// default data sementara sebelum API datang
const defaultData = {
  unit: {
    lamp_status: "OFF",
    current_lux: 0,
    mode: "MANUAL",
  },
};

export default function CahayaPage() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1];

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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const { unit } = data;
  const lampOn = unit.lamp_status === "ON";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Lightbulb className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Monitoring Lampu & Cahaya
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau status, intensitas, dan mode operasi lampu
          </p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Status Lampu" icon={<Lightbulb />} center>
          <div
            className={`text-2xl font-bold ${
              lampOn ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"
            }`}
          >
            {unit.lamp_status}
          </div>
        </DashboardCard>

        <DashboardCard title="Intensitas Cahaya" icon={<Sun />} center>
          <div className="text-2xl font-bold text-foreground">{unit.current_lux} lux</div>
        </DashboardCard>

        <DashboardCard title="Mode Operasi" icon={<Settings />} center>
          <div className="text-2xl font-bold text-foreground">{unit.mode}</div>
        </DashboardCard>
      </div>

      {/* CONTROL PANEL */}
      <DashboardCard title="Pengaturan Lampu" icon={<Settings />}>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="outline"
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
          >
            <Sun className="h-4 w-4 mr-2" />
            Auto Lux
          </Button>
          <Button
            variant="outline"
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
          >
            <Timer className="h-4 w-4 mr-2" />
            Auto Time
          </Button>
          <Button
            variant="outline"
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
          >
            <Hand className="h-4 w-4 mr-2" />
            Manual
          </Button>
        </div>

        <Button
          onClick={async () => {
            try {
              const token = getToken();
              await setCahayaManual(token, DEVICE_ID, lampOn ? "OFF" : "ON");
              loadData();
            } catch (e) {
              toast.error(e.message);
            }
          }}
          className={`w-full sm:w-fit ${
            lampOn ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {lampOn ? "Matikan Lampu" : "Nyalakan Lampu"}
        </Button>
      </DashboardCard>
    </div>
  );
}

function DashboardCard({ title, icon, children, center }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-muted p-2">{icon}</div>
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div className={center ? "text-center" : ""}>{children}</div>
    </div>
  );
}
