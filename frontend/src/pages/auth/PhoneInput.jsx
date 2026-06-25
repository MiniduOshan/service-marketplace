import React, { useState } from 'react';
import { ChevronDown, HardHat, UserRound } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { apiRequest } from '../../lib/api';

export default function PhoneInput({ onBack, onSendOtp, defaultRole = 'customer', isLogin = false }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiRequest('/auth/phone/request-otp', {
        method: 'POST',
        body: JSON.stringify({
          phone,
          ...(isLogin ? { is_login: true } : { name, role, is_login: false }),
        }),
      });

      if (onSendOtp) {
        onSendOtp({
          name,
          phone: response.data.phone || phone,
          role,
        });
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        <div className="mx-auto mb-8 flex h-37.5 w-57.5 items-center justify-center rounded-lg bg-linear-to-br from-[#6db6ad] to-[#a8ddd3] 2xl:mb-10 2xl:h-[180px] 2xl:w-[280px] min-[1920px]:mb-12 min-[1920px]:h-[210px] min-[1920px]:w-[330px]">
          <div className="text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <ChevronDown size={28} className="rotate-[-90deg]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] opacity-90">Phone OTP</p>
          </div>
        </div>

        <h1 className="text-center text-[25px] font-medium tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
          Continue with phone number
        </h1>

        <p className="mt-2 text-center text-[13px] text-slate-500 2xl:mt-3 2xl:text-[15px] min-[1920px]:text-base">
          {isLogin 
            ? 'Add your phone number to get a one-time code.' 
            : 'Add your name and phone number to get a one-time code.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 2xl:mt-10 min-[1920px]:mt-12">
          <div className="space-y-3">
            <div className="flex h-10.5 overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 min-[1920px]:h-14">
              <div className="flex h-full items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-[13px] font-medium text-slate-600 2xl:px-5 2xl:text-[15px] min-[1920px]:px-6 min-[1920px]:text-base">
                <span>LK</span>
                <span className="text-slate-500">+94</span>
                <ChevronDown size={14} className="text-slate-400 2xl:h-4 2xl:w-4 min-[1920px]:h-5 min-[1920px]:w-5" />
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="77 123 4567"
                className="h-full w-full bg-transparent px-4 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 2xl:px-5 2xl:text-[15px] min-[1920px]:px-6 min-[1920px]:text-base"
              />
            </div>

            {!isLogin && (
              <>
                <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
                  <UserRound size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 2xl:text-[15px] min-[1920px]:text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[13px] font-semibold transition 2xl:text-[15px] min-[1920px]:text-base ${
                      role === 'customer'
                        ? 'border-[#08785d] bg-[#e3f4ee] text-[#08785d]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#08785d]/40'
                    }`}
                  >
                    <UserRound size={16} />
                    Customer
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('worker')}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[13px] font-semibold transition 2xl:text-[15px] min-[1920px]:text-base ${
                      role === 'worker'
                        ? 'border-[#08785d] bg-[#e3f4ee] text-[#08785d]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#08785d]/40'
                    }`}
                  >
                    <HardHat size={16} />
                    Worker
                  </button>
                </div>
              </>
            )}
          </div>

          {error ? (
            <p className="mt-3 text-[13px] font-medium text-red-600 2xl:text-[15px] min-[1920px]:text-base">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#066b53] disabled:cursor-not-allowed disabled:opacity-70 2xl:mt-8 2xl:h-12 2xl:text-[15px] min-[1920px]:mt-10 min-[1920px]:h-14 min-[1920px]:text-base"
          >
            {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="mx-auto mt-8 max-w-71.25 text-center text-[11px] leading-5 text-slate-400 2xl:mt-10 2xl:max-w-[340px] 2xl:text-[12px] 2xl:leading-6 min-[1920px]:mt-12 min-[1920px]:max-w-[400px] min-[1920px]:text-[13px] min-[1920px]:leading-7">
          By continuing, you agree to SkilledLK&apos;s{' '}
          <a href="/terms" className="font-medium text-[#08785d] hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="hover:text-[#08785d]">Privacy Policy</a>.
        </p>
      </div>
    </OnboardingLayout>
  );
}
