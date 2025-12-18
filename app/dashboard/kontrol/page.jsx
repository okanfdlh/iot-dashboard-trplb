"use client";

import { useEffect, useState } from "react";
import {
  getTerminalStatus,
  controlTerminal,
} from "@/lib/api";
import { Power } from "lucide-react";
import { toast } from "sonner";

/* ambil token dari cookie */
const getToken = () =>
  document.cookie
    .split("; ")
    .find((r) => r.startsWith("token="))
    ?.split("=")[1];

export default function TerminalPage({ params }) {
  const terminalCode = params.code;

  const [relay, setRelay] = useState({
    is_on1: 0,
    is_on2: 0,
  });
  const [lastUpdate, setLastUpdate] = useState("-");
  const [loading, setLoading] = useState(false);

  /* load status */
  const loadStatus = async () => {
    try {
      const token = getToken();
      if (!token) return (window.location.href = "/login");

      const data = await getTerminalStatus(token, terminalCode);
      setRelay({
        is_on1: data.is_on1,
        is_on2: data.is_on2,
      });
      setLastUpdate(data.updated_at);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  /* toggle relay */
  const toggleRelay = async (channel) => {
    try {
      setLoading(true);
      const token = getToken();

      const payload = {
        is_on1:
          channel === 1 ? (relay.is_on1 ? 0 : 1) : relay.is_on1,
        is_on2:
          channel === 2 ? (relay.is_on2 ? 0 : 1) : relay.is_on2,
      };

      await controlTerminal(token, terminalCode, payload);

      setRelay(payload);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  function RelayCard({ label, desc, active, onClick, loading }) {
    return (
      <div
        className={`rounded-lg border p-4 flex items-center justify-between
        ${active
            ? "bg-green-500/10 border-green-500/20"
            : "bg-muted border-border"
          }`}
      >
        <div>
          <div className="font-medium text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>

        <Switch active={active} onClick={onClick} loading={loading} />
      </div>
    );
  }


  const Switch = ({ active, onClick, loading }) => (
    <button
      disabled={loading}
      onClick={onClick}
      className={`relative w-12 h-7 rounded-full transition
      ${active ? "bg-green-500" : "bg-muted"}`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-background shadow transition
        ${active ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  return (
    <div className="space-y-6 px-4 md:px-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Power className="h-6 w-6 text-green-500" />
          Kontrol Terminal
        </h1>
        <p className="text-sm text-muted-foreground">
          ID: {terminalCode}
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition">
        {/* RELAY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Relay 1 */}
          <RelayCard
            label="Relay 1"
            desc="Output utama"
            active={relay.is_on1}
            onClick={() => toggleRelay(1)}
            loading={loading}
          />

          {/* Relay 2 */}
          <RelayCard
            label="Relay 2"
            desc="Output cadangan"
            active={relay.is_on2}
            onClick={() => toggleRelay(2)}
            loading={loading}
          />
        </div>

        {/* FOOTER INFO */}
        <div className="mt-6 pt-4 border-t border-border text-sm flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode</span>
            <span className="font-medium text-green-600">Manual</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Update</span>
            <span className="font-medium text-foreground">
              {lastUpdate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

}
