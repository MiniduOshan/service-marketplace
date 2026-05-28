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
import AdminUserPlans from './pages/admin/AdminUserPlans';
import AdminCredentials from './pages/admin/AdminCredentials';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSystemHealth from './pages/admin/AdminSystemHealth';

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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-[#1B5E44]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/worker/:id" element={<WorkerPublicProfile />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/bookings" element={<CustomerBookings />} />

          {/* Booking Flow */}
          <Route path="/book/details" element={<BookingDetails />} />
          <Route path="/book/review" element={<BookingReview />} />
          <Route path="/book/payment" element={<BookingPayment />} />
          <Route path="/cancel-booking/:id" element={<CancelBooking />} />

          {/* Customer Routes */}
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/privileges" element={<AdminPrivileges />} />
          <Route path="/admin/pricing-plans" element={<AdminPricingPlans />} />
          <Route path="/admin/user-plans" element={<AdminUserPlans />} />
          <Route path="/admin/credentials" element={<AdminCredentials />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/system" element={<AdminSystemHealth />} />

          {/* Worker Routes */}
          <Route path="/worker/register" element={<WorkerRegistration />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/jobs" element={<WorkerJobs />} />
          <Route path="/worker/earnings" element={<WorkerEarnings />} />
          <Route path="/worker/messages" element={<WorkerMessages />} />
          <Route path="/worker/profile" element={<WorkerProfile />} />
          <Route path="/worker/reviews" element={<WorkerReviews />} />
          <Route path="/worker/subscription" element={<WorkerSubscription />} />
          <Route path="/worker/services" element={<WorkerServices />} />

          {/* Auth routes render the landing page behind the popup */}
          <Route path="/login" element={<LandingPage />} />
          <Route path="/signup" element={<LandingPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;