import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Info,
  MapPin,
  Shield,
  Star,
  UploadCloud,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import BookingProgress from './BookingProgress';

export default function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load from location state, fallback if page is refreshed or visited directly
  const stateWorker = location.state?.worker || (location.state?.workerId ? {
    id: location.state.workerId,
    name: location.state.workerName || 'Verified Pro',
    rating: '4.8',
    reviews: '24 reviews',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(location.state.workerName || 'Pro')}&background=006D44&color=fff`,
  } : null);

  const statePackage = location.state?.servicePackage || (location.state?.servicePackageId ? {
    id: location.state.servicePackageId,
    title: location.state.serviceTitle || 'Professional Service',
    price: location.state.priceLabel ? parseFloat(location.state.priceLabel.replace(/[^0-9.]/g, '')) || 3500 : 3500,
  } : null);

  const worker = stateWorker || {
    name: 'Verified Pro',
    rating: '4.8',
    reviews: '24 reviews',
    avatar: 'https://ui-avatars.com/api/?name=Pro&background=006D44&color=fff',
  };

  const servicePackage = statePackage || {
    id: 1,
    title: 'Professional Service',
    price: '3500',
  };

  const [date, setDate] = useState('');
  const [time, setTime] = useState('Morning (08:00 AM - 12:00 PM)');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Colombo');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');

  const handleContinue = () => {
    if (!date) {
      alert('Please select a preferred date.');
      return;
    }
    if (!streetAddress) {
      alert('Please enter your street address.');
      return;
    }

    const fullAddress = `${streetAddress}, ${city}${landmark ? ` (near ${landmark})` : ''}`;

    navigate('/book/review', {
      state: {
        worker,
        servicePackage,
        bookingDetails: {
          date,
          time,
          address: fullAddress,
          description: description || 'No description provided.',
        },
      },
    });
  };

  const displayPrice = `LKR ${parseFloat(servicePackage.price || 0).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="bookings" />

      <BookingProgress
        currentStep={2}
        showBack
        onBack={() => navigate(-1)}
      />

      <main className="mx-auto w-full max-w-none px-5 py-10 sm:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <section>
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
              Provide Job Details
            </h1>

            <div className="space-y-8">
              {/* Preferred Date & Time */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <CalendarDays size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Preferred Date & Time
                  </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Preferred Time
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-600"
                    >
                      <option>Morning (08:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 04:00 PM)</option>
                      <option>Evening (04:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <MapPin size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Location
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="House No, Street Name"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Landmark Optional
                      </label>
                      <input
                        type="text"
                        placeholder="Near Petrol Shed"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <FileText size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Job Description
                  </h2>
                </div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Describe the work in detail
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide specific details about the service required (e.g. scope of work, dimensions, material preferences)."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                />
              </div>

              {/* Photos */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <UploadCloud size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Photos
                  </h2>
                </div>

                <button
                  type="button"
                  className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <UploadCloud size={31} className="text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs font-medium uppercase text-slate-400">
                    SVG, PNG, JPG or GIF max. 10MB
                  </p>
                </button>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex h-14 min-w-72 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-8 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  Continue to Review
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Worker Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {worker.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-700">
                      <Star size={15} fill="currentColor" />
                      {worker.rating} ({worker.reviews})
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service</span>
                    <span className="font-semibold text-slate-900">
                      {servicePackage.title}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Est. Base Price</span>
                    <span className="font-semibold text-slate-900">
                      {displayPrice}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                  <Info size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold leading-4">
                    Final price will be confirmed after worker reviews your job
                    description.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Shield size={22} className="mt-0.5 text-slate-400" />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    SkillMarket Protection
                  </h3>
                  <p className="text-sm leading-5 text-slate-500">
                    Your payments are secure until you approve the work.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}