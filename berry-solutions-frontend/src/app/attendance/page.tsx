"use client";
import { useState, useEffect } from "react";
import { attendanceApi, studentApi } from "@/lib/api";

interface ScanResult {
  success: boolean;
  message: string;
  data?: {
    rfidCardId: string;
    checkInTime?: string;
    checkOutTime?: string;
    date: string;
    status: string;
    isLate: boolean;
  };
  type?: string;
  isLate?: boolean;
}

interface Student {
  _id: string;
  studentId: string;
  fullName: string;
  rfidCardId: string;
  class: string;
  section: string;
}

export default function AttendancePage() {
  const [rfid, setRfid] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Load registered students so user can click to auto-fill RFID
  useEffect(() => {
    studentApi.getAll("").then((data) => setStudents(data.data || [])).catch(() => { });
  }, []);

  const handleScan = async () => {
    if (!rfid.trim()) return;
    setLoading(true);
    try {
      const data = await attendanceApi.rfidScan(rfid);
      setResult(data);
      setHistory((prev) => [data, ...prev]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setResult({ success: false, message: error.message || "Scan failed" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="animation-fade-in group">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">RFID Portal</h1>
        <p className="text-slate-500 text-base md:text-lg max-w-2xl">High-speed contactless attendance tracking. Scan registered RFID identifiers to log activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Left: Scanner */}
        <div className="space-y-6 md:space-y-8">
          {/* RFID Scanner */}
          <div className="glass-panel rounded-[2rem] p-6 md:p-12 text-center relative overflow-hidden group hover-3d border border-slate-200/50 shadow-xl shadow-blue-900/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.03] to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-8 group-hover:scale-110 transition-transform duration-700">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <div className="text-6xl md:text-8xl bg-white w-24 h-24 md:w-40 md:h-40 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-slate-100 relative z-10">
                  <span className="animate-bounce">📡</span>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-black mb-8 text-slate-800 tracking-tight">Scanner Terminal</h2>

              <div className="w-full max-w-sm mb-6">
                <input
                  type="text"
                  value={rfid}
                  onChange={(e) => setRfid(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  placeholder="Scan identifier..."
                  className="w-full px-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-center text-2xl md:text-3xl font-black font-mono shadow-inner transition-all tracking-wider text-blue-700"
                />
              </div>

              <button
                onClick={handleScan}
                disabled={loading || !rfid.trim()}
                className="w-full max-w-sm px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl shadow-slate-900/30 hover:bg-black hover:-translate-y-1 transition-all duration-300 text-xl font-bold disabled:opacity-30 disabled:hover:translate-y-0 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : "Execute Scan"}
              </button>
            </div>
          </div>

          {/* Scan Result */}
          {result && (
            <div className={`rounded-[2rem] border-2 p-6 md:p-8 shadow-2xl shadow-slate-200 transition-all animation-fade-in relative overflow-hidden ${result.success ? "bg-white border-emerald-100" : "bg-white border-red-100"
              }`}>
              <div className={`absolute top-0 left-0 w-2 h-full ${result.success ? "bg-emerald-500" : "bg-red-500"}`}></div>
              <h3 className="font-black text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${result.success ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                  {result.success ? "✓" : "!"}
                </span>
                <span className={result.success ? "text-emerald-900" : "text-red-900"}>{result.message}</span>
              </h3>

              {result.data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scanned Identifier</span>
                    <span className="font-mono text-blue-700 font-bold text-base">{result.data.rfidCardId}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operation Date</span>
                    <span className="font-bold text-slate-800 text-base">{result.data.date}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Entry Status</span>
                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tight ${result.data.status === "Late" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>{result.data.status}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Event Flow</span>
                    <span className="font-bold text-slate-800 text-base capitalize">{result.type || "N/A"}</span>
                  </div>
                  {result.data.checkInTime && <div className="col-span-1 space-y-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Time In</span> <span className="font-black text-slate-900 text-lg">{new Date(result.data.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>}
                  {result.data.checkOutTime && <div className="col-span-1 space-y-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Time Out</span> <span className="font-black text-slate-900 text-lg">{new Date(result.data.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Registered Students */}
        <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col h-[600px] md:h-[800px] shadow-2xl shadow-blue-900/[0.03] border border-slate-200/50 bg-white">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3 relative z-10">
              <span className="p-2 bg-white rounded-xl shadow-sm">👥</span> Registry Access
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-medium relative z-10">Select a student record to auto-populate scanner memory</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-3 custom-scrollbar">
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-10 space-y-4">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-5xl grayscale opacity-30">👤</div>
                <div>
                  <p className="font-black text-slate-800 text-xl tracking-tight">Empty Database</p>
                  <p className="text-slate-400 text-sm mt-1">Please register students to begin scanning.</p>
                </div>
                <a href="/students" className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all font-bold">
                  ➕ Student Registry
                </a>
              </div>
            ) : (
              students.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setRfid(s.rfidCardId)}
                  className={`group w-full text-left p-4 my-1.5 rounded-2xl transition-all duration-300 border ${rfid === s.rfidCardId
                    ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20 -translate-y-1"
                    : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 shadow-sm"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shadow-md border-2 transition-all group-active:scale-95 ${rfid === s.rfidCardId
                        ? "bg-white text-blue-600 border-blue-400"
                        : "bg-slate-50 text-slate-500 border-white group-hover:bg-white"
                        }`}>
                        {s.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-black text-base tracking-tight transition-colors ${rfid === s.rfidCardId ? "text-white" : "text-slate-800"}`}>{s.fullName}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${rfid === s.rfidCardId ? "text-blue-100" : "text-slate-400"}`}>
                          {s.class} &bull; {s.section}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] font-black transition-all ${rfid === s.rfidCardId
                      ? "bg-blue-700/50 text-white border-blue-400/30"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>
                      {s.rfidCardId}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* History Snippet at Bottom */}
          {history.length > 0 && (
            <div className="p-4 bg-slate-900 text-slate-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Session Activity: {history.length} Scan{history.length !== 1 && 's'} Recorded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

