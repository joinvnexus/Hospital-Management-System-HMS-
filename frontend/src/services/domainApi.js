import apiClient from './api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

const withQuery = (path, params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
};

export const authApi = {
  loginPatient: (payload) => apiClient.post('/auth/login/patient', payload),
  loginDoctor: (payload) => apiClient.post('/auth/login/doctor', payload),
  registerPatient: (payload) => apiClient.post('/auth/register/patient', payload),
  registerDoctor: (payload) => apiClient.post('/auth/register/doctor', payload),
};

export const patientApi = {
  getAll: async () => unwrap(await apiClient.get('/patients')),
  getById: async (patientId) => unwrap(await apiClient.get(`/patients/${patientId}`)),
  update: async (patientId, payload) => unwrap(await apiClient.put(`/patients/${patientId}`, payload)),
  getHistory: async (patientId) => unwrap(await apiClient.get(`/patients/${patientId}/history`)),
};

export const doctorApi = {
  getAll: async () => unwrap(await apiClient.get('/doctors')),
  getById: async (doctorId) => unwrap(await apiClient.get(`/doctors/${doctorId}`)),
  update: async (doctorId, payload) => unwrap(await apiClient.put(`/doctors/${doctorId}`, payload)),
  getSchedule: async (doctorId) => unwrap(await apiClient.get(`/doctors/${doctorId}/schedule`)),
};

export const appointmentApi = {
  getAll: async (filters = {}) => unwrap(await apiClient.get(withQuery('/appointments', filters))) ?? [],
  getById: async (appointmentId) => unwrap(await apiClient.get(`/appointments/${appointmentId}`)),
  create: async (payload) => unwrap(await apiClient.post('/appointments', payload)),
  update: async (appointmentId, payload) => unwrap(await apiClient.put(`/appointments/${appointmentId}`, payload)),
  cancel: async (appointmentId, reason) =>
    unwrap(await apiClient.patch(`/appointments/${appointmentId}/cancel`, { reason })),
  delete: async (appointmentId) => unwrap(await apiClient.delete(`/appointments/${appointmentId}`)),
};

export const prescriptionApi = {
  getAll: async (filters = {}) => unwrap(await apiClient.get(withQuery('/prescriptions', filters))) ?? [],
  getById: async (prescriptionId) => unwrap(await apiClient.get(`/prescriptions/${prescriptionId}`)),
  getByPatient: async (patientId) =>
    unwrap(await apiClient.get(`/prescriptions/patient/${patientId}`)) ?? [],
  create: async (payload) => unwrap(await apiClient.post('/prescriptions', payload)),
  update: async (prescriptionId, payload) =>
    unwrap(await apiClient.put(`/prescriptions/${prescriptionId}`, payload)),
  delete: async (prescriptionId) => unwrap(await apiClient.delete(`/prescriptions/${prescriptionId}`)),
};
