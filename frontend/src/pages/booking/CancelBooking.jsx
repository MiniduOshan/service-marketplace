import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import { apiRequest } from '../../lib/api';

const policyRows = [
  {
    label: 'Before worker accepts',
    value: 'Full refund – Free',
    type: 'success',
  },
  {
    label: 'After acceptance, 24hrs+ before job',
    value: '75% refund – LKR 3,750',
    type: 'normal',
  },
  {
    label: 'Less than 2 hours before job',
    value: '50% refund – LKR 2,500',
    type: 'normal',
  },
  {
    label: 'No-show / job started',
    value: 'No refund',
    type: 'danger',
  },
];

const reasons = [
  'Found a better price elsewhere',
  'Schedule conflict / No longer needed',
  'Change of mind / Personal reasons',
  'Other',
];

export default function CancelBooking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState(
    'Change of mind / Personal reasons'
  );
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadBooking() {
      // Check if details were passed in route state
      if (location.state?.booking) {
        setBooking(location.state.booking);
        setLoading(false);
        return;
      }

      // Otherwise fetch all bookings and find the matching ID
      try {
        setLoading(true);
        const res = await apiRequest('/auth/bookings');
        const list = res.data?.data || res.data || [];
        const found = list.find((b) => b.id.toString() === id);
        if (isMounted) {
          if (found) {
            const workerName = found.worker?.name || 'Verified Pro';
            setBooking({
              id: found.id.toString(),
              workerName,
              service: found.service_package?.title || 'Professional Service',
              date: new Date(found.scheduled_at).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }),
              time: new Date(found.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              total: `LKR ${parseFloat(found.total_price).toLocaleString()}`,
              advance: `LKR ${(parseFloat(found.total_price) / 2).toLocaleString()} advance paid`,
              refundAmount: `LKR ${(parseFloat(found.total_price) / 2).toLocaleString()}`,
              status: found.status.toUpperCase(),
              image: 'https://ui-avatars.com/api/?name=Pro&background=006D44&color=fff',
            });
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadBooking();
    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  const handleConfirmCancellation = async () => {
    try {
      setLoading(true);
      await apiRequest(`/auth/bookings/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({
          reason: selectedReason,
          notes,
        }),
      });
      setLoading(false);
      alert('Booking cancelled successfully.');
      navigate('/bookings');
    } catch (err) {
      setLoading(false);
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <CustomerNavbar activePage="bookings" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-lg">Loading booking details...</p>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <CustomerNavbar activePage="bookings" />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-red-500">Booking not found</h2>
          <p className="text-slate-500 mt-2">Could not load the requested booking details.</p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-6 px-6 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800"
          >
            Go to My Bookings
          </button>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <CustomerNavbar activePage="bookings" />

      <main className="w-full flex-1 px-5 py-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
          aria-label="Go back"
        >
          <ArrowLeft size={26} />
        </button>

        <div className="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:max-w-[1300px] xl:grid-cols-[minmax(0,1fr)_370px] 2xl:max-w-[1480px] 2xl:grid-cols-[minmax(0,920px)_420px] 2xl:gap-12">
          {/* Left Content */}
          <section className="mx-auto w-full max-w-[760px] lg:mx-0 xl:max-w-[840px] 2xl:max-w-[920px]">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-red-500 xl:text-4xl">
                Cancel Booking
              </h1>

              <p className="mt-3 text-base text-slate-500 xl:text-lg">
                We&apos;re sorry to see you go. Please review the cancellation terms below.
              </p>
            </div>

            {/* Cancellation Policy */}
            <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50/60 p-5 sm:p-6 xl:p-7">
              <div className="mb-5 flex items-center gap-3">
                <AlertTriangle size={22} className="text-orange-600" />
                <h2 className="font-semibold text-orange-700">
                  Cancellation Policy
                </h2>
              </div>

              <div className="divide-y divide-amber-200">
                {policyRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-2 py-4 text-base sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-slate-600">{row.label}</span>

                    <span
                      className={`font-semibold sm:text-right ${
                        row.type === 'success'
                          ? 'text-emerald-700'
                          : row.type === 'danger'
                          ? 'text-red-500'
                          : 'text-slate-600'
                      }`}
                    >
                      {row.value}

                      {row.type === 'success' && (
                        <CheckCircle2
                          size={15}
                          className="ml-1 inline-block align-[-2px]"
                        />
                      )}

                      {row.type === 'danger' && (
                        <span className="ml-1 text-red-500">⊗</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Box */}
            <div className="mt-8 flex flex-col gap-5 rounded-xl border border-emerald-100 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 xl:p-7">
              <div>
                <h2 className="font-bold text-emerald-800">
                  You are eligible for a full refund
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Worker has not accepted yet.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Refund Amount
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-700 xl:text-4xl">
                  {booking.refundAmount}
                </p>

                <p className="text-xs font-medium text-emerald-700">
                  (advance paid)
                </p>
              </div>
            </div>

            {/* Reasons */}
            <div className="mt-9">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 xl:text-3xl">
                Reason for cancellation
              </h2>

              <div className="mt-5 space-y-3">
                {reasons.map((reason) => {
                  const isSelected = selectedReason === reason;

                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setSelectedReason(reason)}
                      className="flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-base text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50/30"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-emerald-700'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-emerald-700" />
                        )}
                      </span>

                      <span>{reason}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Additional Notes Optional
                </label>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Provide more details to help us improve..."
                  rows={6}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 xl:text-base"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="h-12 cursor-pointer rounded-lg border border-emerald-700 bg-white px-8 text-base font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Keep my booking
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCancellation}
                  className="h-12 cursor-pointer rounded-lg bg-red-500 px-8 text-base font-semibold text-white transition hover:bg-red-600"
                >
                  Confirm cancellation
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                * This action cannot be undone. Refund will be processed to your
                original payment method within 3-5 business days.
              </p>
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="mx-auto w-full max-w-[760px] space-y-6 lg:mx-0 lg:max-w-none lg:pt-7">
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6 xl:p-7">
              <div className="mb-7 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Booking Summary
                </h2>

                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  #{booking.id}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={booking.image}
                  alt={booking.workerName}
                  className="h-14 w-14 rounded-lg object-cover"
                />

                <div>
                  <h3 className="font-bold text-slate-900">
                    {booking.workerName}
                  </h3>

                  <p className="text-sm text-slate-500">{booking.service}</p>
                </div>
              </div>

              <div className="mt-7 space-y-5 border-y border-slate-200 py-5">
                <div className="flex gap-4">
                  <CalendarDays
                    size={22}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="font-bold text-slate-800">{booking.date}</p>
                    <p className="text-sm text-slate-500">{booking.time}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CreditCard
                    size={23}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="font-bold text-slate-800">
                      {booking.total} Total
                    </p>

                    <p className="text-sm text-slate-500">{booking.advance}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-700" />
                  {booking.status}
                </span>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}