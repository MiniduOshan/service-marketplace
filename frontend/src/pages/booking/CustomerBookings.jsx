import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Ban,
  CalendarDays,
  CircleUserRound,
  Clock3,
  Hammer,
  MapPin,
  MessageSquare,
  RotateCcw,
  Star,
  UserRound,
  Wrench,
  XCircle,
  Zap,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import { apiRequest } from '../../lib/api';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Declined', value: 'declined' },
];

const progressSteps = [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
];

function StatusBadge({ children, type }) {
  const styles = {
    painter: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-slate-600',
    cancelled: 'bg-slate-200 text-slate-600',
    declined: 'bg-red-100 text-red-600',
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[type] || styles.painter
      }`}
    >
      {children}
    </span>
  );
}

function BookingAvatar({ booking }) {
  if (booking.avatar) {
    return (
      <img
        src={booking.avatar}
        alt={booking.workerName}
        className="h-16 w-16 rounded-lg object-cover"
      />
    );
  }

  if (booking.status === 'active') {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-700 text-xl font-bold text-white">
        {booking.workerInitials}
      </div>
    );
  }

  if (booking.status === 'pending') {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50 text-slate-500">
        <CircleUserRound size={30} strokeWidth={1.8} />
      </div>
    );
  }

  if (booking.status === 'declined') {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-50 text-red-500">
        <XCircle size={30} strokeWidth={1.8} />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
      <Ban size={30} strokeWidth={1.8} />
    </div>
  );
}

function ProgressBar({ current }) {
  const currentIndex = progressSteps.findIndex((step) => step.value === current);

  return (
    <div className="w-full">
      <div className="relative mt-5 flex items-start justify-between">
        <div className="absolute left-0 right-0 top-[8px] h-[2px] bg-slate-300" />

        {progressSteps.map((step, index) => {
          const isDone = index <= currentIndex;

          return (
            <div
              key={step.value}
              className="relative z-10 flex w-20 flex-col items-center"
            >
              <span
                className={`h-3 w-3 rounded-full ${
                  isDone ? 'bg-emerald-700' : 'bg-slate-300'
                }`}
              />
              <span
                className={`mt-2 text-[10px] font-bold ${
                  isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActiveBookingCard({ booking }) {
  const navigate = useNavigate();

  return (
    <article className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[300px_minmax(330px,1fr)_260px] lg:items-center 2xl:grid-cols-[360px_minmax(420px,1fr)_320px]">
        <div className="flex gap-5">
          <BookingAvatar booking={booking} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
                {booking.workerName}
              </h2>
              <StatusBadge type="painter">{booking.category}</StatusBadge>
            </div>

            <p className="mt-1 text-base text-slate-500">#{booking.id}</p>

            <div className="mt-3 space-y-2 text-base text-slate-600">
              <p className="flex items-center gap-2">
                <Hammer size={15} />
                {booking.service}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays size={15} />
                {booking.date}
              </p>
              <p className="flex items-center gap-2">
                <Clock3 size={15} />
                {booking.time}
              </p>
            </div>
          </div>
        </div>

        <div className="border-y border-slate-200 py-5 lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Location
            </p>
            <p className="mt-2 flex items-start gap-2 text-base text-slate-700">
              <MapPin
                size={22}
                className="mt-0.5 shrink-0 text-emerald-700"
                strokeWidth={2.4}
              />
              {booking.location}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Progress
            </p>
            <ProgressBar current={booking.progress} />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:items-end">
          <div className="text-left lg:text-right">
            <p className="text-lg font-medium text-slate-800">{booking.price}</p>
            <p className="mt-2 text-base font-medium text-emerald-700">
              {booking.advance}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-emerald-700 bg-white px-4 text-base font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              <MessageSquare size={17} />
              Chat
            </button>

            <button
              type="button"
              onClick={() => navigate(`/cancel-booking/${booking.id}`)}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-red-500 px-4 text-base font-medium text-white transition hover:bg-red-600"
            >
              <Ban size={17} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PendingBookingCard({ booking }) {
  return (
    <article className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(260px,1fr)_230px] lg:items-center 2xl:grid-cols-[430px_minmax(320px,1fr)_280px]">
        <div className="flex gap-5">
          <BookingAvatar booking={booking} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
                {booking.workerName}
              </h2>
              <StatusBadge type="pending">{booking.category}</StatusBadge>
            </div>

            <p className="mt-1 text-base text-slate-500">#{booking.id}</p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <Clock3 size={14} />
              {booking.responseNote}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <Zap size={23} className="text-slate-400" />
          <div>
            <p className="text-lg font-medium text-slate-600">{booking.service}</p>
            <p className="text-base text-slate-500">
              {booking.date}, {booking.time}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="text-left lg:text-right">
            <p className="text-lg font-medium text-slate-800">{booking.price}</p>
            <p className="mt-2 text-base text-slate-500">{booking.paymentNote}</p>
          </div>

          <button
            type="button"
            className="h-11 w-fit cursor-pointer rounded-lg border border-slate-300 bg-white px-5 text-base font-medium text-slate-500 transition hover:border-red-300 hover:text-red-500"
          >
            Cancel Request
          </button>
        </div>
      </div>
    </article>
  );
}

function CompletedBookingCard({ booking }) {
  return (
    <article className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(260px,1fr)_190px] lg:items-center 2xl:grid-cols-[430px_minmax(320px,1fr)_260px]">
        <div className="flex gap-5">
          <BookingAvatar booking={booking} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
                {booking.workerName}
              </h2>
              <StatusBadge type="completed">{booking.category}</StatusBadge>
            </div>

            <p className="mt-1 text-base text-slate-500">#{booking.id}</p>

            <div className="mt-3 flex text-amber-400">
              {Array.from({ length: booking.rating }).map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-y border-slate-200 py-5 lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
          <div className="flex items-center gap-3 text-slate-500">
            <Wrench size={21} className="text-slate-400" />
            <div>
              <p className="text-lg font-medium text-slate-600">
                {booking.service}
              </p>
              <p className="text-base text-slate-500">{booking.date}</p>
            </div>
          </div>
        </div>

        <div className="flex lg:justify-end">
          <button
            type="button"
            className="inline-flex h-11 min-w-32 cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-white px-6 text-base font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            <RotateCcw size={17} />
            Rebook
          </button>
        </div>
      </div>
    </article>
  );
}

function CancelledBookingCard({ booking }) {
  return (
    <article className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(260px,1fr)_190px] lg:items-center 2xl:grid-cols-[430px_minmax(320px,1fr)_260px]">
        <div className="flex gap-5">
          <BookingAvatar booking={booking} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-slate-400 sm:text-2xl">
                {booking.workerName}
              </h2>
              <StatusBadge type="cancelled">{booking.category}</StatusBadge>
            </div>

            <p className="mt-1 text-base text-slate-400">#{booking.id}</p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-500">
              <CalendarDays size={14} />
              {booking.refundNote}
            </div>
          </div>
        </div>

        <p className="text-base text-slate-400">{booking.cancelledDate}</p>

        <div className="flex lg:justify-end">
          <button
            type="button"
            className="cursor-pointer text-base font-medium text-slate-500 transition hover:text-emerald-700"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function DeclinedBookingCard({ booking }) {
  return (
    <article className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[360px_minmax(260px,1fr)_190px] lg:items-center 2xl:grid-cols-[430px_minmax(320px,1fr)_260px]">
        <div className="flex gap-5">
          <BookingAvatar booking={booking} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
                {booking.workerName}
              </h2>
              <StatusBadge type="declined">{booking.category}</StatusBadge>
            </div>

            <p className="mt-1 text-base text-slate-500">#{booking.id}</p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
              <AlertCircle size={14} />
              {booking.reason}
            </div>
          </div>
        </div>

        <div className="border-y border-slate-200 py-5 lg:border-y-0 lg:border-x lg:px-6 lg:py-0">
          <div className="flex items-center gap-3 text-slate-500">
            <Wrench size={21} className="text-slate-400" />
            <div>
              <p className="text-lg font-medium text-slate-700">
                {booking.service}
              </p>
              <p className="text-base text-slate-500">
                {booking.date}, {booking.time}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {booking.suggestion}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <p className="text-lg font-medium text-slate-800">{booking.price}</p>

          <button
            type="button"
            className="inline-flex h-11 min-w-36 cursor-pointer items-center justify-center rounded-lg bg-emerald-700 px-6 text-base font-medium text-white transition hover:bg-emerald-800"
          >
            Find Another
          </button>
        </div>
      </div>
    </article>
  );
}

function BookingCard({ booking }) {
  if (booking.status === 'active') return <ActiveBookingCard booking={booking} />;
  if (booking.status === 'pending') return <PendingBookingCard booking={booking} />;
  if (booking.status === 'completed') return <CompletedBookingCard booking={booking} />;
  if (booking.status === 'declined') return <DeclinedBookingCard booking={booking} />;

  return <CancelledBookingCard booking={booking} />;
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function loadBookings() {
      try {
        setLoading(true);
        const res = await apiRequest('/auth/bookings');
        const list = res.data?.data || res.data || [];
        if (isMounted) {
          const mapped = list.map((b) => {
            const workerName = b.worker?.name || 'Verified Pro';
            const initials = workerName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            return {
              id: b.id.toString(),
              workerName,
              workerInitials: initials,
              category: b.service_package?.category?.name || 'Service Pro',
              service: b.service_package?.title || 'Professional Service',
              date: new Date(b.scheduled_at).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }),
              time: new Date(b.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              location: b.address,
              price: `LKR ${parseFloat(b.total_price).toLocaleString()}`,
              advance: `LKR ${(parseFloat(b.total_price) / 2).toLocaleString()} advance paid`,
              status: b.status,
              progress: b.status === 'completed' ? 'done' : b.status,
              rawBooking: b
            };
          });
          setBookings(mapped);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setBookings([]);
          setLoading(false);
        }
      }
    }
    loadBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((booking) => {
      if (activeTab === 'active') {
        return ['confirmed', 'assigned', 'in_progress', 'in-progress', 'active'].includes(booking.status.toLowerCase());
      }
      return booking.status.toLowerCase() === activeTab;
    });
  }, [bookings, activeTab]);

  const shouldScroll = filteredBookings.length > 3;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="bookings" />

      <main className="mx-auto flex w-full max-w-none flex-1 flex-col px-5 py-8 sm:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          My Bookings
        </h1>

        <div className="mt-8 border-b border-slate-300">
          <div className="flex flex-wrap gap-8 sm:gap-11">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`relative cursor-pointer pb-5 text-base font-medium transition ${
                    isActive
                      ? 'text-emerald-700'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-full bg-emerald-700" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <section className="mt-10 min-h-[520px] flex-1">
          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading bookings...</div>
          ) : (
            <div
              className={`space-y-6 pb-4 ${
                shouldScroll
                  ? 'max-h-[620px] overflow-y-auto pr-2'
                  : 'overflow-visible'
              }`}
            >
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                  <UserRound size={40} className="mx-auto text-slate-300" />
                  <h2 className="mt-4 text-xl font-semibold text-slate-800">
                    No bookings found
                  </h2>
                  <p className="mt-2 text-slate-500">
                    There are no bookings in this category yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}