import React from 'react';
import { Globe2, Share2 } from 'lucide-react';

export default function CustomerFooter({ logoHref = '/customer/dashboard' }) {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-[1760px] px-5 py-8 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="shrink-0">
            <a
              href={logoHref}
              className="text-xl font-bold tracking-tight text-emerald-700"
            >
              SkilledLK
            </a>

            <p className="mt-3 text-xs text-slate-500 sm:text-sm">
              © 2026 SkilledLK Marketplace. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3 sm:text-sm lg:justify-center">
            <a href="/privacy" className="transition hover:text-emerald-700">
              Privacy Policy
            </a>

            <a href="/terms" className="transition hover:text-emerald-700">
              Terms of Service
            </a>

            <a href="/help" className="transition hover:text-emerald-700">
              Help Center
            </a>

            <a href="/support" className="transition hover:text-emerald-700">
              Contact Support
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-5 text-slate-500">
            <button
              className="transition hover:text-emerald-700"
              aria-label="Language"
            >
              <Globe2 size={21} />
            </button>

            <button
              className="transition hover:text-emerald-700"
              aria-label="Share"
            >
              <Share2 size={21} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}