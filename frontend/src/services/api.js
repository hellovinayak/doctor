const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

// ========== PATIENTS ==========
export const patientAPI = {
  getAll: () => request('/patients'),
  getOne: (id) => request(`/patients/${id}`),
  create: (data) => request('/patients/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/patients/${id}`, { method: 'DELETE' }),
};

// ========== DOCTORS ==========
export const doctorAPI = {
  getAll: () => request('/doctors'),
  getOne: (id) => request(`/doctors/${id}`),
  create: (data) => request('/doctors/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/doctors/${id}`, { method: 'DELETE' }),
};

// ========== NURSES ==========
export const nurseAPI = {
  getAll: () => request('/nurses'),
  getOne: (id) => request(`/nurses/${id}`),
  create: (data) => request('/nurses/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/nurses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/nurses/${id}`, { method: 'DELETE' }),
};

// ========== STAFF ==========
export const staffAPI = {
  getAll: () => request('/staff'),
  getOne: (id) => request(`/staff/${id}`),
  create: (data) => request('/staff/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
};

// ========== USERS (Auth / Admin) ==========
export const userAPI = {
  getAll: () => request('/auth/users'),
};

// ========== PRESCRIPTIONS ==========
export const prescriptionAPI = {
  getAll: () => request('/prescriptions'),
  getByPatient: (patientId) => request(`/prescriptions/patient/${patientId}`),
  getOne: (id) => request(`/prescriptions/${id}`),
  create: (data) => request('/prescriptions/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/prescriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/prescriptions/${id}`, { method: 'DELETE' }),
};

// ========== INVOICES ==========
export const invoiceAPI = {
  getAll: () => request('/invoices'),
  getByPatient: (patientId) => request(`/invoices/patient/${patientId}`),
  getOne: (id) => request(`/invoices/${id}`),
  create: (data) => request('/invoices/add', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/invoices/${id}`, { method: 'DELETE' }),
};

// ========== ATTENDANCE ==========
export const attendanceAPI = {
  getQRToken: () => request('/attendance/qr'),
  getAll: () => request('/attendance'),
  scanQR: (data) => request('/attendance/scan', { method: 'POST', body: JSON.stringify(data) }),
};
