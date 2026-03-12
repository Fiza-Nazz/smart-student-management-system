"use client";
import { useEffect, useState } from "react";
import { healthApi, studentApi } from "@/lib/api";

interface HealthData {
  status: string;
  service: string;
  version: string;
  uptime: string;
  environment: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    healthApi.check()
      .then((data) => { setHealth(data); setServerOnline(true); })
      .catch(() => setServerOnline(false));
    studentApi.getAll("")
      .then((data) => setStudentCount(data.count || 0))
      .catch(() => { });
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">System Dashboard</h1>
        <p className="text-slate-500 text-lg">Berry Solutions School Management Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Server Status" value={serverOnline ? "Online" : "Offline"} icon="🟢" pattern="from-emerald-500/10 to-transparent" borderColor={serverOnline ? "border-emerald-200" : "border-red-200"} textColor={serverOnline ? "text-emerald-700" : "text-red-700"} />
        <StatCard title="Total Students" value={String(studentCount)} icon="🎓" pattern="from-blue-500/10 to-transparent" borderColor="border-blue-200" textColor="text-blue-700" />
        <StatCard title="System Uptime" value={health?.uptime || "—"} icon="⏱️" pattern="from-indigo-500/10 to-transparent" borderColor="border-indigo-200" textColor="text-indigo-700" />
        <StatCard title="Environment" value={health?.environment || "—"} icon="⚙️" pattern="from-amber-500/10 to-transparent" borderColor="border-amber-200" textColor="text-amber-700" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {health && (
          <div className="xl:col-span-2 glass-panel rounded-2xl p-8 hover-3d relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-600">🗄️</span> Server Information
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 rounded-xl p-6 border border-slate-100">
              <InfoItem label="Service" value={health.service} />
              <InfoItem label="Version" value={`v${health.version}`} />
              <InfoItem label="Status" value={health.status} badge />
              <InfoItem label="Uptime" value={health.uptime} />
            </div>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-8 hover-3d flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-600">⚡</span> Quick Actions
          </h2>
          <div className="flex flex-col gap-3">
            <a href="/students" className="w-full text-center px-6 py-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 font-medium">➕ Manage Students</a>
            <a href="/attendance" className="w-full text-center px-6 py-4 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300 font-medium">📋 RFID Attendance Check</a>
            <a href="/notifications" className="w-full text-center px-6 py-4 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-800/20 hover:bg-slate-900 hover:-translate-y-1 transition-all duration-300 font-medium">💬 Send Bulk Notification</a>
          </div>
        </div>
      </div>

      {/* Expert Signature Footer */}
      <div className="mt-20 mb-6 flex justify-center w-full animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="group relative flex items-center gap-4 px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:border-blue-100 rounded-full transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-1">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-indigo-50/50 to-purple-100/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out"></div>

          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 shadow-inner overflow-hidden group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-shadow duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-20 text-white font-black tracking-tighter text-lg leading-none transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">F</span>
          </div>

          <div className="relative z-10 flex flex-col pr-4">
            <div className="text-[9px] font-bold text-slate-400 tracking-[0.25em] uppercase mb-0.5 flex items-center gap-1.5">
              Designed & Engineered <span className="text-blue-800 text-xs drop-shadow-[0_0_3px_rgba(30,58,138,0.5)] animate-pulse">❤</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500 italic">by</span>
              <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                Fizu
              </span>
            </div>
          </div>

          {/* Edge border gradient line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-700 ease-out opacity-0 group-hover:opacity-100"></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, pattern, borderColor, textColor }: { title: string; value: string; icon: string; pattern: string; borderColor: string; textColor: string }) {
  return (
    <div className={`glass-panel rounded-2xl p-6 border ${borderColor} hover-3d relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${pattern} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1 tracking-wide">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
    </div>
  );
}

function InfoItem({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      {badge ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 self-start">
          {value}
        </span>
      ) : (
        <p className="font-semibold text-slate-800 truncate" title={value}>{value}</p>
      )}
    </div>
  );
}
