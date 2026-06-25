import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import OnboardingLayout from './OnboardingLayout';
import { apiRequest } from '../../lib/api';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setStatus('submitting');

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setStatus('success');
    } catch (requestError) {
      setError(requestError.message || 'Unable to process request.');
      setStatus('idle');
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Mail size={24} />
            </div>
            <h1 className="text-[22px] font-medium tracking-tight text-slate-900 2xl:text-[26px]">
              Check your email
            </h1>
            <p className="mt-2 text-[13px] text-slate-500 2xl:text-[15px]">
              If an account exists with {email}, we've sent instructions to reset your password.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white transition hover:bg-[#066b53] 2xl:h-12"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-[25px] font-medium tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
              Reset Password
            </h1>

            <p className="mt-1.5 text-[13px] text-slate-500 2xl:mt-2 2xl:text-[15px] min-[1920px]:text-base">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3 2xl:mt-7 2xl:space-y-4 min-[1920px]:mt-8 min-[1920px]:space-y-5">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700 2xl:mb-2 2xl:text-[15px] min-[1920px]:text-base">
                  Email Address
                </label>

                <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
                  <Mail size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 2xl:text-[15px] min-[1920px]:text-base"
                    required
                  />
                </div>
              </div>

              {error ? (
                <p className="text-[13px] font-medium text-red-600 2xl:text-[15px] min-[1920px]:text-base">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white transition hover:bg-[#066b53] 2xl:h-12 2xl:text-[15px] min-[1920px]:h-14 min-[1920px]:text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </OnboardingLayout>
  );
}
