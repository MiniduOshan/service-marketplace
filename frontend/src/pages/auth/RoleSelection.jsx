import React, { useEffect, useState } from 'react';
import { BadgeCheck, HardHat, UserRound } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import OnboardingLayout from './OnboardingLayout';

export default function RoleSelection({
  onBack,
  onContinue,
  selectedRole: initialSelectedRole = 'customer',
}) {
  const [selectedRole, setSelectedRole] = useState(initialSelectedRole);

  useEffect(() => {
    setSelectedRole(initialSelectedRole);
  }, [initialSelectedRole]);

  const handleContinue = () => {
    if (onContinue) {
      onContinue(selectedRole);
    }
  };

  return (
    <OnboardingLayout onBack={onBack}>
      <div>
        <h1 className="text-[25px] font-medium tracking-tight text-slate-900 2xl:text-[30px] min-[1920px]:text-[34px]">
          Welcome to SkilledLK
        </h1>

        <p className="mt-1.5 text-[13px] text-slate-500 2xl:mt-2 2xl:text-[15px] min-[1920px]:text-base">
          How will you use the app?
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:mt-7 2xl:gap-4 min-[1920px]:mt-8 min-[1920px]:gap-5">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`cursor-pointer rounded-xl border p-5 text-center transition 2xl:p-6 min-[1920px]:p-7 ${
              selectedRole === 'customer'
                ? 'border-[#08785d] bg-[#e3f4ee]'
                : 'border-slate-200 bg-white hover:border-[#08785d]/50 hover:bg-emerald-50'
            }`}
          >
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full 2xl:h-12 2xl:w-12 min-[1920px]:h-14 min-[1920px]:w-14 ${
                selectedRole === 'customer'
                  ? 'bg-[#c7eee1] text-[#08785d]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <UserRound size={22} className="2xl:h-6 2xl:w-6 min-[1920px]:h-7 min-[1920px]:w-7" />
            </div>

            <h3 className="mt-3 text-[13px] font-extrabold text-slate-900 2xl:mt-4 2xl:text-[15px] min-[1920px]:mt-5 min-[1920px]:text-base">
              I need a worker
            </h3>

            <p className="mt-1 text-[12px] text-slate-500 2xl:text-[13px] min-[1920px]:text-[15px]">Customer</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('worker')}
            className={`cursor-pointer rounded-xl border p-5 text-center transition 2xl:p-6 min-[1920px]:p-7 ${
              selectedRole === 'worker'
                ? 'border-[#08785d] bg-[#e3f4ee]'
                : 'border-slate-200 bg-white hover:border-[#08785d]/50 hover:bg-emerald-50'
            }`}
          >
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full 2xl:h-12 2xl:w-12 min-[1920px]:h-14 min-[1920px]:w-14 ${
                selectedRole === 'worker'
                  ? 'bg-[#c7eee1] text-[#08785d]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <HardHat size={22} className="2xl:h-6 2xl:w-6 min-[1920px]:h-7 min-[1920px]:w-7" />
            </div>

            <h3 className="mt-3 text-[13px] font-extrabold text-slate-900 2xl:mt-4 2xl:text-[15px] min-[1920px]:mt-5 min-[1920px]:text-base">
              I&apos;m a worker
            </h3>

            <p className="mt-1 text-[12px] text-slate-500 2xl:text-[13px] min-[1920px]:text-[15px]">Professional</p>
          </button>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-5 h-11 w-full cursor-pointer rounded-lg bg-[#08785d] text-[14px] font-extrabold text-white transition hover:bg-[#066b53] 2xl:mt-7 2xl:h-12 2xl:text-[15px] min-[1920px]:mt-8 min-[1920px]:h-14 min-[1920px]:text-base"
        >
          Continue
        </button>

        <div className="my-4 flex items-center gap-4 2xl:my-6 2xl:gap-5 min-[1920px]:my-7 min-[1920px]:gap-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] text-slate-400 2xl:text-[12px] min-[1920px]:text-[13px]">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-[14px] font-extrabold text-slate-800 transition hover:bg-slate-50 2xl:h-12 2xl:text-[15px] min-[1920px]:h-14 min-[1920px]:text-base"
        >
          <FcGoogle size={20} className="2xl:h-6 2xl:w-6 min-[1920px]:h-7 min-[1920px]:w-7" />
          Continue with Google
        </button>

        <div className="mt-5 rounded-xl bg-emerald-50 p-4 lg:hidden 2xl:mt-7 2xl:p-5 min-[1920px]:mt-8 min-[1920px]:p-6">
          <div className="space-y-2.5">
            {['ID-verified workers', 'Secure payments', '2,100+ happy customers'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <BadgeCheck size={17} className="text-[#08785d] 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />
                <span className="text-[13px] font-medium text-slate-700 2xl:text-[15px] min-[1920px]:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center text-[13px] text-slate-400 2xl:mt-7 2xl:text-[15px] min-[1920px]:mt-8 min-[1920px]:text-base">
          <div className="flex justify-center gap-6 2xl:gap-8 min-[1920px]:gap-10">
            <a href="/privacy" className="hover:text-slate-700">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-700">Terms of Service</a>
          </div>

          <p className="mt-3 text-[9px] uppercase tracking-[0.2em] 2xl:mt-4 2xl:text-[10px] min-[1920px]:mt-5 min-[1920px]:text-[11px]">
            © 2026 SkilledLK. All rights reserved.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
