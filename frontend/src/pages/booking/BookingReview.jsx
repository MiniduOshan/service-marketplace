import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  FileText,
  MapPin,
  Star,
  BadgeCheck,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import BookingProgress from './BookingProgress';

export default function BookingReview() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve state passed from BookingDetails, with standard fallback mock-free defaults
  const worker = location.state?.worker || {
    name: 'Verified Pro',
    role: 'Pro Partner',
    rating: '4.8',
    reviews: '24 reviews',
    avatar: 'https://ui-avatars.com/api/?name=Pro&background=006D44&color=fff',
  };
  const servicePackage = location.state?.servicePackage || {
    id: 1,
    title: 'Professional Service',
    price: '3500',
  };
  const bookingDetails = location.state?.bookingDetails || {
    date: new Date().toISOString().split('T')[0],
    time: 'Morning (08:00 AM - 12:00 PM)',
    address: 'Maharagama, Colombo',
    description: 'No description provided.',
  };

  const basePrice = parseFloat(servicePackage.price || 0);
  const platformFee = basePrice * 0.05;
  const totalAmount = basePrice + platformFee;

  const handleProceed = () => {
    navigate('/book/payment', {
      state: {
        worker,
        servicePackage,
        bookingDetails,
        pricing: {
          basePrice,
          platformFee,
          totalAmount,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="bookings" />

      <BookingProgress
        currentStep={3}
        showBack
        onBack={() => navigate(-1)}
      />

      <main className="mx-auto w-full max-w-none px-5 py-10 sm:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <section>
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
              Review Your Booking
            </h1>

            <div className="space-y-7">
              {/* Schedule */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <CalendarDays size={24} className="mt-1 shrink-0 text-emerald-700" />

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Schedule
                    </h2>
                    <div className="mt-4 text-base leading-7 text-slate-600">
                      <p className="font-semibold text-slate-900">
                        {new Date(bookingDetails.date).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p>{bookingDetails.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <MapPin size={24} className="mt-1 shrink-0 text-emerald-700" />

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Location
                    </h2>
                    <div className="mt-4 text-base leading-7 text-slate-600">
                      <p className="font-semibold text-slate-900">
                        {bookingDetails.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <FileText size={24} className="mt-1 shrink-0 text-emerald-700" />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Job Description
                    </h2>

                    <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
                      {bookingDetails.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attached Photos */}
              {bookingDetails.photos && bookingDetails.photos.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                  <h2 className="mb-5 text-xl font-semibold text-slate-900">
                    Attached Photos
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {bookingDetails.photos.map((photo, index) => (
                      <div key={index} className="h-24 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <img src={photo} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-7 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Worker Summary
              </h2>

              <div className="flex items-center gap-4">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {worker.name}
                    </h3>
                    <BadgeCheck size={17} fill="currentColor" className="text-emerald-700" />
                  </div>

                  <p className="text-base text-slate-500">{worker.role}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                    <Star size={15} fill="#fbbf24" className="text-amber-400" />
                    {worker.rating} ({worker.reviews})
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-7 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Price Breakdown
              </h2>

              <div className="space-y-5 text-base">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Fee</span>
                  <span className="font-semibold text-slate-900">
                    LKR {basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Fee (5%)</span>
                  <span className="font-semibold text-slate-900">
                    LKR {platformFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-end justify-between border-t border-slate-100 pt-6">
                  <span className="text-xl text-slate-900">Total Amount</span>
                  <span className="text-3xl font-bold text-emerald-700">
                    LKR {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceed}
                className="mt-8 h-14 w-full cursor-pointer rounded-lg bg-emerald-700 text-base font-semibold text-white transition hover:bg-emerald-800"
              >
                Proceed to Payment
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-3 h-14 w-full cursor-pointer rounded-lg border border-emerald-700 bg-white text-base font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Back
              </button>

              <p className="mt-6 text-center text-sm font-medium text-slate-500">
                You won’t be charged yet.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}