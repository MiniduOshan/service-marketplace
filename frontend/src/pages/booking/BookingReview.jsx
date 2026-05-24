import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  MessageSquareText,
  Star,
  BadgeCheck,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import BookingProgress from './BookingProgress';

const worker = {
  name: 'Kasun Silva',
  role: 'Painter & Handyman',
  rating: '4.9',
  reviews: '124 reviews',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
};

const reviewImages = [
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=300',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=300',
];

export default function BookingReview() {
  const navigate = useNavigate();

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
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <CalendarDays size={24} className="mt-1 shrink-0 text-emerald-700" />

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Schedule
                    </h2>
                    <div className="mt-4 text-base leading-7 text-slate-600">
                      <p className="font-semibold text-slate-900">28 April 2025</p>
                      <p>9:00 AM - 12:00 PM (3 Hours)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <MapPin size={24} className="mt-1 shrink-0 text-emerald-700" />

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Location
                    </h2>
                    <div className="mt-4 text-base leading-7 text-slate-600">
                      <p className="font-semibold text-slate-900">
                        123 Temple Road, Maharagama
                      </p>
                      <p>Colombo, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="flex gap-4">
                  <FileText size={24} className="mt-1 shrink-0 text-emerald-700" />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Job Description
                    </h2>

                    <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
                      Need professional painting for a master bedroom and an attached
                      hallway. Total area is approximately 450 sq.ft. Walls need light
                      sanding and two coats of emulsion paint. I have already purchased
                      the paint; looking for labor and equipment brushes, rollers, drop
                      cloths. Please ensure clean borders and no spills on the hardwood
                      floor.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-4">
                      {reviewImages.map((image) => (
                        <img
                          key={image}
                          src={image}
                          alt="Uploaded job reference"
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                  <span className="text-slate-500">Service fee (3 hrs)</span>
                  <span className="font-semibold text-slate-900">LKR 5,000</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Platform fee</span>
                  <span className="font-semibold text-slate-900">LKR 250</span>
                </div>

                <div className="flex items-end justify-between border-t border-slate-100 pt-6">
                  <span className="text-xl text-slate-900">Total Amount</span>
                  <span className="text-3xl font-bold text-emerald-700">
                    LKR 5,250
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/book/payment')}
                className="mt-8 h-14 w-full cursor-pointer rounded-lg bg-emerald-700 text-base font-semibold text-white transition hover:bg-emerald-800"
              >
                Proceed to Payment
              </button>

              <button
                type="button"
                onClick={() => navigate('/book/details')}
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