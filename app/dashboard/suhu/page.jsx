"use client";

import { useEffect, useRef, useState } from "react";
import { getSuhu } from "@/lib/api";
import { toast } from "sonner";
import Chart from "chart.js/auto";
import { Thermometer, Droplets, Activity, LineChart } from "lucide-react";

export default function SuhuPage() {
  const [suhu, setSuhu] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [status, setStatus] = useState("-");
  const [category, setCategory] = useState("-");
  const [lastUpdate, setLastUpdate] = useState("-");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const suhuData = useRef([]);
  const waktuLabels = useRef([]);

  const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1];

  const categorizeSuhu = (temp) => {
    if (temp < 18)
      return { label: "Dingin", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" };
    if (temp <= 25)
      return { label: "Nyaman", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
    return { label: "Panas", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" };
  };

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: { labels: waktuLabels.current, datasets: [{ label: "Suhu (°C)", data: suhuData.current, fill: true, borderWidth: 2, tension: 0.3 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, animation: { duration: 300 } },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  useEffect(() => {
    const loadSuhu = async () => {
      try {
        const token = getToken();
        if (!token) return (window.location.href = "/login");

        const res = await getSuhu(token);
        const temp = res.data.room_temperature_c;

        setSuhu(temp);
        setHumidity(res.data.room_humidity_percent);
        setStatus(res.data.comfort_status);
        setLastUpdate(new Date().toLocaleTimeString());
        setCategory(categorizeSuhu(temp));

        suhuData.current.push(temp);
        waktuLabels.current.push(new Date().toLocaleTimeString());
        if (suhuData.current.length > 20) {
          suhuData.current.shift();
          waktuLabels.current.shift();
        }

        chartInstance.current?.update();
      } catch (err) {
        toast.error(err.message);
      }
    };

    loadSuhu();
    const interval = setInterval(loadSuhu, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Thermometer className="h-8 w-8 text-green-600" />
        <h1 className="text-xl font-bold text-foreground">Monitoring Suhu & Kelembapan</h1>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <DashboardCard title="Suhu Ruangan" icon={<Thermometer className="text-red-500" />}>
          {suhu ? (
            <>
              <div className="text-4xl font-bold text-foreground">{suhu}°C</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <Droplets className="h-4 w-4" /> {humidity}%
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${category.color}`}>{category.label}</span>
              </div>
            </>
          ) : (
            <EmptyText />
          )}
        </DashboardCard>

        <DashboardCard title="Kelembapan" icon={<Droplets className="text-blue-500" />}>
          {humidity ? <div className="text-4xl font-bold text-foreground">{humidity} %</div> : <EmptyText />}
        </DashboardCard>
      </div>

      {/* INFO */}
      <DashboardCard title="Informasi" icon={<Activity className="text-green-500" />}>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Status</span>
          <span className="font-semibold text-foreground">{status}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Update Terakhir</span>
          <span className="text-foreground">{lastUpdate}</span>
        </div>
      </DashboardCard>

      {/* CHART */}
      <DashboardCard title="Grafik Suhu Real-Time" icon={<LineChart className="text-green-500" />}>
        <div className="relative h-64 w-full">
          <canvas ref={chartRef} className="w-full h-full" />
        </div>
      </DashboardCard>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function DashboardCard({ title, icon, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md space-y-3">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">{icon}</div>
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function EmptyText() {
  return <p className="text-sm italic text-muted-foreground text-center">Data tidak tersedia</p>;
}
