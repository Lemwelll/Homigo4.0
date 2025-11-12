import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UnifiedLogin from './pages/UnifiedLogin'
import StudentLogin from './pages/StudentLogin'
import StudentRegister from './pages/StudentRegister'
import LandlordLogin from './pages/LandlordLogin'
import LandlordRegister from './pages/LandlordRegister'
import StudentDashboard from './pages/StudentDashboard'
import StudentBrowse from './pages/StudentBrowse'
import StudentFavorites from './pages/StudentFavorites'
import StudentMessages from './pages/StudentMessages'
import StudentSettings from './pages/StudentSettings'
import LandlordDashboard from './pages/LandlordDashboard'
import LandlordProperties from './pages/LandlordProperties'
import AddProperty from './pages/AddProperty'
import LandlordMessages from './pages/LandlordMessages'
import LandlordSettings from './pages/LandlordSettings'
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

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AdminProvider>
          <StudentProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<UnifiedLogin />} />
                
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
          </StudentProvider>
        </AdminProvider>
      </PropertyProvider>
    </AuthProvider>
  )
}

export default App
