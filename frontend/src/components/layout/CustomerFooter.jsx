import React, { useState } from 'react';
import { Globe2, Share2 } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';

export default function CustomerFooter({ logoHref = '/customer/dashboard' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang: currentLang } = useLanguage();

  const languages = ['English', 'Sinhala', 'Tamil'];

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
              {t.privacy_policy}
            </a>

            <a href="/terms" className="transition hover:text-emerald-700">
              {t.terms_of_service}
            </a>

            <a href="/help" className="transition hover:text-emerald-700">
              {t.help_center}
            </a>

            <a href="/support" className="transition hover:text-emerald-700">
              {t.contact_support}
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-5 text-slate-500">
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 transition hover:text-emerald-700"
                aria-label="Language"
              >
                <Globe2 size={21} />
                <span className="text-xs font-semibold">{currentLang}</span>
              </button>

              {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 z-50 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setIsOpen(false);
                        localStorage.setItem('preferred_language', lang);
                        window.dispatchEvent(new Event('languageChange'));
                      }}
                      className="block w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

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