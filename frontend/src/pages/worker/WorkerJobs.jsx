import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  MessageSquareText,
  Phone,
  Star,
  Timer,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';
import { apiRequest } from '../../lib/api';

function CountBadge({ children }) {
  return (
    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-bold text-slate-500">
      {children}
    </span>
  );
}

function CustomerBlock({ job }) {
  return (
    <div className="flex items-start gap-4">
      <img
        src={job.avatar}
        alt={job.customer}
        className="h-14 w-14 rounded-full border-2 border-emerald-600 object-cover sm:h-16 sm:w-16"
      />

      <div className="min-w-0 pt-1">
        <h3 className="truncate text-base font-semibold text-slate-950">
          {job.customer}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-600">
          <Star size={15} className="fill-amber-400 text-amber-400" />
          {job.rating}
        </p>
      </div>
    </div>
  );
}

function DetailBlock({ label, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-1 text-base font-semibold text-slate-950">
        {children}
      </div>
    </div>
  );
}

function RequestJobCard({ job, onAccept, onDecline, onChat }) {
  return (
    <article className="overflow-hidden rounded-xl border border-emerald-900/20 bg-white shadow-sm">
      <div className="border-l-4 border-emerald-700 p-5 sm:p-6 2xl:p-7">
        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)_160px] 2xl:grid-cols-[300px_minmax(0,1fr)_190px]">
          <CustomerBlock job={job} />

          <div className="grid gap-6 border-slate-200 sm:grid-cols-2 lg:border-l lg:px-6 2xl:px-8">
            <DetailBlock label="Service">{job.service}</DetailBlock>

            <DetailBlock label="Location">
              <span className="inline-flex items-center gap-1">
                <MapPin size={17} className="text-slate-600" />
                {job.location}
              </span>
            </DetailBlock>

            <DetailBlock label="Date & Time">{job.dateTime}</DetailBlock>

            <DetailBlock label={job.priceLabel}>
              <span className="text-emerald-700">{job.price}</span>
            </DetailBlock>
          </div>

          <div className="flex flex-row items-start justify-between gap-3 border-slate-200 lg:flex-col lg:items-end lg:border-l lg:pl-6 2xl:pl-8">
            <div className="text-left lg:text-right">
              <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold text-emerald-700">
                {job.badge}
              </span>

              <p className="mt-2 text-xs font-medium text-slate-500">
                {job.timeAgo}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold leading-tight text-amber-700">
              <Timer size={16} />
              <span>Respond within 45 minutes</span>
            </div>
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-slate-600">
          &quot;{job.description}&quot;
        </p>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onDecline(job.id)}
              className="rounded-lg border border-red-500 px-8 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 cursor-pointer"
            >
              Decline
            </button>

            <button
              type="button"
              onClick={() => onChat(job.customer)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              <MessageSquareText size={17} />
              Chat
            </button>

            <button
              type="button"
              onClick={() => onAccept(job.id)}
              className="rounded-lg bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 cursor-pointer"
            >
              Accept Job
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActiveJobCard({ job, onComplete, onChat }) {
  return (
    <article className="rounded-xl border border-emerald-900/20 bg-emerald-50/50 shadow-sm">
      <div className="p-5 sm:p-6 2xl:p-7">
        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)_180px] 2xl:grid-cols-[300px_minmax(0,1fr)_220px]">
          <CustomerBlock job={job} />

          <div className="grid gap-6 border-slate-200 sm:grid-cols-2 lg:border-l lg:px-6 2xl:px-8">
            <DetailBlock label="Service">{job.service}</DetailBlock>

            <DetailBlock label="Location">
              <span className="inline-flex items-center gap-1">
                <MapPin size={17} className="text-slate-600" />
                {job.location}
              </span>
            </DetailBlock>

            <DetailBlock label="Started At">{job.startedAt}</DetailBlock>

            <DetailBlock label={job.priceLabel}>
              <span className="text-emerald-700">{job.price}</span>
            </DetailBlock>
          </div>

          <div className="flex flex-col items-start gap-4 border-slate-200 lg:items-end lg:border-l lg:pl-6 2xl:pl-8">
            <span className="inline-flex rounded-full bg-emerald-700 px-4 py-1 text-xs font-bold text-white">
              In Progress
            </span>

            <button
              type="button"
              onClick={() => onChat(job.customer)}
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              <Phone size={15} />
              Call customer
            </button>

            <div className="flex-1" />

            <button
              type="button"
              onClick={() => onComplete(job.id)}
              className="mt-3 w-full rounded-lg bg-emerald-700 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 lg:w-auto cursor-pointer"
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompletedJobCard({ job }) {
  return (
    <article className="rounded-xl border border-emerald-900/20 bg-white shadow-sm">
      <div className="p-5 sm:p-6 2xl:p-7">
        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)_180px] 2xl:grid-cols-[300px_minmax(0,1fr)_220px]">
          <CustomerBlock job={job} />

          <div className="grid gap-6 border-slate-200 sm:grid-cols-2 lg:border-l lg:px-6 2xl:px-8">
            <DetailBlock label="Service">{job.service}</DetailBlock>

            <DetailBlock label="Location">
              <span className="inline-flex items-center gap-1">
                <MapPin size={17} className="text-slate-600" />
                {job.location}
              </span>
            </DetailBlock>

            <DetailBlock label="Completed At">{job.completedAt}</DetailBlock>

            <DetailBlock label={job.priceLabel}>
              <span className="text-emerald-700">{job.price}</span>
            </DetailBlock>
          </div>

          <div className="flex flex-col items-start gap-4 border-slate-200 lg:items-end lg:border-l lg:pl-6 2xl:pl-8">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-700">
              Completed
            </span>

            <div className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
              <CheckCircle2 size={16} />
              Payment received
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {job.review}
        </div>
      </div>
    </article>
  );
}

