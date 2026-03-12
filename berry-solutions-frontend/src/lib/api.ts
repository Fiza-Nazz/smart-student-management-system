const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// Student APIs
export const studentApi = {
  add: (student: Record<string, string>) => request("/students", { method: "POST", body: JSON.stringify(student) }),
  getAll: (query = "") => request(`/students/search?query=${encodeURIComponent(query)}`),
  getById: (id: string) => request(`/students/${id}`),
  update: (id: string, data: Record<string, string>) => request(`/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/students/${id}`, { method: "DELETE" }),
};

// Attendance APIs
export const attendanceApi = {
  rfidScan: (rfidCardId: string) => request("/attendance/rfid-scan", { method: "POST", body: JSON.stringify({ rfidCardId }) }),
};

// Notification APIs
export const notificationApi = {
  send: (type: string, parentPhone: string, studentName: string, additionalData?: string) =>
    request("/notifications/send", {
      method: "POST",
      body: JSON.stringify({ type, parentPhone, studentName, additionalData }),
    }),
};

// Health Check
export const healthApi = {
  check: () => fetch(`${BASE_URL.replace("/api/v1", "")}/health`).then((r) => r.json()),
};
