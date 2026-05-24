import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    window.location.hash || '#services'
  );
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Categories', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Top Professionals', href: '#top-professionals' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const updateFromHash = () => {
      setActiveSection(window.location.hash || '#services');
    };

    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const updateFromScroll = () => {
      if (!sections.length) return;

      const offset = 110;
      let currentSection = '#services';

      for (const section of sections) {
        if (window.scrollY + offset >= section.offsetTop) {
          currentSection = `#${section.id}`;
        }
      }

      setActiveSection((prev) => (prev === currentSection ? prev : currentSection));
    };

    updateFromHash();
    updateFromScroll();
    window.addEventListener('hashchange', updateFromHash);
    window.addEventListener('scroll', updateFromScroll, { passive: true });

    return () => {
      window.removeEventListener('hashchange', updateFromHash);
      window.removeEventListener('scroll', updateFromScroll);
    };
  }, []);

  const handleSectionClick = (href) => {
    setActiveSection(href);
    closeMenu();
  };

  const handleSigninClick = () => {
    closeMenu();
    navigate('/login');
  };

  const handleSignupClick = () => {
    closeMenu();
    navigate('/signup');
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 2xl:max-w-550 min-[1920px]:max-w-700 min-[2560px]:max-w-800 2xl:h-18 2xl:px-12 min-[1920px]:h-20 min-[1920px]:px-16 min-[2560px]:px-20">
        <a
          href="#services"
          onClick={() => handleSectionClick('#services')}
          className="cursor-pointer text-xl font-extrabold tracking-tight text-[#05735f] sm:text-2xl 2xl:text-[28px] min-[1920px]:text-[32px]"
        >
          SkilledLK
        </a>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8 2xl:gap-10 min-[1920px]:gap-14 min-[2560px]:gap-16">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleSectionClick(link.href)}
              aria-current={activeSection === link.href ? 'page' : undefined}
              className={`relative cursor-pointer text-sm font-medium transition hover:text-[#05735f] 2xl:text-[15px] min-[1920px]:text-base ${
                activeSection === link.href ? 'text-[#05735f]' : 'text-slate-600'
              }`}
            >
              {link.label}

              {activeSection === link.href && (
                <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-[#05735f]" />
              )}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex 2xl:gap-6 min-[1920px]:gap-8 min-[2560px]:gap-10">
          <button
            type="button"
            onClick={handleSigninClick}
            className="btn-press cursor-pointer text-sm font-semibold text-slate-700 transition hover:text-[#05735f] 2xl:text-[15px] min-[1920px]:text-base"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleSignupClick}
            className="btn-press cursor-pointer rounded-lg bg-[#05735f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#046553] 2xl:px-7 2xl:py-3 2xl:text-[15px] min-[1920px]:px-8 min-[1920px]:py-3.5 min-[1920px]:text-base"
          >
            Sign Up
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="btn-press inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden 2xl:h-11 2xl:w-11 min-[1920px]:h-12 min-[1920px]:w-12"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden 2xl:px-12 min-[1920px]:px-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 2xl:max-w-400 min-[1920px]:max-w-440">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleSectionClick(link.href)}
                aria-current={activeSection === link.href ? 'page' : undefined}
                className={`cursor-pointer rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-emerald-50 hover:text-[#05735f] 2xl:px-4 2xl:py-3.5 2xl:text-[15px] min-[1920px]:text-base ${
                  activeSection === link.href
                    ? 'bg-emerald-50 text-[#05735f]'
                    : 'text-slate-700'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 2xl:gap-4 2xl:pt-5">
              <button
                type="button"
                onClick={handleSigninClick}
                className="btn-press cursor-pointer rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50 2xl:px-5 2xl:py-3.5 2xl:text-[15px] min-[1920px]:text-base"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={handleSignupClick}
                className="btn-press cursor-pointer rounded-lg bg-[#05735f] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#046553] 2xl:px-5 2xl:py-3.5 2xl:text-[15px] min-[1920px]:text-base"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}