function CancelledJobCard({ job }) {
  return (
    <article className="rounded-xl border border-red-100 bg-white shadow-sm">
      <div className="p-5 sm:p-6 2xl:p-7">
        <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)_180px] 2xl:grid-cols-[300px_minmax(0,1fr)_220px]">
          <CustomerBlock job={job} />

          <div className="grid gap-6 border-slate-200 sm:grid-cols-2 lg:border-l lg:px-6 2xl:px-8">
            <DetailBlock label="Service">{job.service}</DetailBlock>

            <DetailBlock label="Location">
              <span className="inline-flex items-center gap-1">
                <MapPin size={17} className="text-slate-600" />
                {job.location}
              </span>
            </DetailBlock>

            <DetailBlock label="Cancelled At">{job.cancelledAt}</DetailBlock>

            <DetailBlock label={job.priceLabel}>
              <span className="text-slate-700">{job.price}</span>
            </DetailBlock>
          </div>

          <div className="flex flex-col items-start gap-4 border-slate-200 lg:items-end lg:border-l lg:pl-6 2xl:pl-8">
            <span className="inline-flex rounded-full bg-red-50 px-4 py-1 text-xs font-bold text-red-600">
              Cancelled
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {job.reason}
        </div>
      </div>
    </article>
  );
}

export default function WorkerJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/auth/bookings');
      setBookings(res.data?.data || res.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAccept = async (id) => {
    alert('Job accepted successfully!');
    setBookings((current) =>
      current.map((b) => (b.id === id ? { ...b, status: 'confirmed' } : b))
    );
  };

  const handleDecline = async (id) => {
    try {
      await apiRequest(`/auth/bookings/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: 'Declined by worker' }),
      });
      alert('Job declined.');
      setBookings((current) =>
        current.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert(err.message || 'Failed to decline job.');
    }
  };

  const handleComplete = async (id) => {
    alert('Job marked as completed!');
    setBookings((current) =>
      current.map((b) => (b.id === id ? { ...b, status: 'completed' } : b))
    );
  };

  const handleChat = (customerName) => {
    navigate('/chat', { state: { recipientName: customerName } });
  };

  const mappedJobs = useMemo(() => {
    return bookings.map((b) => ({
      id: b.id,
      customer: b.customer?.name || 'Verified Customer',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.customer?.name || 'Customer')}&background=006D44&color=fff`,
      service: b.service_package?.title || 'Professional Service',
      location: b.address || 'Location not specified',
      dateTime: new Date(b.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      priceLabel: 'Amount',
      price: `LKR ${parseFloat(b.total_price || 0).toLocaleString()}`,
      description: b.notes || 'No additional notes provided.',
      badge: b.status.toUpperCase(),
      timeAgo: new Date(b.created_at || b.scheduled_at).toLocaleDateString([], { dateStyle: 'medium' }),
      startedAt: new Date(b.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      completedAt: new Date(b.updated_at || b.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      review: b.review?.comment || '',
      cancelledAt: new Date(b.updated_at || b.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      reason: b.cancellation_reason || 'No reason provided.',
      rawStatus: b.status.toLowerCase(),
    }));
  }, [bookings]);

  const filteredJobs = useMemo(() => {
    if (activeTab === 'all') return mappedJobs;
    return mappedJobs.filter((job) => {
      if (activeTab === 'active') {
        return ['confirmed', 'assigned', 'in_progress', 'in-progress', 'active'].includes(job.rawStatus);
      }
      return job.rawStatus === activeTab;
    });
  }, [mappedJobs, activeTab]);

  const counts = useMemo(() => {
    const c = { all: mappedJobs.length, pending: 0, active: 0, completed: 0, cancelled: 0 };
    mappedJobs.forEach((job) => {
      if (job.rawStatus === 'pending') c.pending++;
      else if (['confirmed', 'assigned', 'in_progress', 'in-progress', 'active'].includes(job.rawStatus)) c.active++;
      else if (job.rawStatus === 'completed') c.completed++;
      else if (job.rawStatus === 'cancelled') c.cancelled++;
    });
    return c;
  }, [mappedJobs]);

  const tabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Jobs List
            </h1>

            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-b border-slate-300 pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative whitespace-nowrap pb-4 text-sm font-semibold transition sm:text-base cursor-pointer ${
                    activeTab === tab.key
                      ? 'text-emerald-700'
                      : 'text-slate-500 hover:text-emerald-700'
                  }`}
                >
                  {tab.label}

                  {tab.count ? <CountBadge>{tab.count}</CountBadge> : null}

                  {activeTab === tab.key && (
                    <span className="absolute bottom-[-1px] left-0 h-0.5 w-full rounded-full bg-emerald-700" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-10">Loading jobs...</div>
        ) : (
          <div className="space-y-6 2xl:space-y-8">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                if (job.rawStatus === 'pending') {
                  return (
                    <RequestJobCard
                      key={job.id}
                      job={job}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onChat={handleChat}
                    />
                  );
                }
                if (['confirmed', 'assigned', 'in_progress', 'in-progress', 'active'].includes(job.rawStatus)) {
                  return (
                    <ActiveJobCard
                      key={job.id}
                      job={job}
                      onComplete={handleComplete}
                      onChat={handleChat}
                    />
                  );
                }
                if (job.rawStatus === 'completed') {
                  return <CompletedJobCard key={job.id} job={job} />;
                }
                return <CancelledJobCard key={job.id} job={job} />;
              })
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                No jobs found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}