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
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">RFID Attendance System</h1>
        <p className="text-slate-500 text-lg">Scan RFID cards to record student check-in / check-out</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Scanner */}
        <div>
          {/* RFID Scanner */}
          <div className="glass-panel rounded-3xl p-8 mb-8 text-center relative overflow-hidden group hover-3d">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div className="relative z-10 block">
              <div className="text-7xl mb-6 mx-auto bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500">📡</div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">RFID Card Scanner</h2>
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={rfid}
                  onChange={(e) => setRfid(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  placeholder="Enter or select RFID ID..."
                  className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-center text-xl font-mono shadow-sm transition-all"
                />
              </div>
              <button
                onClick={handleScan}
                disabled={loading || !rfid.trim()}
                className="w-full px-8 py-5 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 text-xl font-semibold disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Scanning..." : "📋 Scan Card Now"}
              </button>
            </div>
          </div>

          {/* Scan Result */}
          {result && (
            <div className={`rounded-3xl border p-8 shadow-sm mb-8 animation-fade-in relative overflow-hidden ${result.success ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
              }`}>
              <div className={`absolute top-0 left-0 w-2 h-full ${result.success ? "bg-emerald-500" : "bg-red-500"}`}></div>
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                {result.success ? <span className="text-2xl">✅</span> : <span className="text-2xl">❌</span>}
                <span className={result.success ? "text-emerald-800" : "text-red-800"}>{result.message}</span>
              </h3>
              {result.data && (
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm bg-white/80 p-5 rounded-2xl border border-white/50 shadow-sm">
                  <div><span className="text-slate-500 font-medium uppercase text-xs tracking-wider block mb-1">RFID</span> <span className="font-mono text-slate-800 font-semibold">{result.data.rfidCardId}</span></div>
                  <div><span className="text-slate-500 font-medium uppercase text-xs tracking-wider block mb-1">Date</span> <span className="font-semibold text-slate-800">{result.data.date}</span></div>
                  <div>
                    <span className="text-slate-500 font-medium uppercase text-xs tracking-wider block mb-1">Status</span>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${result.data.status === "Late" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>{result.data.status}</span>
                  </div>
                  <div><span className="text-slate-500 font-medium uppercase text-xs tracking-wider block mb-1">Type</span> <span className="font-semibold text-slate-800 capitalize">{result.type || "—"}</span></div>
                  {result.data.checkInTime && <div className="col-span-2 sm:col-span-1"><span className="text-slate-500 font-medium uppercase text-xs tracking-wider block mb-1">Check In</span> <span className="font-semibold text-slate-800">{new Date(result.data.checkInTime).toLocaleTimeString()}</span></div>}
                  {result.data.checkOutTime && <div className="col-span-2 sm:col-span-1"><span className="text-slate-500 font-medium uppercase text-xs tracking-wider block mb-1">Check Out</span> <span className="font-semibold text-slate-800">{new Date(result.data.checkOutTime).toLocaleTimeString()}</span></div>}
                </div>
              )}
            </div>
          )}

          {/* Scan History */}
          {history.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2"><span>📜</span> Session History</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {history.map((h, i) => (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-xl border transition-colors hover:bg-white ${h.success ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
                    <span className="text-sm font-medium flex items-center gap-2">
                      {h.success ? "✅" : "❌"} <span className="text-slate-700">{h.message}</span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">{h.type || "scan"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Registered Students (click to scan) */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[800px] shadow-sm border border-slate-200 bg-white">
          <div className="p-8 border-b border-slate-100 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 relative z-10"><span>👥</span> Registered Students</h2>
            <p className="text-sm text-slate-500 mt-2 relative z-10">Click a student below to instantly auto-fill their RFID card</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4 text-slate-300">👤</div>
                <p className="font-bold text-slate-700 text-lg">No students registered!</p>
                <p className="text-slate-500 text-sm mt-2 max-w-[250px]">Add students via the Students page first.</p>
                <a href="/students" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all font-medium">
                  ➕ Add Student
                </a>
              </div>
            ) : (
              students.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setRfid(s.rfidCardId)}
                  className={`w-full text-left p-4 my-1 rounded-xl transition-all duration-200 border border-transparent ${rfid === s.rfidCardId
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "hover:bg-slate-50 hover:shadow-sm hover:border-slate-200"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors ${rfid === s.rfidCardId ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                        {s.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-bold transition-colors ${rfid === s.rfidCardId ? "text-blue-700" : "text-slate-800"}`}>{s.fullName}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.class} - {s.section} &bull; {s.studentId}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors ${rfid === s.rfidCardId ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                      {s.rfidCardId}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

