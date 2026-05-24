import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Info,
  LockKeyhole,
  MessageSquare,
  Smartphone,
  Star,
  WalletCards,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import BookingProgress from './BookingProgress';

const worker = {
  name: 'Kasun Silva',
  service: 'Room Painting',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
};

const paymentMethods = [
  {
    id: 'card',
    title: 'Credit / Debit Card',
    icon: <CreditCard size={22} />,
  },
  {
    id: 'wallet',
    title: 'Mobile Wallet (eZCash, mCash, FriMi)',
    icon: <WalletCards size={22} />,
  },
  {
    id: 'cash',
    title: 'Cash to Worker',
    icon: <MessageSquare size={22} />,
  },
];

const paymentOptions = [
  {
    id: 'advance',
    label: 'Advance 50%',
    amount: 'LKR 2,625',
    payAmount: '2,625',
  },
  {
    id: 'full',
    label: 'Full Amount',
    amount: 'LKR 5,250',
    payAmount: '5,250',
  },
  {
    id: 'after',
    label: 'After Job (Cash)',
    amount: 'Pay direct',
    payAmount: '0',
  },
];

export default function BookingPayment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [selectedOption, setSelectedOption] = useState('advance');

  const currentOption = paymentOptions.find((option) => option.id === selectedOption);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="bookings" />

      <BookingProgress
         currentStep={4}
         showBack
         onBack={() => navigate(-1)}
         />

      <main className="mx-auto w-full max-w-none px-5 py-10 sm:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <section>
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
              Choose Payment Method
            </h1>

            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex h-24 w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-6 text-left transition ${
                      isSelected
                        ? 'border-emerald-700 ring-1 ring-emerald-700'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          isSelected ? 'border-emerald-700' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
                        )}
                      </span>

                      <span className="text-base font-medium text-slate-800">
                        {method.title}
                      </span>
                    </div>

                    <span className="text-slate-400">{method.icon}</span>
                  </button>
                );
              })}
            </div>

            {selectedMethod === 'card' && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Card Number
                    </label>

                    <div className="relative">
                      <CreditCard
                        size={21}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="h-13 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="h-13 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="***"
                        className="h-13 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name as on Card"
                      className="h-13 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-slate-600">
                    <LockKeyhole size={16} className="text-emerald-700" />
                    Your payment information is encrypted and secure.
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'wallet' && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <Smartphone size={28} className="text-emerald-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Mobile Wallet Payment
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Wallet payment UI can be connected after backend/payment gateway
                      integration. For now this is a frontend placeholder.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'cash' && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <WalletCards size={28} className="text-emerald-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Cash to Worker
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      You can pay the worker directly after the job is completed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="mt-6 h-16 w-full cursor-pointer rounded-lg bg-emerald-700 text-xl font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              {selectedOption === 'after'
                ? 'Confirm Booking'
                : `Confirm & Pay LKR ${currentOption?.payAmount}`}
            </button>
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-7 text-lg font-semibold text-slate-900">
                Booking Summary
              </h2>

              <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {worker.name}
                  </h3>
                  <p className="font-semibold text-emerald-700">{worker.service}</p>
                </div>
              </div>

              <div className="space-y-4 border-b border-slate-200 py-6">
                <div className="flex justify-between text-base">
                  <span className="text-slate-500">Service Fee</span>
                  <span className="font-medium text-slate-900">LKR 5,000</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-slate-500">Platform Fee (5%)</span>
                  <span className="font-medium text-slate-900">LKR 250</span>
                </div>
              </div>

              <div className="flex items-end justify-between pt-5">
                <span className="text-2xl font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-emerald-700">
                  LKR 5,250
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Options
              </h2>

              <div className="space-y-3">
                {paymentOptions.map((option) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOption(option.id)}
                      className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-lg border px-4 text-left transition ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-emerald-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected ? 'border-emerald-700' : 'border-slate-400'
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-emerald-700" />
                          )}
                        </span>

                        <span className="font-medium text-slate-800">
                          {option.label}
                        </span>
                      </span>

                      <span className="font-semibold text-slate-900">
                        {option.amount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-6">
              <div className="flex gap-3">
                <Info size={22} className="mt-0.5 shrink-0 text-orange-600" />

                <div>
                  <h3 className="font-semibold text-orange-700">
                    Cancellation Policy
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-orange-700/80">
                    Free cancellation up to 24 hours before the service.
                    Cancellations within 24 hours may incur a 10% platform fee
                    charge to compensate the service provider.
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