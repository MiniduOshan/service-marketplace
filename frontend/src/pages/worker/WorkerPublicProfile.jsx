import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  ExternalLink,
  Home,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import { apiRequest } from '../../lib/api';

const ratingBreakdown = [
  { stars: 5, count: 136, percent: 92 },
  { stars: 4, count: 10, percent: 7 },
  { stars: 3, count: 2, percent: 2 },
  { stars: 2, count: 0, percent: 0 },
  { stars: 1, count: 0, percent: 0 },
];

const reviews = [
  {
    initials: 'AM',
    name: 'Amila Munasinghe',
    date: '2 weeks ago',
    rating: 5,
    text: 'Great work! Arrived on time and was very professional throughout the job. Highly recommended.',
  },
  {
    initials: 'DP',
    name: 'Dilini Perera',
    date: '1 month ago',
    rating: 5,
    text: 'Extremely satisfied with the service quality. Highly recommend for any home projects.',
  },
];

function Stars({ size = 15 }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={size} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

function StatCard({ label, value, star }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-6 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-center justify-center gap-1">
        <span className="text-base font-semibold text-slate-800">{value}</span>
        {star && <Star size={18} fill="#fbbf24" className="text-amber-400" />}
      </div>
    </div>
  );
}

function SectionCard({ title, children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 ${className}`}
    >
      {title && (
        <h2 className="mb-5 text-base font-semibold text-slate-800">{title}</h2>
      )}
      {children}
    </section>
  );
}

export default function WorkerPublicProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [services, setServices] = useState([]);
  const [workerInfo, setWorkerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWorkerData() {
      try {
        setLoading(true);
        const res = await apiRequest(`/services?worker_id=${id}`);
        const packages = res.data?.data || res.data || [];
        setServices(packages);
        if (packages.length > 0) {
          const primaryPackage = packages[0];
          setWorkerInfo(primaryPackage.worker);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load worker profile.');
        setLoading(false);
      }
    }
    fetchWorkerData();
  }, [id]);

  const handleBookNow = (serviceId, serviceTitle, priceLabel) => {
    navigate('/book/details', {
      state: {
        workerId: id,
        servicePackageId: serviceId,
        workerName: workerInfo?.name || 'Verified Pro',
        serviceTitle: serviceTitle,
        priceLabel: priceLabel,
      },
    });
  };

  const handleChat = () => {
    navigate('/chat', {
      state: {
        workerId: id,
        workerName: workerInfo?.name || 'Verified Pro',
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CustomerNavbar activePage="search" />
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
        </div>
      </div>
    );
  }

  const name = workerInfo?.name || 'SkilledLK Professional';
  const roleName = services.length > 0 ? services[0].title : 'Handyman Pro';
  const displayInitials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const stats = [
    { label: 'JOBS DONE', value: '120+' },
    { label: 'RATING', value: '4.8', star: true },
    { label: 'RESPONSE RATE', value: '98%' },
    { label: 'EXPERIENCE', value: '6+ Yrs' },
  ];

  const aboutText = [
    `With years of experience in high-end projects, I specialize in bringing life to spaces through precision and quality workmanship. My approach focuses on meticulous preparation, premium materials, and a clean workspace.`,
    `I am committed to providing the highest quality finish for my clients. Whether it is a single room refresh or a full estate transformation, I treat every project with the same level of professional care and reliability.`
  ];

  const skills = services.map(s => s.title);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <CustomerNavbar activePage="search" />

      <main className="mx-auto w-full max-w-none px-5 py-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Hero */}
        <section className="relative">
          <div className="h-[250px] overflow-hidden rounded-xl bg-slate-200 sm:h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1600"
              alt="Worker banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-950/60 via-slate-700/30 to-white/20" />
          </div>

          <div className="absolute bottom-[-24px] left-7 flex items-end gap-4 sm:left-9">
            <div className="h-[118px] w-[118px] flex items-center justify-center overflow-hidden rounded-lg border-4 border-white bg-emerald-700 text-white text-4xl font-bold shadow-lg sm:h-[130px] sm:w-[130px]">
              {displayInitials}
            </div>

            <div className="mb-7 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white drop-shadow">
                {name}
              </h1>

              <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-[9px] font-bold uppercase text-white">
                <BadgeCheck size={11} />
                Verified
              </span>

              <span className="rounded bg-amber-400 px-2 py-1 text-[9px] font-bold uppercase text-slate-900">
                Featured
              </span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left content */}
          <div className="space-y-8">
            <SectionCard title={`About ${name.split(' ')[0]}`}>
              <div className="space-y-5 text-sm leading-7 text-slate-600">
                {aboutText.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {skills.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Service Packages">
              <div className="space-y-4">
                {services.map((service) => {
                  const priceLabel = service.price ? `LKR ${parseFloat(service.price).toLocaleString()}` : 'Negotiable';
                  return (
                    <div
                      key={service.id}
                      className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-emerald-700">
                          <Building2 size={20} />
                        </div>

                        <div>
                          <h3 className="text-base font-semibold text-slate-800">
                            {service.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {service.description || 'Professional service package.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-5 sm:flex-col sm:items-end sm:gap-2">
                        <p className="text-sm font-medium text-emerald-700">
                          {priceLabel}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleBookNow(service.id, service.title, priceLabel)}
                          className="h-10 min-w-24 cursor-pointer rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold text-sm"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-emerald-700">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-800">Custom Quote</h3>
                      <p className="mt-1 text-sm text-slate-500">Specific requirements or unique projects.</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-5 sm:flex-col sm:items-end sm:gap-2">
                    <p className="text-sm font-medium text-emerald-700">Contact for Price</p>
                    <button
                      type="button"
                      onClick={handleChat}
                      className="h-10 min-w-24 cursor-pointer rounded-lg border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50 transition font-semibold text-sm"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  Portfolio
                </h2>

                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  View All
                  <ExternalLink size={14} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=900',
                  'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=900',
                ].map((image, index) => (
                  <div
                    key={image}
                    className="overflow-hidden rounded-lg bg-slate-100 h-48"
                  >
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Ratings & Reviews">
              <div className="grid gap-8 border-b border-slate-100 pb-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
                <div className="text-center">
                  <p className="text-5xl font-bold tracking-tight text-slate-950">
                    4.8
                  </p>

                  <div className="mt-3 flex justify-center">
                    <Stars size={18} />
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    Based on 120 reviews
                  </p>
                </div>

                <div className="space-y-3">
                  {ratingBreakdown.map((item) => (
                    <div
                      key={item.stars}
                      className="grid grid-cols-[20px_minmax(0,1fr)_36px] items-center gap-3 text-sm text-slate-400"
                    >
                      <span>{item.stars}</span>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>

                      <span>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <article key={review.name} className="py-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {review.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                              {review.name}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {review.date}
                            </p>
                          </div>

                          <Stars size={14} />
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">
            <SectionCard>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Starting From
              </p>

              <p className="mt-1 text-base font-semibold text-slate-800">
                {services.length > 0 && services[0].price ? `LKR ${parseFloat(services[0].price).toLocaleString()}` : 'Negotiable'}
                <span className="text-sm font-normal text-slate-500">
                  {services.length > 0 && services[0].price ? ' / task' : ''}
                </span>
              </p>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleBookNow(services.length > 0 ? services[0].id : null, roleName, services.length > 0 && services[0].price ? `LKR ${parseFloat(services[0].price).toLocaleString()}` : 'Negotiable')}
                  className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-base font-semibold text-white transition hover:bg-emerald-700"
                >
                  <CalendarDays size={20} />
                  Book Now
                </button>

                <button
                  type="button"
                  onClick={handleChat}
                  className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700"
                >
                  <MessageSquareText size={18} />
                  Chat with {name.split(' ')[0]}
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-700" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Service Locations
                      </h3>
                      <p className="text-sm text-slate-500">
                        Colombo, Gampaha
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Professional Guarantee
                      </h3>
                      <p className="text-sm text-slate-500">
                        6-month warranty on workmanship
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone size={18} className="mt-0.5 shrink-0 text-emerald-700" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">
                        Contact Information
                      </h3>
                      <p className="text-sm text-slate-500">
                        {workerInfo?.phone || '077 ••• • ••••'} (Unlock after booking)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-40 bg-slate-200">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,#f8fafc_0_18%,transparent_19%),radial-gradient(circle_at_65%_35%,#f8fafc_0_24%,transparent_25%),radial-gradient(circle_at_70%_70%,#f8fafc_0_18%,transparent_19%)]" />
                <div className="absolute inset-0 bg-slate-600/55" />

                <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg">
                  <MapPin size={23} fill="currentColor" strokeWidth={1.6} />
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-semibold text-slate-800">
                  Based in Colombo
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Available for onsite visits within 40km
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}