import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageSquare,
  Star,
  Target,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

function DashboardCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-emerald-900/20 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-9 w-16 rounded-full transition ${
        checked ? 'bg-emerald-700' : 'bg-slate-300'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-7 w-7 rounded-full bg-white transition ${
          checked ? 'left-8' : 'left-1'
        }`}
      />
    </button>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  iconClass = 'bg-emerald-50 text-emerald-700',
}) {
  return (
    <DashboardCard className="flex min-h-24 items-center gap-5 p-6">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${iconClass}`}
      >
        <Icon size={22} />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <h3 className="text-2xl font-semibold text-slate-950">{value}</h3>
      </div>
    </DashboardCard>
  );
}

function PriorityScoreCard() {
  return (
    <DashboardCard className="p-6">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Priority Score
        </p>

        <p className="text-base font-bold text-emerald-700">
          87<span className="text-slate-950">/100</span>
        </p>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-200">
        <div className="h-2 w-[87%] rounded-full bg-emerald-700" />
      </div>
    </DashboardCard>
  );
}

function JobRequest({ title, location, price }) {
  return (
    <DashboardCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-slate-950">{title}</h3>

          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} />
            {location}
          </p>
        </div>

        <p className="text-lg font-medium text-slate-950">LKR {price}</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          Accept
        </button>

        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Decline
        </button>
      </div>
    </DashboardCard>
  );
}

function UpcomingJob({ time, customer, job, img }) {
  return (
    <DashboardCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3">
        <p className="text-xs font-medium uppercase text-slate-500">{time}</p>

        <span className="rounded-full bg-emerald-100 px-4 py-1 text-[10px] font-bold uppercase text-emerald-700">
          Confirmed
        </span>
      </div>

      <div className="p-6">
        <div className="mb-5 flex items-center gap-4">
          <img
            src={img}
            alt={customer}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div>
            <h3 className="text-lg font-medium text-slate-950">{customer}</h3>
            <p className="text-sm text-slate-500">Job: {job}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex-1 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <CheckCircle2 size={15} className="mr-2 inline" />
            Mark Complete
          </button>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:text-emerald-700"
            aria-label="Message"
          >
            <MessageSquare size={16} />
          </button>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:text-emerald-700"
            aria-label="Details"
          >
            <Target size={16} />
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}

function EarningsCard() {
  return (
    <div
      className="rounded-xl p-8 text-white shadow-lg shadow-emerald-900/10 2xl:p-10"
      style={{
        background:
          'linear-gradient(135deg, #047857 0%, #047857 45%, #14532d 100%)',
      }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-100">
            Earnings this month
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            LKR 42,000
          </h2>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/25 bg-white/10 px-6 py-4 font-medium transition hover:bg-white/20"
        >
          View earnings
          <ChevronRight size={21} />
        </button>
      </div>

      <div className="mt-8 grid max-w-lg grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-emerald-100">Completed Jobs</p>
          <p className="mt-1 text-2xl font-bold">12</p>
        </div>

        <div>
          <p className="text-sm text-emerald-100">Avg. Rating</p>
          <p className="mt-1 text-2xl font-bold">4.9 ★</p>
        </div>

        <div>
          <p className="text-sm text-emerald-100">Response Rate</p>
          <p className="mt-1 text-2xl font-bold">94%</p>
        </div>
      </div>
    </div>
  );
}

function AvailabilityCard({ available, setAvailable }) {
  return (
    <DashboardCard className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
        <CalendarCheck2 size={30} />
      </div>

      <h3 className="font-medium text-slate-950">Availability</h3>

      <p className="mt-3 max-w-[230px] leading-relaxed text-slate-500">
        Are you ready to accept new bookings today?
      </p>

      <div className="mt-7 flex items-center gap-4">
        <span
          className={`font-medium ${
            available ? 'text-slate-400' : 'text-slate-950'
          }`}
        >
          OFFLINE
        </span>

        <Toggle checked={available} onChange={setAvailable} />

        <span
          className={`font-medium ${
            available ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          AVAILABLE
        </span>
      </div>
    </DashboardCard>
  );
}

export default function WorkerDashboard() {
  const [available, setAvailable] = useState(true);

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-slate-950">
            Thursday, May 23, 2024
          </h2>

          <DashboardCard className="px-5 py-3">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-medium text-slate-950">
                  Pro Plan · Active
                </p>
                <p className="text-xs text-slate-400">Renews June 12</p>
              </div>

              <button
                type="button"
                className="text-xs font-semibold uppercase text-emerald-700 hover:underline"
              >
                Manage
              </button>
            </div>
          </DashboardCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 2xl:gap-8">
          <StatusCard icon={CheckCircle2} label="Status" value="Active" />

          <StatusCard
            icon={Star}
            label="Badge"
            value="Featured"
            iconClass="bg-amber-50 text-amber-500"
          />

          <PriorityScoreCard />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:gap-8">
          <EarningsCard />

          <AvailabilityCard
            available={available}
            setAvailable={setAvailable}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.9fr)] 2xl:gap-10">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-medium text-slate-950">
                New Job Requests (3)
              </h2>

              <button
                type="button"
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              <JobRequest
                title="Electrical Wiring Repair"
                location="Nugegoda, Colombo"
                price="4,500"
              />

              <JobRequest
                title="Ceiling Fan Installation"
                location="Maharagama"
                price="2,200"
              />

              <JobRequest
                title="Main Switch Replacement"
                location="Mount Lavinia"
                price="3,800"
              />
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-medium text-slate-950">
                Upcoming Jobs
              </h2>

              <button
                type="button"
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                View Schedule
              </button>
            </div>

            <div className="space-y-5">
              <UpcomingJob
                time="Today, 2:00 PM"
                customer="Mrs. Samanthi Silva"
                job="Kitchen Lighting Overhaul"
                img="https://i.pravatar.cc/120?img=47"
              />

              <UpcomingJob
                time="Tomorrow, 10:00 AM"
                customer="Mr. Aruna Gunawardena"
                job="Garden Lamp Installation"
                img="https://i.pravatar.cc/120?img=13"
              />
            </div>
          </section>
        </div>
      </div>
    </WorkerLayout>
  );
}