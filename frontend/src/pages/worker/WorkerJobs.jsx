import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  MessageSquareText,
  Phone,
  Star,
  Timer,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

const tabs = [
  { key: 'all', label: 'All', count: 5 },
  { key: 'pending', label: 'Pending', count: 2 },
  { key: 'active', label: 'Active', count: 1 },
  { key: 'completed', label: 'Completed', count: 1 },
  { key: 'cancelled', label: 'Cancelled', count: 1 },
];

const jobRequests = [
  {
    id: 1,
    customer: 'Nimal Karunaratne',
    rating: '4.8',
    avatar: 'https://i.pravatar.cc/120?img=12',
    service: 'Room Painting – Bedroom',
    location: 'Maharagama',
    dateTime: '28 April 2025, 9:00 AM',
    priceLabel: 'Offer Price',
    price: 'LKR 5,000',
    description:
      'I need a professional to paint my master bedroom. The surface area is approximately 250 sq ft. I already have the paint (off-white). Need someone neat and efficient.',
    badge: 'New Request',
    timeAgo: '2 mins ago',
  },
  {
    id: 2,
    customer: 'Sherumi Perera',
    rating: '4.9',
    avatar: 'https://i.pravatar.cc/120?img=49',
    service: 'Plumbing - Leak Fix',
    location: 'Mount Lavinia',
    dateTime: '29 April 2025, 2:30 PM',
    priceLabel: 'Offer Price',
    price: 'LKR 2,500',
    description:
      'Kitchen sink is leaking from the main pipe. Need an urgent look at it. Materials can be purchased nearby if needed.',
    badge: 'New Request',
    timeAgo: '12 mins ago',
  },
];

const activeJobs = [
  {
    id: 3,
    customer: 'Janaka Silva',
    rating: '4.7',
    avatar: 'https://i.pravatar.cc/120?img=59',
    service: 'AC Servicing (x2)',
    location: 'Colombo 07',
    startedAt: 'Today, 10:15 AM',
    priceLabel: 'Agreed Price',
    price: 'LKR 8,000',
  },
];

const completedJobs = [
  {
    id: 4,
    customer: 'Ayesha Fernando',
    rating: '5.0',
    avatar: 'https://i.pravatar.cc/120?img=47',
    service: 'Ceiling Fan Installation',
    location: 'Nugegoda',
    completedAt: '27 April 2025, 4:20 PM',
    priceLabel: 'Final Price',
    price: 'LKR 3,500',
    review: 'Great work completed on time.',
  },
];

const cancelledJobs = [
  {
    id: 5,
    customer: 'Ruwan Jayasinghe',
    rating: '4.6',
    avatar: 'https://i.pravatar.cc/120?img=33',
    service: 'Bathroom Tap Replacement',
    location: 'Dehiwala',
    cancelledAt: '26 April 2025, 11:15 AM',
    priceLabel: 'Offer Price',
    price: 'LKR 2,000',
    reason: 'Customer cancelled due to schedule change.',
  },
];

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

function RequestJobCard({ job }) {
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
              className="rounded-lg border border-red-500 px-8 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Decline
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
            >
              <MessageSquareText size={17} />
              Chat
            </button>

            <button
              type="button"
              className="rounded-lg bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
            >
              Accept Job
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActiveJobCard({ job }) {
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
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:underline"
            >
              <Phone size={15} />
              Call customer
            </button>

            <div className="flex-1" />

            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-emerald-700 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 lg:w-auto"
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

            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700"
            >
              View Details
            </button>
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
  const [activeTab, setActiveTab] = useState('all');

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Job Requests
            </h1>

            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-b border-slate-300 pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative whitespace-nowrap pb-4 text-sm font-semibold transition sm:text-base ${
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

        <div className="space-y-6 2xl:space-y-8">
          {(activeTab === 'all' || activeTab === 'pending') &&
            jobRequests.map((job) => (
              <RequestJobCard key={job.id} job={job} />
            ))}

          {(activeTab === 'all' || activeTab === 'active') &&
            activeJobs.map((job) => (
              <ActiveJobCard key={job.id} job={job} />
            ))}

          {(activeTab === 'all' || activeTab === 'completed') &&
            completedJobs.map((job) => (
              <CompletedJobCard key={job.id} job={job} />
            ))}

          {(activeTab === 'all' || activeTab === 'cancelled') &&
            cancelledJobs.map((job) => (
              <CancelledJobCard key={job.id} job={job} />
            ))}
        </div>
      </div>
    </WorkerLayout>
  );
}