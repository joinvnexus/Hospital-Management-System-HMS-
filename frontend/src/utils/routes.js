export const ROUTES = {
  home: '/',
  login: '/login',
  registerPatient: '/register/patient',
  registerDoctor: '/register/doctor',
  doctors: '/doctors',
  patientDashboard: '/patient/dashboard',
  patientProfile: '/patient/profile',
  patientHistory: '/patient/medical-history',
  doctorDashboard: '/doctor/dashboard',
  doctorProfile: '/doctor/profile',
  doctorSchedule: '/doctor/schedule',
  appointments: '/appointments',
  bookAppointment: '/appointments/book',
  appointmentCalendar: '/appointments/calendar',
  prescriptions: '/prescriptions',
  createPrescription: '/prescriptions/create',
};

export const getDashboardRoute = (role) =>
  role === 'doctor' ? ROUTES.doctorDashboard : ROUTES.patientDashboard;

export const getProfileRoute = (role) =>
  role === 'doctor' ? ROUTES.doctorProfile : ROUTES.patientProfile;

export const getPrimaryNav = (role, isAuthenticated) => {
  if (!isAuthenticated) {
    return [
      { label: 'Home', href: ROUTES.home },
      { label: 'Find Doctors', href: ROUTES.doctors },
      { label: 'Sign In', href: ROUTES.login },
    ];
  }

  if (role === 'doctor') {
    return [
      { label: 'Dashboard', href: ROUTES.doctorDashboard },
      { label: 'Appointments', href: ROUTES.appointments },
      { label: 'Schedule', href: ROUTES.doctorSchedule },
      { label: 'Prescriptions', href: ROUTES.prescriptions },
    ];
  }

  return [
    { label: 'Dashboard', href: ROUTES.patientDashboard },
    { label: 'Find Doctors', href: ROUTES.doctors },
    { label: 'Appointments', href: ROUTES.appointments },
    { label: 'Prescriptions', href: ROUTES.prescriptions },
  ];
};
