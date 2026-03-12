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
    <div className="space-y-6 md:space-y-10">
      <div className="animation-fade-in">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">Communications Hub</h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl">Broadcast automated notifications and reports via the WhatsApp gateway.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Send Form */}
        <div className="glass-panel rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-blue-900/[0.03] relative overflow-hidden border border-slate-200/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-black mb-8 text-slate-800 flex items-center gap-3 relative z-10">
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600">💬</span> Dispatch Center
          </h2>

          {/* Type Selection */}
          <div className="space-y-4 mb-8 relative z-10">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Protocol</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {notifTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`group w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center shadow-sm ${type === t.value
                    ? "border-blue-500 bg-blue-50/50 shadow-blue-500/10"
                    : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mr-4 shadow-sm transition-all group-active:scale-90 ${type === t.value ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <span className={`font-black block text-sm tracking-tight ${type === t.value ? 'text-blue-900' : 'text-slate-700'}`}>{t.label}</span>
                    <span className={`text-[10px] font-medium leading-none ${type === t.value ? 'text-blue-600/70' : 'text-slate-400 hidden sm:block'}`}>{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guardian Contact (WhastApp)</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">92</span>
                <input
                  type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="300 1234567"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner font-mono text-lg font-bold text-slate-700"
                />
              </div>
            </div>

            {/* Student Name */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recipient Identity</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full student name..."
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner font-bold text-slate-700"
              />
            </div>

            {/* Additional Data */}
            {(type === "late" || type === "report") && (
              <div className="animation-fade-in space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {type === "late" ? "Temporal Data (Time)" : "Performance Metrics"}
                </label>
                <input
                  type="text" value={additionalData} onChange={(e) => setAdditionalData(e.target.value)}
                  placeholder={type === "late" ? "e.g., 08:30 AM" : "e.g., Attendance: 95%"}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner font-bold text-slate-700"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !phone || !name}
            className="w-full mt-10 px-6 py-5 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 font-black text-xl flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95"
          >
            {loading ? "Initializing Gateway..." : "Transmit Notification"}
          </button>

          {/* Result */}
          {result && (
            <div className={`mt-8 p-6 rounded-2xl animation-fade-in border-2 shadow-sm ${result.success ? "bg-white border-emerald-100 text-emerald-900" : "bg-white border-red-100 text-red-900"}`}>
              <p className="font-black text-lg flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.success ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {result.success ? "✓" : "!"}
                </span>
                {result.message}
              </p>
              {result.simulated && (
                <div className="mt-4 flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <span className="text-xl animate-pulse">⚡</span>
                  <div>
                    <strong className="text-blue-900 block text-xs font-black uppercase tracking-widest mb-1">Sandbox Environment Active</strong>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Outgoing transmission was intercepted by the simulation layer. Physical delivery is bypassed in non-production cycles.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* History */}
        <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col h-[600px] md:h-full min-h-[500px] shadow-2xl shadow-slate-900/[0.02] border border-slate-200/50">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3 relative z-10">
              <span className="p-2 bg-white rounded-xl shadow-sm">📜</span> Transmission History
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium relative z-10">Real-time audit log of all communications dispatched in this session.</p>
          </div>

          <div className="flex-1 overflow-y-auto bg-white p-4 custom-scrollbar">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-4 opacity-40">
                <div className="text-6xl grayscale transition-all group-hover:grayscale-0">📡</div>
                <div>
                  <p className="font-black text-slate-800 text-xl tracking-tight">Log Empty</p>
                  <p className="text-slate-400 text-sm">Awaiting first transmission...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((h, i) => (
                  <div key={i} className={`p-5 rounded-2xl border-2 transition-all hover:shadow-xl ${h.success ? "bg-white border-slate-50 hover:border-emerald-100" : "bg-red-50/30 border-red-50 hover:border-red-100"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${h.success ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {h.success ? "✓" : "✗"}
                        </span>
                        <div>
                          <span className="font-black text-slate-900 text-sm block tracking-tight uppercase leading-none mb-1">{h.type}</span>
                          <span className="text-[10px] font-bold text-slate-400 tracking-widest">{h.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pl-13 space-y-1">
                      <p className="text-base font-black text-slate-800 tracking-tight">{h.name}</p>
                      <p className="text-xs text-blue-600 font-bold font-mono tracking-tight">{h.phone}</p>
                      <p className={`text-xs mt-3 font-medium ${h.success ? 'text-slate-500' : 'text-red-500'}`}>{h.message}</p>
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
