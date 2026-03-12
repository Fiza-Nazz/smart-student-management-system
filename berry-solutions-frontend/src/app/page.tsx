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
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="animation-fade-in">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">System Dashboard</h1>
          <p className="text-slate-500 text-base md:text-lg">Berry Solutions School Management Overview</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <span className={`w-3 h-3 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-sm font-semibold text-slate-700">{serverOnline ? "Server Status: Operational" : "Server Status: Offline"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        <StatCard title="Server Status" value={serverOnline ? "Online" : "Offline"} icon="🟢" pattern="from-emerald-500/10 to-transparent" borderColor={serverOnline ? "border-emerald-200" : "border-red-200"} textColor={serverOnline ? "text-emerald-700" : "text-red-700"} />
        <StatCard title="Total Students" value={String(studentCount)} icon="🎓" pattern="from-blue-500/10 to-transparent" borderColor="border-blue-200" textColor="text-blue-700" />
        <StatCard title="System Uptime" value={health?.uptime || "—"} icon="⏱️" pattern="from-indigo-500/10 to-transparent" borderColor="border-indigo-200" textColor="text-indigo-700" />
        <StatCard title="Environment" value={health?.environment || "—"} icon="⚙️" pattern="from-amber-500/10 to-transparent" borderColor="border-amber-200" textColor="text-amber-700" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
        {health && (
          <div className="xl:col-span-2 glass-panel rounded-3xl p-6 md:p-10 hover-3d relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="p-2 bg-blue-50 rounded-xl text-blue-600">🗄️</span> Server Infrastructure
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-100">
              <InfoItem label="Service" value={health.service} />
              <InfoItem label="Version" value={`v${health.version}`} />
              <InfoItem label="Status" value={health.status} badge />
              <InfoItem label="Uptime" value={health.uptime} />
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-400 font-medium italic">Data refreshed automatically</span>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5"
              >
                🔄 Refresh Logs
              </button>
            </div>
          </div>
        )}

        <div className="glass-panel rounded-3xl p-6 md:p-10 hover-3d flex flex-col relative overflow-hidden border border-slate-200/50">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600">⚡</span> Quick Portal
          </h2>
          <div className="flex flex-col gap-4">
            <a href="/students" className="group w-full flex items-center justify-between px-6 py-5 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm hover:border-blue-500 hover:bg-blue-50/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">🎓</span>
                <span className="font-bold">Students Registry</span>
              </div>
              <span className="text-slate-400 group-hover:text-blue-500 transition-colors">→</span>
            </a>
            <a href="/attendance" className="group w-full flex items-center justify-between px-6 py-5 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 hover:bg-emerald-50/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
                <span className="font-bold">RFID Login</span>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">→</span>
            </a>
            <a href="/notifications" className="group w-full flex items-center justify-between px-6 py-5 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm hover:border-blue-600 hover:bg-blue-600/5 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                <span className="font-bold">WhatsApp Hub</span>
              </div>
              <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Expert Signature Footer */}
      <div className="mt-12 md:mt-24 mb-10 flex justify-center w-full animation-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="group relative flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl hover:border-blue-100 rounded-full transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-indigo-50/50 to-purple-100/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out"></div>

          <div className="relative z-10 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 shadow-inner overflow-hidden group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-shadow duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-20 text-white font-black tracking-tighter text-base md:text-lg leading-none transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">F</span>
          </div>

          <div className="relative z-10 flex flex-col pr-2 md:pr-4">
            <div className="text-[7px] md:text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-0.5 flex items-center gap-1">
              Engineered <span className="text-blue-800 text-xs drop-shadow-[0_0_3px_rgba(30,58,138,0.5)] animate-pulse">❤</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs md:text-sm font-medium text-slate-500 italic">by</span>
              <span className="text-base md:text-lg font-black tracking-tight bg-clip-text text-transparent bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                Fizu
              </span>
            </div>
          </div>
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
