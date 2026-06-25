import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import SearchPage from './pages/search/SearchPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';

import AdminOverview from './pages/admin/AdminOverview';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPrivileges from './pages/admin/AdminPrivileges';
import AdminPricingPlans from './pages/admin/AdminPricingPlans';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUserPlans from './pages/admin/AdminUserPlans';
import AdminCredentials from './pages/admin/AdminCredentials';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSystemHealth from './pages/admin/AdminSystemHealth';
import AdminRefunds from './pages/admin/AdminRefunds';

import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerJobs from './pages/worker/WorkerJobs';
import WorkerEarnings from './pages/worker/WorkerEarnings';
import WorkerMessages from './pages/worker/WorkerMessages';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerPublicProfile from './pages/worker/WorkerPublicProfile';
import WorkerSubscription from './pages/worker/WorkerSubscription';
import WorkerServices from './pages/worker/WorkerServices';
import WorkerReviews from './pages/worker/WorkerReviews';
import WorkerRegistration from './pages/auth/WorkerRegistration';

import ChatPage from './pages/chat/ChatPage';
import BookingDetails from './pages/booking/BookingDetails';
import BookingReview from './pages/booking/BookingReview';
import BookingPayment from './pages/booking/BookingPayment';
import CancelBooking from './pages/booking/CancelBooking';
import CustomerBookings from './pages/booking/CustomerBookings';

import ProtectedRoute from './components/auth/ProtectedRoute';

import { ConfigProvider, useConfig } from './context/ConfigContext';
import { useAuth, AuthProvider } from './context/AuthContext';
import MaintenancePage from './pages/MaintenancePage';
import ResetPassword from './pages/auth/ResetPassword';

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
            </SystemModeWrapper>
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;