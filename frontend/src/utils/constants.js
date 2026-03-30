// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER_PATIENT: '/auth/register/patient',
    LOGIN_PATIENT: '/auth/login/patient',
    REGISTER_DOCTOR: '/auth/register/doctor',
    LOGIN_DOCTOR: '/auth/login/doctor',
  },
  // Patients
  PATIENTS: {
    GET_ALL: '/patients',
    GET_ONE: (id) => `/patients/${id}`,
    UPDATE: (id) => `/patients/${id}`,
    DELETE: (id) => `/patients/${id}`,
    GET_HISTORY: (id) => `/patients/${id}/history`,
  },
  // Doctors
  DOCTORS: {
    GET_ALL: '/doctors',
    GET_ONE: (id) => `/doctors/${id}`,
    UPDATE: (id) => `/doctors/${id}`,
    DELETE: (id) => `/doctors/${id}`,
    GET_SCHEDULE: (id) => `/doctors/${id}/schedule`,
  },
  // Appointments
  APPOINTMENTS: {
    GET_ALL: '/appointments',
    GET_ONE: (id) => `/appointments/${id}`,
    CREATE: '/appointments',
    UPDATE: (id) => `/appointments/${id}`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    DELETE: (id) => `/appointments/${id}`,
  },
  // Prescriptions
  PRESCRIPTIONS: {
    GET_ALL: '/prescriptions',
    GET_ONE: (id) => `/prescriptions/${id}`,
    CREATE: '/prescriptions',
    UPDATE: (id) => `/prescriptions/${id}`,
    DELETE: (id) => `/prescriptions/${id}`,
    GET_BY_PATIENT: (patientId) => `/prescriptions/patient/${patientId}`,
  },
};

// UI Constants
export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
};

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export const FREQUENCY_OPTIONS = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily' },
  { value: 'Three times daily', label: 'Three times daily' },
  { value: 'Twice weekly', label: 'Twice weekly' },
  { value: 'As needed', label: 'As needed' },
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    APPOINTMENT_BOOKED: 'Appointment booked successfully!',
    APPOINTMENT_CANCELLED: 'Appointment cancelled successfully!',
    PRESCRIPTION_CREATED: 'Prescription created successfully!',
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    APPOINTMENT_FAILED: 'Failed to book appointment.',
    FETCH_FAILED: 'Failed to fetch data. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_INPUT: 'Please fill in all required fields correctly.',
  },
};

// Validation rules
export const VALIDATION_RULES = {
  NAME: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]*$/,
    patternMessage: 'Name can only contain letters and spaces',
  },
  EMAIL: {
    required: true,
    type: 'email',
  },
  PASSWORD: {
    required: true,
    minLength: 6,
    maxLength: 128,
  },
  PHONE: {
    required: true,
    type: 'phone',
  },
  AGE: {
    required: true,
    minLength: 1,
    maxLength: 3,
  },
  GENDER: {
    required: true,
  },
};

// Timeout constants
export const TIMEOUTS = {
  API_CALL: 30000, // 30 seconds
  DEBOUNCE: 300, // 300ms
  TOAST_DURATION: 3000, // 3 seconds
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  ROLE: 'role',
  THEME: 'theme',
};

export default {
  API_ENDPOINTS,
  ROLES,
  APPOINTMENT_STATUS,
  GENDER_OPTIONS,
  FREQUENCY_OPTIONS,
  DAYS_OF_WEEK,
  MESSAGES,
  VALIDATION_RULES,
  TIMEOUTS,
  STORAGE_KEYS,
};
