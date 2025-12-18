"use client";

import { useEffect, useRef, useState } from "react";
import { getSuhu } from "@/lib/api";
import { toast } from "sonner";
import Chart from "chart.js/auto";
import {
  Thermometer,
  Droplets,
  Activity,
  LineChart,
} from "lucide-react";


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

  /* ===== helper ===== */
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

  const categorizeSuhu = (temp) => {
    if (temp < 18) return { label: "Dingin", color: "bg-blue-100 text-blue-700" };
    if (temp <= 25) return { label: "Nyaman", color: "bg-green-100 text-green-700" };
    return { label: "Panas", color: "bg-red-100 text-red-700" };
  };

  /* ===== init chart ===== */
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: waktuLabels.current,
        datasets: [
          {
            label: "Suhu (°C)",
            data: suhuData.current,
            fill: true,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        animation: { duration: 300 },
      },
    });

    return () => chartInstance.current?.destroy();
  }, []);

  /* ===== fetch suhu ===== */
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

        const cat = categorizeSuhu(temp);
        setCategory(cat);

        // update chart
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

  /* ===== UI ===== */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-bold text-green-600 flex items-center gap-2 border-b p-3">
        <Thermometer className="h-9 w-9 text-green-600" />
        Monitoring Suhu & Kelembapan
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Suhu */}
        <div className="bg-white border rounded-xl p-6 text-center">
          <Thermometer className="h-12 w-12 text-red-500 mx-auto mb-1" />
          <div className="text-sm text-gray-500">Suhu</div>
          <div className="text-2xl font-bold text-red-600">
            {suhu ?? "-"} °C
          </div>

          {category !== "-" && (
            <div className={`mt-2 inline-block px-3 py-1 text-xs rounded ${category.color}`}>
              {category.label}
            </div>
          )}
        </div>

        {/* Kelembapan */}
        <div className="bg-white border rounded-xl p-6 text-center">
          <Droplets className="h-12 w-12 text-blue-500 mx-auto mb-1" />
          <div className="text-sm text-gray-500">Kelembapan</div>
          <div className="text-2xl font-bold text-blue-600">
            {humidity ?? "-"} %
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white border rounded-xl p-6">
        <p className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-600" />
          <b>Status:</b>
          <span className="text-green-600 font-semibold">{status}</span>
        </p>
        <p className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-green-600" />
          <b>Update Terakhir:</b> {lastUpdate}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold text-green-600 flex items-center gap-2 mb-4">
          <LineChart className="h-5 w-5" />
          Grafik Suhu Real-Time
        </h2>

        <canvas ref={chartRef} className="w-full h-64" />
      </div>
    </div>

  );
}
