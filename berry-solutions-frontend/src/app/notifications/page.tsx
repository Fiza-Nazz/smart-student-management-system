"use client";
import { useState } from "react";
import { notificationApi } from "@/lib/api";

const notifTypes = [
  { value: "absence", label: "Absence Alert", icon: "🔔", desc: "Notify parent about student absence" },
  { value: "late", label: "Late Arrival", icon: "⚠️", desc: "Notify parent about late arrival" },
  { value: "report", label: "Monthly Report", icon: "📊", desc: "Send monthly progress report" },
];

export default function NotificationsPage() {
  const [type, setType] = useState("absence");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [additionalData, setAdditionalData] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string; simulated?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ type: string; phone: string; name: string; success: boolean; message: string; time: string }[]>([]);

  const handleSend = async () => {
    if (!phone.trim() || !name.trim()) return;
    setLoading(true);
    try {
      const data = await notificationApi.send(type, phone, name, additionalData || undefined);
      setResult(data);
      setHistory((prev) => [{ type, phone, name, success: true, message: data.message, time: new Date().toLocaleTimeString() }, ...prev]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      const msg = error.message || "Failed to send";
      setResult({ success: false, message: msg });
      setHistory((prev) => [{ type, phone, name, success: false, message: msg, time: new Date().toLocaleTimeString() }, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">WhatsApp Notifications</h1>
        <p className="text-slate-500 text-lg">Send automated WhatsApp alerts and reports to parents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Form */}
        <div className="glass-panel rounded-3xl p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2 relative z-10"><span className="text-emerald-500">💬</span> Send Message</h2>

          {/* Type Selection */}
          <div className="space-y-3 mb-6 relative z-10">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Select Message Type</label>
            <div className="grid grid-cols-1 gap-3">
              {notifTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center shadow-sm ${type === t.value
                      ? "border-blue-300 bg-blue-50 ring-2 ring-blue-500/20 translate-x-1"
                      : "border-slate-200 hover:bg-slate-50 hover:border-blue-200"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4 shadow-sm transition-colors ${type === t.value ? 'bg-blue-100 text-blue-600' : 'bg-white'}`}>
                    {t.icon}
                  </div>
                  <div>
                    <span className={`font-bold block ${type === t.value ? 'text-blue-800' : 'text-slate-700'}`}>{t.label}</span>
                    <span className="text-sm text-slate-500">{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Parent WhatsApp Number <span className="text-red-500">*</span></label>
              <input
                type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 923001234567"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm font-mono"
              />
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Student Full Name <span className="text-red-500">*</span></label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ali Khan"
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* Additional Data */}
            {(type === "late" || type === "report") && (
              <div className="animation-fade-in">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                  {type === "late" ? "Arrival Time" : "Report Details"} <span className="text-slate-400 font-normal normal-case">(Optional)</span>
                </label>
                <input
                  type="text" value={additionalData} onChange={(e) => setAdditionalData(e.target.value)}
                  placeholder={type === "late" ? "e.g., 8:45 AM" : "e.g., Final Term Score: 85%"}
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !phone || !name}
            className="w-full mt-8 px-6 py-4 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "⏳ Sending Message..." : "📤 Dispatch Notification"}
          </button>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-5 rounded-2xl animation-fade-in border shadow-sm ${result.success ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
              <p className="font-bold flex items-center gap-2">
                <span className="text-xl">{result.success ? "✅" : "⚠️"}</span>
                {result.message}
              </p>
              {result.simulated && (
                <div className="mt-3 flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-white">
                  <span className="text-amber-500">⚡</span>
                  <p className="text-xs font-medium text-slate-600">
                    <strong className="text-slate-800 block mb-0.5">Simulation Mode Active</strong>
                    Message was intercepted and logged. WhatsApp client is not verified or system is running in Dev mode.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* History */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[800px] shadow-sm border border-slate-200">
          <div className="p-8 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 relative z-10"><span>📜</span> Delivery Logs</h2>
            <p className="text-sm text-slate-500 mt-2 relative z-10">Recent notifications sent during this session</p>
          </div>
          <div className="flex-1 overflow-y-auto bg-white/30 p-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-bold text-slate-700 text-lg">No history yet</p>
                <p className="text-slate-500 text-sm mt-2">Sent notifications will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((h, i) => (
                  <div key={i} className={`p-4 rounded-2xl border transition-all hover:shadow-md ${h.success ? "bg-white border-slate-100" : "bg-red-50 border-red-100"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${h.success ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {h.success ? "✓" : "✗"}
                        </span>
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-xs">{h.type}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">{h.time}</span>
                    </div>
                    <div className="ml-10">
                      <p className="text-sm font-medium text-slate-900 mb-0.5">{h.name}</p>
                      <p className="text-xs text-slate-500 font-mono mb-2">{h.phone}</p>
                      <p className={`text-xs ${h.success ? 'text-emerald-600' : 'text-red-500'}`}>{h.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
