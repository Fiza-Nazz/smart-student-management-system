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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Student Management</h1>
          <p className="text-slate-500 text-lg">Add, search, update and delete students easily</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 font-medium flex items-center gap-2"
        >
          {showForm ? "✕ Cancel" : "➕ Add Student"}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 shadow-sm border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"} animation-fade-in`}>
          <div className="flex items-center gap-2">
            <span>{message.type === "success" ? "✅" : "⚠️"}</span>
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 mb-8 animation-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-2xl font-bold mb-6 text-slate-800">{editingId ? "✏️ Edit Student Profile" : "📝 New Student Registration"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <Input label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(v) => setForm({ ...form, dateOfBirth: v })} required />
            <Input label="Class" value={form.class} onChange={(v) => setForm({ ...form, class: v })} placeholder="e.g., 8th" required />
            <Input label="Section" value={form.section} onChange={(v) => setForm({ ...form, section: v })} placeholder="e.g., A" required />
            <Input label="Parent Name" value={form.parentName} onChange={(v) => setForm({ ...form, parentName: v })} required />
            <Input label="Parent Phone" value={form.parentPhoneNumber} onChange={(v) => setForm({ ...form, parentPhoneNumber: v })} placeholder="e.g., 923001234567" required />
            <div className="md:col-span-2"><Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required /></div>
            <div className="md:col-span-2"><Input label="RFID Card ID" value={form.rfidCardId} onChange={(v) => setForm({ ...form, rfidCardId: v })} placeholder="e.g., RFID-123456" required={!editingId} /></div>
          </div>
          <div className="mt-8 flex justify-end relative z-10">
            <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all font-medium disabled:opacity-50 flex items-center gap-2">
              {loading ? "⏳ Saving..." : editingId ? "💾 Update Student" : "🚀 Register Student"}
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by student name, ID, or RFID card..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>
        <button onClick={handleSearch} className="px-8 py-4 bg-slate-800 text-white rounded-xl shadow-md hover:bg-slate-900 transition-colors font-medium">
          Search
        </button>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-2xl shadow-sm overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Student ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Class</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Parent Info</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">RFID Card</th>
                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {students.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-500"><div className="text-4xl mb-3">📭</div>No students found. Try adding a new student.</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{s.studentId}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{s.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {s.class} - {s.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-900 font-medium">{s.parentName}</p>
                      <p className="text-xs text-slate-500">{s.parentPhoneNumber}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-500">{s.rfidCardId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex gap-2 justify-end opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(s)} className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-medium">Edit</button>
                        <button onClick={() => handleDelete(s._id, s.fullName)} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">Delete</button>
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
