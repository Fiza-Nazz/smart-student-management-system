"use client";
import { useEffect, useState } from "react";
import { studentApi } from "@/lib/api";

interface Student {
  _id: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  class: string;
  section: string;
  parentName: string;
  parentPhoneNumber: string;
  address: string;
  rfidCardId: string;
  admissionDate: string;
}

const emptyForm = {
  fullName: "", dateOfBirth: "", class: "", section: "",
  parentName: "", parentPhoneNumber: "", address: "", rfidCardId: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (query = "") => {
    try {
      const data = await studentApi.getAll(query);
      setStudents(data.data || []);
    } catch { setStudents([]); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = () => fetchStudents(search);

  const showMsg = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await studentApi.update(editingId, form);
        showMsg("Student updated successfully!", "success");
      } else {
        await studentApi.add(form);
        showMsg("Student added successfully!", "success");
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchStudents(search);
    } catch (err: unknown) {
      const error = err as { message?: string };
      showMsg(error.message || "Something went wrong", "error");
    }
    setLoading(false);
  };

  const handleEdit = (s: Student) => {
    setForm({
      fullName: s.fullName, dateOfBirth: s.dateOfBirth.split("T")[0],
      class: s.class, section: s.section, parentName: s.parentName,
      parentPhoneNumber: s.parentPhoneNumber, address: s.address, rfidCardId: s.rfidCardId,
    });
    setEditingId(s._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await studentApi.delete(id);
      showMsg("Student deleted!", "success");
      fetchStudents(search);
    } catch { showMsg("Failed to delete", "error"); }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="animation-fade-in">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">Student Registry</h1>
          <p className="text-slate-500 text-base md:text-lg">Add, search, and manage student records</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 font-bold flex items-center justify-center gap-2 active:scale-95"
        >
          {showForm ? "✕ Cancel" : "➕ New Student"}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-5 rounded-2xl shadow-sm border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} animation-fade-in`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{message.type === "success" ? "✅" : "⚠️"}</span>
            <span className="font-bold">{message.text}</span>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 md:p-10 mb-8 animation-fade-in relative overflow-hidden border border-slate-200/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-blue-50 rounded-xl text-blue-600">{editingId ? "✏️" : "📝"}</span>
            {editingId ? "Edit Student Profile" : "General Information"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <Input label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(v) => setForm({ ...form, dateOfBirth: v })} required />
            <Input label="Class" value={form.class} onChange={(v) => setForm({ ...form, class: v })} placeholder="e.g., 8th" required />
            <Input label="Section" value={form.section} onChange={(v) => setForm({ ...form, section: v })} placeholder="e.g., A" required />
            <Input label="Parent Name" value={form.parentName} onChange={(v) => setForm({ ...form, parentName: v })} required />
            <Input label="Parent Phone" value={form.parentPhoneNumber} onChange={(v) => setForm({ ...form, parentPhoneNumber: v })} placeholder="e.g., 923001234567" required />
            <div className="sm:col-span-2"><Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required /></div>
            <div className="sm:col-span-2"><Input label="RFID Card ID" value={form.rfidCardId} onChange={(v) => setForm({ ...form, rfidCardId: v })} placeholder="e.g., RFID-123456" required={!editingId} /></div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3 relative z-10">
            <button type="button" onClick={() => setShowForm(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Discard</button>
            <button type="submit" disabled={loading} className="px-10 py-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95">
              {loading ? "⏳ Saving..." : editingId ? "💾 Update Records" : "🚀 Save Student"}
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <span className="text-xl">🔍</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name, ID, or RFID..."
            className="w-full pl-14 pr-4 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg font-medium"
          />
        </div>
        <button onClick={handleSearch} className="px-10 py-5 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-black transition-all font-bold text-lg active:scale-95">
          Search
        </button>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-3xl shadow-sm overflow-hidden border border-slate-200 bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="text-left px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">ID & Status</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Student Identity</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Academic Info</th>
                <th className="text-left px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Guardian Details</th>
                <th className="text-right px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-24 text-slate-400">
                  <div className="text-6xl mb-4 grayscale opacity-20">📂</div>
                  <p className="text-xl font-bold text-slate-300">No student records discovered</p>
                  <p className="mt-1">Try refining your search parameters</p>
                </td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{s.studentId}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm border border-white shadow-sm group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{s.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono tracking-tight">{s.rfidCardId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        Class {s.class} &bull; {s.section}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm text-slate-800 font-bold">{s.parentName}</p>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <span className="text-blue-500">📞</span> {s.parentPhoneNumber}
                      </p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(s)} className="p-2.5 bg-white text-amber-600 border border-slate-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 hover:scale-105 transition-all shadow-sm">
                          <span className="text-lg">✏️</span>
                        </button>
                        <button onClick={() => handleDelete(s._id, s.fullName)} className="p-2.5 bg-white text-red-600 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:scale-105 transition-all shadow-sm">
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-slate-700 mb-1.5 tracking-wide">{label} {required && <span className="text-red-500">*</span>}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
      />
    </div>
  );
}
