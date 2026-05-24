import React, { useMemo, useState } from 'react';
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

const bookings = [
  {
    id: 'BK-1041',
    workerName: 'Kasun Silva',
    workerInitials: 'KS',
    category: 'Painter',
    service: 'Room painting',
    date: '28 April 2025',
    time: '9:00 AM',
    location: '45/2 Galle Road, Colombo 03',
    price: 'LKR 5,000',
    advance: 'Advance paid: LKR 2,500',
    status: 'active',
    progress: 'in-progress',
  },
  {
    id: 'BK-1042',
    workerName: 'Awaiting Worker',
    category: 'Pending acceptance',
    service: 'Electrical Repair',
    date: '29 April 2025',
    time: '2:00 PM',
    price: 'LKR 3,500',
    paymentNote: 'Payment on completion',
    status: 'pending',
    responseNote: 'Worker will respond within 1 hour',
  },
  {
    id: 'BK-1043',
    workerName: 'Saman Fernando',
    category: 'Declined',
    service: 'AC Repair',
    date: '30 April 2025',
    time: '10:30 AM',
    price: 'LKR 4,000',
    status: 'declined',
    reason: 'Worker declined your booking request',
    suggestion: 'You can find another available worker for this service.',
  },
  {
    id: 'BK-0985',
    workerName: 'Nuwan Perera',
    category: 'Completed',
    service: 'Kitchen Sink Repair',
    date: '15 April 2025',
    status: 'completed',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'BK-0842',
    workerName: 'Garden Maintenance',
    category: 'Cancelled',
    service: 'Garden Maintenance',
    cancelledDate: 'Cancelled on 10 April 2025',
    status: 'cancelled',
    refundNote: 'Refund processed',
  },
];

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
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((booking) => booking.status === activeTab);
  }, [activeTab]);

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
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}