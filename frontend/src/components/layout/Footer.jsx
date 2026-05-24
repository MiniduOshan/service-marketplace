import React from 'react';
import { Smartphone, Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#071812] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16 2xl:max-w-400 min-[1920px]:max-w-440 2xl:px-12 2xl:py-20 min-[1920px]:px-16 min-[1920px]:py-24">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 2xl:gap-16 min-[1920px]:gap-20">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight 2xl:text-[30px] min-[1920px]:text-[36px]">
              SkilledLK
            </h2>

            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-500 2xl:max-w-sm 2xl:text-[15px] 2xl:leading-8 min-[1920px]:max-w-md min-[1920px]:text-base min-[1920px]:leading-9">
              Sri Lanka&apos;s most trusted marketplace for verified
              professional services. Quality work, guaranteed.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium text-white 2xl:text-[17px] min-[1920px]:text-[19px]">Explore</h3>

            <ul className="mt-6 space-y-4 text-sm text-slate-500 2xl:space-y-5 2xl:text-[15px] min-[1920px]:space-y-6 min-[1920px]:text-base">
              <li>
                <a href="#categories" className="transition hover:text-white">
                  Browse Categories
                </a>
              </li>
              <li>
                <a href="#top-professionals" className="transition hover:text-white">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#services" className="transition hover:text-white">
                  Safety &amp; Trust
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition hover:text-white">
                  Partner Program
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium text-white 2xl:text-[17px] min-[1920px]:text-[19px]">Company</h3>

            <ul className="mt-6 space-y-4 text-sm text-slate-500 2xl:space-y-5 2xl:text-[15px] min-[1920px]:space-y-6 min-[1920px]:text-base">
              <li>
                <a href="#services" className="transition hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#testimonials" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#testimonials" className="transition hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium text-white 2xl:text-[17px] min-[1920px]:text-[19px]">Download App</h3>

            <div className="mt-6 space-y-4 2xl:space-y-5 min-[1920px]:space-y-6">
              <a
                href="#app-store"
                className="flex h-14 w-full max-w-60 items-center gap-4 rounded-lg bg-[#1d2a3f] px-4 transition hover:bg-[#25344d] 2xl:max-w-67.5 2xl:h-16 2xl:px-5 min-[1920px]:max-w-75 min-[1920px]:h-18 min-[1920px]:px-6"
              >
                <Smartphone size={22} className="text-white 2xl:h-6 2xl:w-6 min-[1920px]:h-7 min-[1920px]:w-7" />

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 2xl:text-[11px] min-[1920px]:text-xs">
                    Download on
                  </p>
                  <p className="text-sm font-bold text-white 2xl:text-[15px] min-[1920px]:text-base">App Store</p>
                </div>
              </a>

              <a
                href="#google-play"
                className="flex h-14 w-full max-w-60 items-center gap-4 rounded-lg bg-[#1d2a3f] px-4 transition hover:bg-[#25344d] 2xl:max-w-67.5 2xl:h-16 2xl:px-5 min-[1920px]:max-w-75 min-[1920px]:h-18 min-[1920px]:px-6"
              >
                <Play size={20} className="text-white 2xl:h-5 2xl:w-5 min-[1920px]:h-6 min-[1920px]:w-6" />

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 2xl:text-[11px] min-[1920px]:text-xs">
                    Get it on
                  </p>
                  <p className="text-sm font-bold text-white 2xl:text-[15px] min-[1920px]:text-base">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-7 text-center sm:px-6 lg:px-8 2xl:max-w-400 min-[1920px]:max-w-440 2xl:px-12 2xl:py-8 min-[1920px]:px-16 min-[1920px]:py-10">
          <p className="text-xs text-slate-600 sm:text-sm 2xl:text-[15px] min-[1920px]:text-base">
            © 2026 SkilledLK Service Marketplace. Sri Lanka&apos;s Professional
            Network.
          </p>
        </div>
      </div>
    </footer>
  );
}