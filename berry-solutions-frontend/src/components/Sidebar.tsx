"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊", desc: "System Overview" },
  { href: "/students", label: "Students", icon: "🎓", desc: "Manage Records" },
  { href: "/attendance", label: "Attendance", icon: "📋", desc: "RFID Scanner" },
  { href: "/notifications", label: "Messages", icon: "💬", desc: "WhatsApp Alerts" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0a0f1d] text-slate-300 fixed left-0 top-0 h-full flex flex-col shadow-2xl z-50 border-r border-slate-800/50">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      {/* Logo Section */}
      <div className="px-8 py-10 flex flex-col items-start relative z-10 border-b border-slate-800/50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">🫐</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Berry<span className="text-blue-500">Sync</span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-widest uppercase ml-1">Education Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto relative z-10">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-900/50"
                  : "hover:bg-slate-800/50 hover:text-white"
                }`}
            >
              <div className={`flex items-center justify-center rounded-lg w-10 h-10 transition-colors ${isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                }`}>
                <span className={`text-xl transition-transform duration-300 ${isActive || 'group-hover:scale-110'}`}>{item.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.label}</span>
                <span className={`text-[10px] tracking-wide uppercase mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>{item.desc}</span>
              </div>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Active User / Profile Snippet */}
      <div className="p-6 relative z-10 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4 hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
            AD
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white leading-tight">Admin User</p>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
