import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const SearchPage = React.lazy(() => import('./pages/search/SearchPage'));
const CustomerDashboard = React.lazy(() => import('./pages/customer/CustomerDashboard'));
const CustomerProfile = React.lazy(() => import('./pages/customer/CustomerProfile'));

const AdminOverview = React.lazy(() => import('./pages/admin/AdminOverview'));
const AdminWorkers = React.lazy(() => import('./pages/admin/AdminWorkers'));
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers'));
const AdminPrivileges = React.lazy(() => import('./pages/admin/AdminPrivileges'));
const AdminPricingPlans = React.lazy(() => import('./pages/admin/AdminPricingPlans'));
const AdminCategories = React.lazy(() => import('./pages/admin/AdminCategories'));
const AdminUserPlans = React.lazy(() => import('./pages/admin/AdminUserPlans'));
const AdminCredentials = React.lazy(() => import('./pages/admin/AdminCredentials'));
const AdminNotifications = React.lazy(() => import('./pages/admin/AdminNotifications'));
const AdminSystemHealth = React.lazy(() => import('./pages/admin/AdminSystemHealth'));
const AdminRefunds = React.lazy(() => import('./pages/admin/AdminRefunds'));

const WorkerDashboard = React.lazy(() => import('./pages/worker/WorkerDashboard'));
const WorkerJobs = React.lazy(() => import('./pages/worker/WorkerJobs'));
const WorkerEarnings = React.lazy(() => import('./pages/worker/WorkerEarnings'));
const WorkerMessages = React.lazy(() => import('./pages/worker/WorkerMessages'));
const WorkerProfile = React.lazy(() => import('./pages/worker/WorkerProfile'));
const WorkerPublicProfile = React.lazy(() => import('./pages/worker/WorkerPublicProfile'));
const WorkerSubscription = React.lazy(() => import('./pages/worker/WorkerSubscription'));
const WorkerServices = React.lazy(() => import('./pages/worker/WorkerServices'));
const WorkerReviews = React.lazy(() => import('./pages/worker/WorkerReviews'));
const WorkerRegistration = React.lazy(() => import('./pages/auth/WorkerRegistration'));

const ChatPage = React.lazy(() => import('./pages/chat/ChatPage'));
const BookingDetails = React.lazy(() => import('./pages/booking/BookingDetails'));
const BookingReview = React.lazy(() => import('./pages/booking/BookingReview'));
const BookingPayment = React.lazy(() => import('./pages/booking/BookingPayment'));
const CancelBooking = React.lazy(() => import('./pages/booking/CancelBooking'));
const CustomerBookings = React.lazy(() => import('./pages/booking/CustomerBookings'));

import ProtectedRoute from './components/auth/ProtectedRoute';

import { ConfigProvider, useConfig } from './context/ConfigContext';
import { useAuth, AuthProvider } from './context/AuthContext';
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));

function SystemModeWrapper({ children }) {
  const { config, loading: configLoading } = useConfig();
  const { user, loading: authLoading } = useAuth();

  if (configLoading || authLoading) {
    return <div className="min-h-screen bg-white" />; // Or a spinner
  }

  const isMaintenance = config?.system_mode === 'maintenance';
  const isAdmin = user?.role === 'admin';

  if (isMaintenance && !isAdmin) {
    return <MaintenancePage />;
  }

  return children;
}

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-[#1B5E44]">
            <SystemModeWrapper>
              <React.Suspense fallback={
                <div className="flex h-screen w-full items-center justify-center bg-white">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
                </div>
              }>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/worker/:id" element={<WorkerPublicProfile />} />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'worker']}>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerBookings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Booking Flow */}
                  <Route
                    path="/book/details"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <BookingDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/book/review"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <BookingReview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/book/payment"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <BookingPayment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/cancel-booking/:id"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CancelBooking />
                      </ProtectedRoute>
                    }
                  />

                  {/* Customer Routes */}
                  <Route
                    path="/customer/profile"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['customer']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminOverview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/workers"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminWorkers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminCustomers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/refunds"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminRefunds />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/privileges"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPrivileges />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pricing-plans"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPricingPlans />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminCategories />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/user-plans"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminUserPlans />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/credentials"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminCredentials />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/notifications"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminNotifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/system"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminSystemHealth />
                      </ProtectedRoute>
                    }
                  />

                  {/* Worker Routes */}
                  <Route
                    path="/worker/register"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerRegistration />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/jobs"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerJobs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/earnings"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerEarnings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/messages"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerMessages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/profile"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/reviews"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerReviews />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/subscription"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerSubscription />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/worker/services"
                    element={
                      <ProtectedRoute allowedRoles={['worker']}>
                        <WorkerServices />
                      </ProtectedRoute>
                    }
                  />

                  {/* Auth routes render the landing page behind the popup */}
                  <Route path="/login" element={<LandingPage />} />
                  <Route path="/signup" element={<LandingPage />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </React.Suspense>
            </SystemModeWrapper>
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;