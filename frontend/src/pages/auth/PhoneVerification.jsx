import React, { useRef, useState } from 'react';
import OnboardingLayout from './OnboardingLayout';

export default function PhoneVerification({
  onBack,
  onChangePhone,
  onVerifyCode,
  phoneNumber = '+94 77 123 4567',
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 1);
    const updatedOtp = [...otp];
    updatedOtp[index] = cleanValue;
    setOtp(updatedOtp);

    if (cleanValue && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (!pasted) return;

    const nextOtp = [...otp];

    pasted.split('').forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onVerifyCode) {
      onVerifyCode(otp.join(''));
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        <h1 className="text-[25px] font-extrabold tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
          Enter verification code
        </h1>

        <p className="mt-2 text-[13px] text-slate-600 2xl:mt-3 2xl:text-[15px] min-[1920px]:text-base">
          Sent to {phoneNumber}{' '}
          <button
            type="button"
            onClick={onChangePhone}
            className="cursor-pointer font-extrabold text-[#08785d] hover:underline 2xl:text-[15px] min-[1920px]:text-base"
          >
             &nbsp;&nbsp;Change?
          </button>
        </p>

        <form onSubmit={handleSubmit} className="mt-9 2xl:mt-11 min-[1920px]:mt-12">
          <div className="grid grid-cols-6 gap-2.5 2xl:gap-3 min-[1920px]:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`h-13 w-full rounded-lg border bg-white text-center text-[20px] font-extrabold text-slate-900 outline-none transition 2xl:h-14 2xl:text-[22px] min-[1920px]:h-16 min-[1920px]:text-[24px] ${
                  digit
                    ? 'border-[#08785d] ring-2 ring-emerald-100'
                    : 'border-slate-200 focus:border-[#08785d] focus:ring-2 focus:ring-emerald-100'
                }`}
              />
            ))}
          </div>

          <div className="mt-8 text-[13px] 2xl:mt-10 2xl:text-[15px] min-[1920px]:mt-12 min-[1920px]:text-base">
            <p className="text-slate-500">Resend OTP in 0:45</p>

            <button
              type="button"
              disabled
              className="mt-2 cursor-not-allowed font-extrabold text-slate-300 2xl:mt-3 min-[1920px]:mt-4"
            >
              Resend OTP
            </button>
          </div>

          <button
            type="submit"
            className="mt-10 h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#066b53] 2xl:mt-12 2xl:h-12 2xl:text-[15px] min-[1920px]:mt-14 min-[1920px]:h-14 min-[1920px]:text-base"
          >
            Verify Code
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-slate-500 2xl:mt-10 2xl:text-[15px] min-[1920px]:mt-12 min-[1920px]:text-base">
          Having trouble?{' '}
          <a href="/support" className="font-medium text-[#08785d] hover:underline">
            Contact Support
          </a>
        </p>

        <p className="mt-20 text-center text-[10px] text-slate-400 2xl:mt-24 2xl:text-[11px] min-[1920px]:mt-28 min-[1920px]:text-[12px]">
          © 2026 ServiceLanka. Sri Lanka&apos;s Professional Marketplace.
        </p>
      </div>
    </OnboardingLayout>
  );
}
