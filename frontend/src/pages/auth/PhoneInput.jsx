import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';

export default function PhoneInput({ onBack, onSendOtp }) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSendOtp) {
      onSendOtp(phone || '77 123 4567');
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        <div className="mx-auto mb-8 flex h-37.5 w-57.5 items-center justify-center rounded-lg bg-linear-to-br from-[#6db6ad] to-[#a8ddd3] 2xl:mb-10 2xl:h-[180px] 2xl:w-[280px] min-[1920px]:mb-12 min-[1920px]:h-[210px] min-[1920px]:w-[330px]">
          <div className="relative">
            <div className="h-25.5 w-15.5 rotate-[-13deg] rounded-2xl border-[5px] border-[#5baaa2] bg-[#a9ddd5] shadow-lg 2xl:h-[122px] 2xl:w-[74px] min-[1920px]:h-[142px] min-[1920px]:w-[86px]">
              <div className="mx-auto mt-2 h-1.5 w-6 rounded-full bg-[#5baaa2] 2xl:mt-3 2xl:w-7 min-[1920px]:mt-4 min-[1920px]:w-8" />
              <div className="mx-auto mt-4 h-14.5 w-10 rounded-lg bg-[#c8eee8] 2xl:mt-5 2xl:h-[70px] 2xl:w-[48px] min-[1920px]:mt-6 min-[1920px]:h-[82px] min-[1920px]:w-[56px]" />
            </div>

            <div className="absolute -left-2 top-8.25 w-23 rounded-lg bg-white px-4 py-3 shadow-xl 2xl:-left-3 2xl:top-10 2xl:w-[110px] 2xl:px-5 2xl:py-4 min-[1920px]:-left-4 min-[1920px]:top-[46px] min-[1920px]:w-[128px] min-[1920px]:px-6 min-[1920px]:py-5">
              <div className="h-2.5 w-10 rounded-full bg-slate-100 2xl:h-3 2xl:w-12 min-[1920px]:h-3.5 min-[1920px]:w-14" />
              <div className="mt-3 h-2.5 w-16 rounded-full bg-slate-100 2xl:mt-4 2xl:h-3 2xl:w-20 min-[1920px]:mt-5 min-[1920px]:h-3.5 min-[1920px]:w-24" />
              <p className="mt-4 text-[8px] font-extrabold text-[#08785d] 2xl:mt-5 2xl:text-[9px] min-[1920px]:mt-6 min-[1920px]:text-[10px]">OTP: 582 901</p>
            </div>
          </div>
        </div>

        <h1 className="text-center text-[25px] font-medium tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
          Enter your phone number
        </h1>

        <p className="mt-2 text-center text-[13px] text-slate-500 2xl:mt-3 2xl:text-[15px] min-[1920px]:text-base">
          We&apos;ll send a 6-digit OTP to verify your number.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 2xl:mt-10 min-[1920px]:mt-12">
          <div className="flex h-10.5 overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 min-[1920px]:h-14">
            <button
              type="button"
              className="flex h-full cursor-pointer items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 2xl:px-5 2xl:text-[15px] min-[1920px]:px-6 min-[1920px]:text-base"
            >
              <span>LK</span>
              <span className="text-slate-500">+94</span>
              <ChevronDown size={14} className="text-slate-400 2xl:h-4 2xl:w-4 min-[1920px]:h-5 min-[1920px]:w-5" />
            </button>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="77 123 4567"
              className="h-full w-full bg-transparent px-4 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 2xl:px-5 2xl:text-[15px] min-[1920px]:px-6 min-[1920px]:text-base"
            />
          </div>

          <button
            type="submit"
            className="mt-6 h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#066b53] 2xl:mt-8 2xl:h-12 2xl:text-[15px] min-[1920px]:mt-10 min-[1920px]:h-14 min-[1920px]:text-base"
          >
            Send OTP
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
