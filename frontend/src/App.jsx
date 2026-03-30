import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import { PatientProvider } from './context/PatientContext'
import { DoctorProvider } from './context/DoctorContext'
import { AppointmentProvider } from './context/AppointmentContext'
import { PrescriptionProvider } from './context/PrescriptionContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DoctorsPage from './pages/DoctorsPage'
import PatientRegisterPage from './pages/PatientRegisterPage'
import DoctorRegisterPage from './pages/DoctorRegisterPage'
import PatientDashboard from './pages/PatientDashboard'
import PatientProfileView from './pages/PatientProfileView'
import PatientProfileEdit from './pages/PatientProfileEdit'
import MedicalHistoryView from './pages/MedicalHistoryView'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorProfileView from './pages/DoctorProfileView'
import DoctorProfileEdit from './pages/DoctorProfileEdit'
import DoctorScheduleManager from './pages/DoctorScheduleManager'
import AppointmentBookingForm from './pages/AppointmentBookingForm'
import AppointmentListView from './pages/AppointmentListView'
import AppointmentConfirmationPage from './pages/AppointmentConfirmationPage'
import AppointmentCalendarView from './pages/AppointmentCalendarView'
import PrescriptionCreationForm from './pages/PrescriptionCreationForm'
import PrescriptionListView from './pages/PrescriptionListView'
import PrescriptionDetailView from './pages/PrescriptionDetailView'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <DoctorProvider>
          <AppointmentProvider>
            <PrescriptionProvider>
              <Router>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register/patient" element={<PatientRegisterPage />} />
                  <Route path="/register/doctor" element={<DoctorRegisterPage />} />
                  <Route path="/doctors" element={<DoctorsPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute element={<DashboardPage />} />}
                  />
                  <Route
                    path="/patient/dashboard"
                    element={<ProtectedRoute element={<PatientDashboard />} allowedRoles="patient" />}
                  />
                  <Route
                    path="/patient/profile"
                    element={<ProtectedRoute element={<PatientProfileView />} allowedRoles="patient" />}
                  />
                  <Route
                    path="/patient/profile/edit"
                    element={<ProtectedRoute element={<PatientProfileEdit />} allowedRoles="patient" />}
                  />
                  <Route
                    path="/patient/medical-history"
                    element={<ProtectedRoute element={<MedicalHistoryView />} allowedRoles="patient" />}
                  />
                  <Route
                    path="/doctor/dashboard"
                    element={<ProtectedRoute element={<DoctorDashboard />} allowedRoles="doctor" />}
                  />
                  <Route
                    path="/doctor/profile"
                    element={<ProtectedRoute element={<DoctorProfileView />} allowedRoles="doctor" />}
                  />
                  <Route
                    path="/doctor/profile/edit"
                    element={<ProtectedRoute element={<DoctorProfileEdit />} allowedRoles="doctor" />}
                  />
                  <Route
                    path="/doctor/schedule"
                    element={<ProtectedRoute element={<DoctorScheduleManager />} allowedRoles="doctor" />}
                  />

                  {/* Appointment Routes */}
                  <Route
                    path="/appointments/book"
                    element={<ProtectedRoute element={<AppointmentBookingForm />} allowedRoles={['patient', 'doctor']} />}
                  />
                  <Route
                    path="/appointments"
                    element={<ProtectedRoute element={<AppointmentListView />} allowedRoles={['patient', 'doctor']} />}
                  />
                  <Route
                    path="/appointments/calendar"
                    element={<ProtectedRoute element={<AppointmentCalendarView />} allowedRoles={['patient', 'doctor']} />}
                  />
                  <Route
                    path="/appointments/:id"
                    element={<ProtectedRoute element={<AppointmentConfirmationPage />} allowedRoles={['patient', 'doctor']} />}
                  />

                  {/* Prescription Routes */}
                  <Route
                    path="/prescriptions"
                    element={<ProtectedRoute element={<PrescriptionListView />} allowedRoles={['patient', 'doctor']} />}
                  />
                  <Route
                    path="/prescriptions/create"
                    element={<ProtectedRoute element={<PrescriptionCreationForm />} allowedRoles="doctor" />}
                  />
                  <Route
                    path="/prescriptions/:id"
                    element={<ProtectedRoute element={<PrescriptionDetailView />} allowedRoles={['patient', 'doctor']} />}
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          </PrescriptionProvider>
          </AppointmentProvider>
        </DoctorProvider>
      </PatientProvider>
    </AuthProvider>
  )
}

export default App
