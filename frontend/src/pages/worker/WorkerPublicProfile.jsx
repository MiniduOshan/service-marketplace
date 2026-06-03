import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  MessageSquareText,
  Phone,
  UserRound,
  Star,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { apiRequest, getStoredSessionUser } from '../../lib/api';
import { useConfig } from '../../context/ConfigContext';

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
  const isLoggedIn = !!getStoredSessionUser();
  const { config } = useConfig();

  const [services, setServices] = useState([]);
  const [workerInfo, setWorkerInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
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
        try {
          const reviewsRes = await apiRequest(`/workers/${id}/reviews`);
          setReviews(reviewsRes.data?.data || reviewsRes.data || reviewsRes || []);
        } catch (_) {
          setReviews([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load worker profile.');
        setLoading(false);
      }
    }
    fetchWorkerData();
  }, [id]);

  const reviewsCount = reviews.length;
  const averageRating = reviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
    : null;

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
      {isLoggedIn ? <CustomerNavbar activePage="search" /> : <Navbar />}
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
        </div>
      </div>
    );
  }

  const name = workerInfo?.name || 'SkilledLK Professional';
  const roleName = services.length > 0 ? services[0].title : 'Handyman Pro';
  const displayInitials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const skills = services.map(s => s.title);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {isLoggedIn ? <CustomerNavbar activePage="search" /> : <Navbar />}

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
            {workerInfo?.cover_photo_url ? (
              <img
                src={workerInfo.cover_photo_url}
                alt="Worker banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-emerald-700 to-teal-900" />
            )}
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

              {workerInfo?.phone_verified_at ? (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-[9px] font-bold uppercase text-white">
                  <BadgeCheck size={11} />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[9px] font-bold uppercase text-white">
                  Unverified Worker
                </span>
              )}

              <span className="rounded bg-amber-400 px-2 py-1 text-[9px] font-bold uppercase text-slate-900">
                Featured
              </span>

              {averageRating && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-[9px] font-bold text-white uppercase tracking-wide">
                  <Star size={11} fill="currentColor" strokeWidth={0} />
                  {averageRating} ({reviewsCount})
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left content */}
          <div className="space-y-8">
            <SectionCard title={`About ${name.split(' ')[0]}`}>
              <div className="space-y-5 text-sm leading-7 text-slate-600">
                <p>Professional service provider on SkilledLK.</p>
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

                        {config?.bookings !== false && (
                          <button
                            type="button"
                            onClick={() => handleBookNow(service.id, service.title, priceLabel)}
                            className="h-10 min-w-24 cursor-pointer rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold text-sm"
                          >
                            Select
                          </button>
                        )}
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
                    {config?.chat !== false && (
                      <button
                        type="button"
                        onClick={handleChat}
                        className="h-10 min-w-24 cursor-pointer rounded-lg border border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50 transition font-semibold text-sm"
                      >
                        Inquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Ratings & Reviews">
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-500">No reviews yet for this worker.</p>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-extrabold text-slate-950">{averageRating}</div>
                    <div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            size={18}
                            fill={idx < Math.round(parseFloat(averageRating)) ? "currentColor" : "none"}
                            className={idx < Math.round(parseFloat(averageRating)) ? "text-amber-400" : "text-slate-200"}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Based on {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}</p>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="divide-y divide-slate-100">
                    {reviews.map((review) => (
                      <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-sm">
                            {review.customer?.name || 'Customer'}
                          </span>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                size={13}
                                fill={idx < review.rating ? "currentColor" : "none"}
                                className={idx < review.rating ? "text-amber-400" : "text-slate-200"}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                {config?.bookings !== false && (
                  <button
                    type="button"
                    onClick={() => handleBookNow(services.length > 0 ? services[0].id : null, roleName, services.length > 0 && services[0].price ? `LKR ${parseFloat(services[0].price).toLocaleString()}` : 'Negotiable')}
                    className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-base font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <CalendarDays size={20} />
                    Book Now
                  </button>
                )}

                {config?.chat !== false && (
                  <button
                    type="button"
                    onClick={handleChat}
                    className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-emerald-600 hover:text-emerald-700"
                  >
                    <MessageSquareText size={18} />
                    Chat with {name.split(' ')[0]}
                  </button>
                )}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="space-y-5">
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
          </aside>
        </div>
      </main>

      {isLoggedIn ? <CustomerFooter /> : <Footer />}
    </div>
  );
}