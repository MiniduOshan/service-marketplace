import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Select Worker' },
  { id: 2, label: 'Booking Details' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Payment' },
];

export default function BookingProgress({
  currentStep = 1,
  showBack = false,
  onBack,
}) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-none px-5 py-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-14">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700"
            aria-label="Go back"
          >
            <ArrowLeft size={25} />
          </button>
        )}

        <div className="flex items-start justify-between gap-3">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                <div className="flex min-w-[88px] flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                      isCompleted
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : isActive
                          ? 'border-emerald-700 bg-white text-emerald-700'
                          : 'border-slate-100 bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                  </div>

                  <p
                    className={`mt-3 text-center text-sm font-semibold ${
                      isCompleted || isActive
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {index !== steps.length - 1 && (
                  <div className="mt-5 h-[1px] flex-1 bg-slate-300" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}