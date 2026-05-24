import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

import workerTablet from '../../assets/worker_tablet.png';
import dilshanProfile from '../../assets/dilshan_profile.png';

export default function OnboardingLayout({
  onBack,
  children,
  leftTitle = "Sri Lanka's most trusted skilled worker platform.",
  leftImage = workerTablet,
  showTestimonial = true,
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-black/45 px-4 py-5 backdrop-blur-sm 2xl:px-8 2xl:py-8 min-[1920px]:px-12 min-[1920px]:py-12">
      <div
        className="relative grid w-full max-w-235 overflow-y-auto overflow-x-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2 2xl:max-w-300 min-[1920px]:max-w-368 min-[3840px]:max-w-70 min-[3840px]:grid-cols-[1fr_280px]"
        style={{ maxHeight: 'calc(100dvh - 40px)' }}
      >
        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-[#155f46] text-white lg:block">
          <div className="absolute -right-30 -top-32.5 h-65 w-65 rounded-full bg-white/5 2xl:-right-37.5 2xl:-top-40 2xl:h-80 2xl:w-80 min-[1920px]:-right-45 min-[1920px]:-top-47.5 min-[1920px]:h-95 min-[1920px]:w-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.14),transparent_38%)]" />

          <div className="relative z-10 flex h-full flex-col px-7 py-6 2xl:px-10 2xl:py-8 min-[1920px]:px-12 min-[1920px]:py-10">
            <h1 className="text-[15px] font-extrabold tracking-tight 2xl:text-[17px] min-[1920px]:text-[19px]">
              SkilledLK
            </h1>

            <div className="flex flex-1 flex-col justify-center">
              <h2 className="max-w-95 text-[27px] font-extrabold leading-[1.22] tracking-tight 2xl:max-w-115 2xl:text-[34px] min-[1920px]:max-w-135 min-[1920px]:text-[40px]">
                {leftTitle}
              </h2>

              <div className="mt-6 max-w-62.5 space-y-3 text-left 2xl:mt-8 2xl:max-w-[320px] 2xl:space-y-4 min-[1920px]:mt-10 min-[1920px]:max-w-90 min-[1920px]:space-y-5">
                {['ID-verified workers', 'Secure payments', '2,100+ happy customers'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <IoMdCheckmarkCircleOutline className="text-[19px] text-[#6ee7bd] 2xl:text-[21px] min-[1920px]:text-[24px]" />
                    <span className="text-[13px] text-white/90 2xl:text-[15px] min-[1920px]:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 w-60 overflow-hidden rounded-lg border border-white/20 bg-white/10 shadow-[0_0_60px_rgba(255,255,255,0.10)] 2xl:mt-9 2xl:w-65 min-[1920px]:mt-10 min-[1920px]:w-75">
                <div className="relative h-44.5 w-full 2xl:h-53.5 min-[1920px]:h-62.5">
                  <img
                    src={leftImage}
                    alt="SkilledLK preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#155f46]/5" />
                </div>
              </div>
            </div>

            {showTestimonial && (
              <div className="mx-auto flex w-full max-w-72.5 items-center gap-3 rounded-lg bg-white px-4 py-3 text-slate-900 shadow-xl 2xl:max-w-85 2xl:gap-4 2xl:px-5 2xl:py-4 min-[1920px]:max-w-97.5 min-[1920px]:gap-5 min-[1920px]:px-6 min-[1920px]:py-5">
                <img
                  src={dilshanProfile}
                  alt="Dilshan Perera"
                  className="h-10 w-10 shrink-0 rounded-full object-cover 2xl:h-12 2xl:w-12 min-[1920px]:h-14 min-[1920px]:w-14"
                />

                <div>
                  <p className="text-[13px] font-medium text-slate-800 2xl:text-[15px] min-[1920px]:text-base">
                    Dilshan Perera
                  </p>
                  <p className="mt-0.5 text-[12px] font-bold text-[#08785d] 2xl:text-[13px] min-[1920px]:text-[15px]">
                    Earned LKR 42,000 this month
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white px-6 py-5 sm:px-8 lg:px-9 2xl:px-12 2xl:py-8 min-[1920px]:px-16 min-[1920px]:py-10">
          <div className="mx-auto flex h-full w-full max-w-92.5 flex-col justify-center 2xl:max-w-107.5 min-[1920px]:max-w-125 min-[3840px]:max-w-70">
            <div className="mb-5 flex items-center justify-between 2xl:mb-7 min-[1920px]:mb-9">
              <button
                type="button"
                onClick={onBack}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 2xl:h-9 2xl:w-9 min-[1920px]:h-10 min-[1920px]:w-10"
                aria-label="Back"
              >
                <ArrowLeft size={20} className="2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />
              </button>

              <h2 className="text-[19px] font-extrabold text-[#08785d] 2xl:text-[21px] min-[1920px]:text-[24px]">
                SkilledLK
              </h2>

              <div className="h-8 w-8 2xl:h-9 2xl:w-9 min-[1920px]:h-10 min-[1920px]:w-10" />
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}