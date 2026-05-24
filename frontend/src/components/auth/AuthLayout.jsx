import React from 'react';
import dilshanProfile from '../../assets/dilshan_profile.png';
import heroHandshake from '../../assets/hero_handshake.png';

export const AuthLayout = ({ 
  children, 
  title = "Sri Lanka's most trusted skilled worker platform.",
  subtitle,
  items = ["ID-verified workers", "Secure payments", "2,100+ happy customers"],
  testimonial = {
    text: "SkilledLK changed how I find work. The platform is seamless and secure.",
    author: "Dilshan Perera",
    stats: "Earned LKR 42,000 this month",
    avatar: dilshanProfile
  },
  heroImage = heroHandshake,
  imageType = "rectangle" // "rectangle" or "circle"
}) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Branding & Social Proof */}
      <div className="hidden lg:flex w-1/2 bg-[#1B5E44] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Pattern/Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-16 tracking-tight">SkilledLK</h1>
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              {title}
            </h2>
            {subtitle && <p className="text-white/80 text-xl mb-8">{subtitle}</p>}
            
            <ul className="space-y-5">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-4 text-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-8">
          {imageType === "circle" ? (
            <div className="relative">
              <div className="w-80 h-80 rounded-full border-4 border-white/20 p-4">
                <div className="w-full h-full rounded-full border-2 border-white/40 p-2">
                   <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                   </div>
                </div>
              </div>
              {/* Decorative elements for circular image */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                 <svg className="w-6 h-6 text-[#1B5E44]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
               <img src={heroImage} alt="Hero" className="w-full h-48 object-cover rounded-xl" />
            </div>
          )}
        </div>

        {/* Testimonial Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 max-w-md shadow-xl">
          <p className="text-lg italic mb-6 leading-relaxed">"{testimonial.text}"</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 bg-white/20">
              <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-lg">{testimonial.author}</p>
              <p className="text-emerald-400 text-sm font-medium">{testimonial.stats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute top-12 left-12">
          <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
        <div className="absolute top-12 right-12 text-[#1B5E44] font-bold text-xl tracking-tight">SkilledLK</div>
        <div className="w-full max-w-md">
          {children}
        </div>
        
        {/* Footer info */}
        <div className="mt-auto pt-12 text-gray-400 text-xs text-center w-full">
           © 2026 SkilledLK Professional Marketplace.
        </div>
      </div>
    </div>
  );
};