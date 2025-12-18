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

  const Switch = ({ active, onClick }) => (
    <button
      disabled={loading}
      onClick={onClick}
      className={`relative w-14 h-8 rounded-full transition ${
        active ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <Power />
          Kontrol Terminal
        </h1>
        <div className="text-sm text-gray-500">
          ID: {terminalCode}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border border-green-300 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relay 1 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Relay 1</div>
              <div className="text-xs text-gray-500">
                Output utama
              </div>
            </div>
            <Switch
              active={relay.is_on1}
              onClick={() => toggleRelay(1)}
            />
          </div>

          {/* Relay 2 */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Relay 2</div>
              <div className="text-xs text-gray-500">
                Output cadangan
              </div>
            </div>
            <Switch
              active={relay.is_on2}
              onClick={() => toggleRelay(2)}
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 pt-4 border-t text-sm text-gray-600 space-y-1">
          <div>
            Mode:{" "}
            <span className="font-medium text-green-600">
              Manual
            </span>
          </div>
          <div>
            Last Update:{" "}
            <span className="font-medium">
              {lastUpdate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
