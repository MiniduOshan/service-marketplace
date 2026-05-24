import React, { useState } from 'react';
import { Eye, Lock, Mail, UserRound } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import OnboardingLayout from './OnboardingLayout';
import { apiRequest, storeSession } from '../../lib/api';

export default function Signup({ role = 'customer', onBack, onSignin, onSignupComplete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiRequest(role === 'worker' ? '/auth/register-worker' : '/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password,
        }),
      });

      storeSession(response.data.token, response.data.user);

      if (onSignupComplete) {
        onSignupComplete(response.data.user);
      }
    } catch (requestError) {
      setError(requestError.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        <h1 className="text-[25px] font-medium tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
          Create an account
        </h1>

        <p className="mt-1.5 text-[13px] leading-5 text-slate-500 2xl:mt-2 2xl:text-[15px] min-[1920px]:text-base">
          Join our marketplace of skilled professionals and local customers.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 2xl:mt-7 2xl:space-y-4 min-[1920px]:mt-8 min-[1920px]:space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 2xl:mb-2 2xl:text-[15px] min-[1920px]:text-base">
              Full Name
            </label>

            <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
              <UserRound size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-300 2xl:text-[15px] min-[1920px]:text-base"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 2xl:mb-2 2xl:text-[15px] min-[1920px]:text-base">
              Email Address
            </label>

            <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
              <Mail size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-300 2xl:text-[15px] min-[1920px]:text-base"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700 2xl:mb-2 2xl:text-[15px] min-[1920px]:text-base">
              Password
            </label>

            <div className="flex h-10.5 items-center gap-3 rounded-lg border border-slate-200 px-4 transition focus-within:border-[#08785d] focus-within:ring-2 focus-within:ring-emerald-100 2xl:h-12 2xl:px-5 min-[1920px]:h-14 min-[1920px]:px-6">
              <Lock size={17} className="text-slate-400 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-300 2xl:text-[15px] min-[1920px]:text-base"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-slate-400 transition hover:text-slate-700 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6"
                aria-label="Toggle password visibility"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>

          {error ? (
            <p className="text-[13px] font-medium text-red-600 2xl:text-[15px] min-[1920px]:text-base">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#066b53] 2xl:h-12 2xl:text-[15px] min-[1920px]:h-14 min-[1920px]:text-base"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-4 2xl:my-6 2xl:gap-5 min-[1920px]:my-7 min-[1920px]:gap-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-400 2xl:text-[12px] min-[1920px]:text-[13px]">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-[14px] font-medium text-slate-800 transition hover:bg-slate-50 2xl:h-12 2xl:text-[15px] min-[1920px]:h-14 min-[1920px]:text-base"
        >
          <FcGoogle size={20} className="2xl:h-6 2xl:w-6 min-[1920px]:h-7 min-[1920px]:w-7" />
          Sign up with Google
        </button>

        <p className="mt-5 text-center text-[13px] text-slate-500 2xl:mt-7 2xl:text-[15px] min-[1920px]:mt-8 min-[1920px]:text-base">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSignin}
            className="cursor-pointer font-extrabold text-[#08785d] hover:underline"
          >
            Sign in
          </button>
        </p>

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-400 2xl:mt-7 2xl:text-[11px] 2xl:leading-6 min-[1920px]:mt-8 min-[1920px]:text-[12px] min-[1920px]:leading-7">
          By signing up, you agree to our{' '}
          <a href="/terms" className="underline hover:text-slate-700">Terms of Service</a>{' '}
          &amp;{' '}
          <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>.
        </p>
      </div>
    </OnboardingLayout>
  );
}
