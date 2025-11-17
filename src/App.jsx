import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UnifiedLogin from './pages/UnifiedLogin'
import StudentRegister from './pages/StudentRegister'
import LandlordRegister from './pages/LandlordRegister'
import PublicListings from './pages/PublicListings'
import StudentDashboard from './pages/StudentDashboard'
import StudentBrowse from './pages/StudentBrowse'
import StudentReservations from './pages/StudentReservations'
import StudentBookings from './pages/StudentBookings'
import StudentFavorites from './pages/StudentFavorites'
import StudentMessages from './pages/StudentMessages'
import StudentSettings from './pages/StudentSettings'
import StudentEscrow from './pages/StudentEscrow'
import SecurePayment from './pages/SecurePayment'
import Notifications from './pages/Notifications'
import LandlordDashboard from './pages/LandlordDashboard'
import LandlordProperties from './pages/LandlordProperties'
import LandlordReservations from './pages/LandlordReservations'
import LandlordBookings from './pages/LandlordBookings'
import AddProperty from './pages/AddProperty'
import LandlordMessages from './pages/LandlordMessages'
import LandlordSettings from './pages/LandlordSettings'
import LandlordEscrow from './pages/LandlordEscrow'
import AdminDashboard from './pages/AdminDashboard'
import AdminVerifications from './pages/AdminVerifications'
import AdminLandlords from './pages/AdminLandlords'
import AdminReports from './pages/AdminReports'
import AdminSettings from './pages/AdminSettings'
import PropertyDetails from './pages/PropertyDetails'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { PropertyProvider } from './context/PropertyContext'
import { AdminProvider } from './context/AdminContext'
import { StudentProvider } from './context/StudentContext'
import { ReservationProvider } from './context/ReservationContext'
import { BookingProvider } from './context/BookingContext'
import { EscrowProvider } from './context/EscrowContext'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AdminProvider>
          <StudentProvider>
            <ReservationProvider>
              <BookingProvider>
                <EscrowProvider>
                  <NotificationProvider>
                    <Router>
                      <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<UnifiedLogin />} />
                <Route path="/listings" element={<PublicListings />} />
                
                {/* Legacy Login Routes (redirect to unified) */}
                <Route path="/student/login" element={<Navigate to="/login" replace />} />
                <Route path="/landlord/login" element={<Navigate to="/login" replace />} />
                
                {/* Registration Routes */}
                <Route path="/student/register" element={<StudentRegister />} />
                <Route path="/landlord/register" element={<LandlordRegister />} />

                {/* Student Routes - Protected */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/browse"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentBrowse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/reservations"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentReservations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/favorites"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentFavorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/messages"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentMessages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/settings"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/escrow"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentEscrow />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/secure-payment"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <SecurePayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />

                {/* Landlord Routes - Protected */}
                <Route
                  path="/landlord/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/properties"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordProperties />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/add-property"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <AddProperty />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/reservations"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordReservations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/messages"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordMessages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/settings"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/landlord/escrow"
                  element={
                    <ProtectedRoute allowedRoles={['landlord']}>
                      <LandlordEscrow />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes - Protected */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/verifications"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminVerifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/landlords"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLandlords />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Routes */}
                <Route
                  path="/property/:id"
                  element={
                    <ProtectedRoute>
                      <PropertyDetails />
                    </ProtectedRoute>
                  }
                />
                      </Routes>
                    </Router>
                  </NotificationProvider>
                </EscrowProvider>
              </BookingProvider>
            </ReservationProvider>
          </StudentProvider>
        </AdminProvider>
      </PropertyProvider>
    </AuthProvider>
  )
}

export default App
