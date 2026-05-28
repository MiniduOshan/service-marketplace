import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Paintbrush,
  Zap,
  Wrench,
  Hammer,
  Snowflake,
  SprayCan,
  PlusCircle,
  Star,
  CheckCircle,
  XCircle,
  Flower2,
  Tv,
  Bug,
  Car,
  Sparkles,
  Laptop,
  Palette,
  Camera,
  Utensils,
  Dumbbell,
  GraduationCap,
  Truck,
  Languages,
} from 'lucide-react';

import Navbar from '../components/layout/Navbar';
import CustomerNavbar from '../components/layout/CustomerNavbar';
import Footer from '../components/layout/Footer';
import AuthFlow from './auth/AuthFlow';
import { apiRequest, getStoredSessionUser } from '../lib/api';

const defaultServiceCategories = [
  {
    name: 'Painting',
    icon: Paintbrush,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    name: 'Electrical',
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    name: 'Plumbing',
    icon: Wrench,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
  },
  {
    name: 'Carpentry',
    icon: Hammer,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    name: 'AC Repair',
    icon: Snowflake,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    name: 'Cleaning',
    icon: SprayCan,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    name: 'Masonry',
    icon: Wrench,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
  },
  {
    name: '+More',
    icon: PlusCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
];

const heroWorkers = [
  {
    name: 'Nimal Silva',
    role: 'Expert Electrician',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Samantha Perera',
    role: 'Master Carpenter',
    rating: '5.0',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Aruni Fernando',
    role: 'Interior Painter',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

const professionals = [
  {
    name: 'Arshad Majeed',
    role: 'Plumbing & Sanitary Expert',
    rating: '4.9',
    jobs: '120+ Jobs',
    badge: 'Verified ID',
    image:
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
    label: 'PLATINUM PRO',
  },
  {
    name: 'Chathura Peiris',
    role: 'Licensed Electrician',
    rating: '5.0',
    jobs: '85 Jobs',
    badge: 'Safety First',
    image:
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
    label: 'ELITE',
  },
  {
    name: 'Dilantha Goonewardena',
    role: 'Property Maintenance',
    rating: '4.7',
    jobs: '200+ Jobs',
    badge: 'Multi-skilled',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    label: null,
  },
];

const testimonials = [
  {
    quote:
      'Found a reliable plumber within 10 minutes. Arshad was professional and fixed the leak quickly. Highly recommend SkilledLK for anyone in Colombo.',
    name: 'Nadine Jayasuriya',
    location: 'Colombo 07',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      'As a professional electrician, SkilledLK has changed how I get clients. No more waiting for calls, I get verified leads every day.',
    name: 'Kasun Rathnayake',
    location: 'Verified Pro',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      'Great experience hiring a deep cleaning crew for my new apartment. Transparent pricing and the team was very thorough.',
    name: 'Dimuthu Perera',
    location: 'Kandy',
    avatar:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&q=80',
  },
];

const workerBenefits = [
  {
    title: 'Set your own schedule',
    text: 'Work when you want, where you want.',
  },
  {
    title: 'Guaranteed Payments',
    text: 'Get paid on time directly to your bank account.',
  },
  {
    title: 'Verified Leads',
    text: 'We filter the noise so you only get serious clients.',
  },
  {
    title: 'Grow your Brand',
    text: 'Build a reputation with public reviews.',
  },
];

function RatingStars() {
  return (
    <div className="flex gap-0.5 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} fill="currentColor" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceCategories, setServiceCategories] = useState(defaultServiceCategories);
  const [searchVal, setSearchVal] = useState('');
  const [locationVal, setLocationVal] = useState('');
  const [professionalsList, setProfessionalsList] = useState([]);
  const [loadingPros, setLoadingPros] = useState(true);

  const authConfigByPath = {
    '/login': { initialView: 'login', entryMode: 'signin' },
    '/signup': { initialView: 'role-selection', entryMode: 'signup' },
  };
  const authConfig = authConfigByPath[location.pathname];
  const pageWidthClass =
    'mx-auto w-full max-w-7xl 2xl:max-w-[1600px] min-[1920px]:max-w-[1760px]';

  useEffect(() => {
    let isMounted = true;

    apiRequest('/categories')
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const themeByName = {
          Painting: { icon: Paintbrush, color: 'text-blue-500', bg: 'bg-blue-50' },
          Electrical: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
          Plumbing: { icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50' },
          Carpentry: { icon: Hammer, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          'AC Repair': { icon: Snowflake, color: 'text-teal-500', bg: 'bg-teal-50' },
          Cleaning: { icon: SprayCan, color: 'text-purple-500', bg: 'bg-purple-50' },
          Masonry: { icon: Wrench, color: 'text-slate-600', bg: 'bg-slate-50' },
          Gardening: { icon: Flower2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          'Appliance Repair': { icon: Tv, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          'Pest Control': { icon: Bug, color: 'text-red-500', bg: 'bg-red-50' },
          'Auto Repair': { icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
          'Car Detailing': { icon: Sparkles, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          'Tech Support': { icon: Laptop, color: 'text-slate-800', bg: 'bg-slate-100' },
          'Graphic Design': { icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50' },
          Photography: { icon: Camera, color: 'text-sky-500', bg: 'bg-sky-50' },
          Catering: { icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-50' },
          'Personal Training': { icon: Dumbbell, color: 'text-red-600', bg: 'bg-red-50' },
          'Academic Tutoring': { icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50' },
          'Moving & Packing': { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
          Translation: { icon: Languages, color: 'text-teal-600', bg: 'bg-teal-50' },
        };

        const cards = response.data.map((category) => {
          const theme = themeByName[category.name] || themeByName.Painting;

          return {
            name: category.name,
            ...theme,
          };
        });

        cards.push(defaultServiceCategories[7]);
        setServiceCategories(cards);
      })
      .catch(() => {
        if (isMounted) {
          setServiceCategories(defaultServiceCategories);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPros() {
      try {
        setLoadingPros(true);
        const res = await apiRequest('/services');
        const services = res.data?.data || res.data || [];
        if (isMounted) {
          const seenWorkers = new Set();
          const uniqueServices = [];
          for (const service of services) {
            const wId = service.worker?.id;
            if (wId && !seenWorkers.has(wId)) {
              seenWorkers.add(wId);
              uniqueServices.push(service);
            }
          }

          const mapped = uniqueServices.slice(0, 3).map((service, idx) => {
            const workerName = service.worker?.name || 'Verified Pro';
            const defaultImages = [
              'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
            ];
            return {
              id: service.worker?.id || '1',
              name: workerName,
              role: service.title || 'Service Expert',
              rating: '4.9',
              jobs: '120+ Jobs',
              badge: service.worker?.phone_verified_at ? 'Verified ID' : 'Basic ID',
              image: defaultImages[idx % defaultImages.length],
              label: service.is_active ? 'ELITE' : null,
            };
          });

          setProfessionalsList(mapped);
          setLoadingPros(false);
        }
      } catch (err) {
        if (isMounted) {
          setProfessionalsList([]);
          setLoadingPros(false);
        }
      }
    }

    loadPros();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = () => {
    const params = [];
    if (searchVal.trim()) params.push(`search=${encodeURIComponent(searchVal.trim())}`);
    if (locationVal.trim()) params.push(`location=${encodeURIComponent(locationVal.trim())}`);
    const queryStr = params.length > 0 ? `?${params.join('&')}` : '';
    navigate(`/search${queryStr}`);
  };

  const isLoggedIn = !!getStoredSessionUser();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f7fb] text-slate-900">
      {isLoggedIn ? <CustomerNavbar activePage="home" /> : <Navbar />}

      <main className="pt-16">
        {/* Hero / Services Section */}
        <section
          id="services"
          className="relative scroll-mt-20 overflow-hidden bg-linear-to-br from-[#effff8] via-[#f4fffb] to-[#eefcf7]"
        >
          <div className={`${pageWidthClass} grid min-h-[calc(100vh-64px)] grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:px-8 xl:gap-16 2xl:gap-20 2xl:px-12 2xl:py-20 min-[1920px]:gap-24 min-[1920px]:px-16 min-[1920px]:py-24`}>
            <div className="text-center lg:text-left">
              <div className="lp-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-medium text-emerald-700 shadow-sm sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live — 347 workers available now
              </div>

              <h1 className="lp-fade-up lp-delay-1 mx-auto max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:mx-0 lg:max-w-xl xl:text-[64px] 2xl:max-w-3xl 2xl:text-[72px] min-[1920px]:text-[84px]">
                Find{' '}
                <span className="text-[#05735f]">
                  verified
                </span>{' '}
                skilled workers near you
              </h1>

              <div className="lp-fade-up lp-delay-2 mx-auto mt-8 w-full max-w-xl rounded-2xl bg-white p-3 shadow-xl shadow-slate-200/70 lg:mx-0 2xl:max-w-2xl min-[1920px]:max-w-3xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3 px-3 py-2">
                    <Search size={20} className="shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                      placeholder="What service?"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <div className="flex flex-1 items-center gap-3 px-3 py-2">
                    <MapPin size={20} className="shrink-0 text-slate-400" />
                    <input
                      type="text"
                      value={locationVal}
                      onChange={(e) => setLocationVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                      placeholder="Colombo"
                      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    onClick={handleSearchSubmit}
                    className="btn-press cursor-pointer rounded-xl bg-[#05735f] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#046553] sm:shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>

              <p className="lp-fade-up lp-delay-3 mt-6 text-sm text-slate-500">
                Popular: Plumbing, Electrical, Deep Cleaning
              </p>
            </div>

            <div className="relative mx-auto hidden min-h-105 w-full max-w-xl items-center justify-center lg:flex 2xl:max-w-2xl min-[1920px]:max-w-3xl">
              <div className="lp-fade-in lp-float absolute h-95 w-110 rotate-3 rounded-[42px] bg-emerald-100/70 xl:h-105 xl:w-125 2xl:h-125 2xl:w-145 min-[1920px]:h-140 min-[1920px]:w-160" />
              <div className="lp-fade-in absolute h-78.75 w-93.75 rounded-[36px] border-28 border-emerald-50/80 xl:h-87.5 xl:w-107.5 2xl:h-105 2xl:w-125 min-[1920px]:h-117.5 min-[1920px]:w-140" />

              <div className="relative z-10 w-full max-w-md space-y-5 2xl:max-w-lg 2xl:space-y-6 min-[1920px]:max-w-xl min-[1920px]:space-y-7">
                {heroWorkers.map((person, index) => (
                  <div
                    key={person.name}
                    className={`lp-pop lp-card-hover flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-xl shadow-slate-300/40 2xl:px-6 2xl:py-5 min-[1920px]:px-7 min-[1920px]:py-6 ${
                      index === 0
                        ? 'mr-8'
                        : index === 1
                        ? 'ml-4 mr-12'
                        : 'ml-10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover 2xl:h-14 2xl:w-14 min-[1920px]:h-16 min-[1920px]:w-16"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-800 2xl:text-base min-[1920px]:text-lg">
                            {person.name}
                          </h3>
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                            ✓
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm 2xl:text-base min-[1920px]:text-lg">
                          {person.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 2xl:text-base min-[1920px]:text-lg">
                      <Star size={14} fill="currentColor" className="2xl:h-4 2xl:w-4 min-[1920px]:h-5 min-[1920px]:w-5" />
                      {person.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile worker cards */}
          <div className="px-4 pb-12 sm:px-6 lg:hidden 2xl:px-12 min-[1920px]:px-16">
            <div className="mx-auto grid max-w-xl gap-4">
              {heroWorkers.map((person) => (
                <div
                  key={person.name}
                  className="lp-fade-up lp-card-hover flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {person.name}
                      </h3>
                      <p className="text-xs text-slate-500">{person.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                    <Star size={13} fill="currentColor" />
                    {person.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-y border-slate-100 bg-white/80">
            <div className={`${pageWidthClass} grid grid-cols-2 gap-y-6 px-4 py-6 text-center sm:px-6 md:grid-cols-4 lg:px-8 2xl:py-8 min-[1920px]:py-10`}>
              <div className="lp-fade-up md:border-r md:border-slate-200">
                <h3 className="text-base font-bold text-slate-800">2,100+</h3>
                <p className="mt-1 text-xs text-slate-500">Customers</p>
              </div>

              <div className="lp-fade-up lp-delay-1 md:border-r md:border-slate-200">
                <h3 className="text-base font-bold text-slate-800">347</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Verified Workers
                </p>
              </div>

              <div className="lp-fade-up lp-delay-2 md:border-r md:border-slate-200">
                <h3 className="text-base font-bold text-slate-800">{serviceCategories.length}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Service Categories
                </p>
              </div>

              <div className="lp-fade-up lp-delay-3">
                <h3 className="text-base font-bold text-slate-800">4.8 ★</h3>
                <p className="mt-1 text-xs text-slate-500">Avg Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section
          id="categories"
          className={`${pageWidthClass} scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20 2xl:py-24 min-[1920px]:py-28`}
        >
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Browse Service Categories
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-8 2xl:gap-x-8 2xl:gap-y-10 min-[1920px]:gap-x-10 min-[1920px]:gap-y-12">
            {serviceCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.name}
                  onClick={() => {
                    if (category.name === '+More') {
                      navigate('/search');
                    } else {
                      navigate(`/search?category=${encodeURIComponent(category.name)}`);
                    }
                  }}
                  className="lp-fade-up lp-category-hover cursor-pointer flex flex-col items-center gap-4 text-center"
                >
                  <div
                    className={`lp-category-icon flex h-14 w-14 items-center justify-center rounded-2xl 2xl:h-16 2xl:w-16 min-[1920px]:h-20 min-[1920px]:w-20 ${category.bg}`}
                  >
                      <Icon size={23} className={`${category.color} 2xl:h-6 2xl:w-6 min-[1920px]:h-7 min-[1920px]:w-7`} />
                  </div>

                    <p className="lp-category-label text-sm font-medium text-slate-700 2xl:text-base min-[1920px]:text-lg">
                    {category.name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className={`${pageWidthClass} scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20 2xl:pb-24 min-[1920px]:pb-28`}
        >
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            How It Works
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {[
              {
                no: '01',
                title: 'Post a Request',
                text: 'Tell us what you need and your location. It takes less than 2 minutes.',
              },
              {
                no: '02',
                title: 'Compare Pros',
                text: 'Review profiles, ratings, and verified experience of local workers.',
              },
              {
                no: '03',
                title: 'Hire & Pay',
                text: 'Chat with the professional, confirm the job, and pay securely after completion.',
              },
            ].map((step) => (
              <div
                key={step.no}
                className="lp-fade-up lp-card-hover relative overflow-hidden rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100"
              >
                <span className="absolute left-6 top-3 text-5xl font-black leading-none text-emerald-50">
                  {step.no}
                </span>

                <div className="relative z-10 pt-8">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Professionals */}
        <section
          id="top-professionals"
          className={`${pageWidthClass} scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20 2xl:pb-24 min-[1920px]:pb-28`}
        >
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Top Rated Professionals
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Hand-picked experts with consistent 5-star delivery.
              </p>
            </div>

            <button
              onClick={() => navigate('/search')}
              className="btn-press w-fit border-b-2 border-[#05735f] text-sm font-semibold text-[#05735f]"
            >
              View all workers
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {professionalsList.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                <span className="text-4xl">👥</span>
                <p className="mt-4 text-lg font-medium text-slate-700">No verified professionals listed yet</p>
                <p className="mt-1 text-sm text-slate-500">Real professionals will appear here once they register and add service packages.</p>
              </div>
            ) : (
              professionalsList.map((pro) => (
                <div
                  key={pro.id || pro.name}
                  className="lp-fade-up lp-card-hover overflow-hidden rounded-2xl bg-white shadow-md shadow-slate-200 ring-1 ring-slate-100"
                >
                  <div className="relative h-48 overflow-hidden sm:h-52 md:h-44 lg:h-52">
                    <img
                      src={pro.image}
                      alt={pro.name}
                      className="h-full w-full object-cover cursor-pointer hover:scale-105 transition duration-300"
                      onClick={() => navigate(`/worker/${pro.id}`)}
                    />

                    {pro.label && (
                      <span className="absolute left-4 top-4 rounded bg-yellow-500 px-2 py-1 text-[10px] font-bold text-white">
                        {pro.label}
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          onClick={() => navigate(`/worker/${pro.id}`)}
                          className="text-sm font-bold text-slate-900 cursor-pointer hover:text-[#05735f] transition"
                        >
                          {pro.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {pro.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                        <Star size={13} fill="currentColor" />
                        {pro.rating}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-50 px-3 py-1">
                        {pro.jobs}
                      </span>

                      <span className="rounded-full bg-slate-50 px-3 py-1">
                        {pro.badge}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/worker/${pro.id}`)}
                      className="btn-press cursor-pointer mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-[#05735f] hover:bg-emerald-50"
                    >
                      View profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Worker CTA */}
        <section className="bg-[#071812] py-16 text-white lg:py-24 2xl:py-28 min-[1920px]:py-32">
          <div className={`${pageWidthClass} grid grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 2xl:gap-16 2xl:px-12 min-[1920px]:gap-20 min-[1920px]:px-16`}>
            <div>
              <h2 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Earn up to LKR 85,000/month
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
                Join the largest network of professionals in Sri Lanka and grow
                your business today.
              </p>

              <div className="mt-10 space-y-6">
                {workerBenefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <CheckCircle size={18} className="mt-1 shrink-0 text-emerald-400" />

                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {benefit.title}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-7 text-slate-900 shadow-2xl sm:p-10">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-emerald-50" />

                <h3 className="text-lg font-extrabold">
                  Earnings Calculator
                </h3>

                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  Average monthly payout for Top Pro category.
                </p>

                <div className="mt-8 rounded-xl bg-slate-50 p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Projected Earnings
                  </p>

                  <h4 className="mt-2 text-2xl font-black text-[#05735f] sm:text-3xl">
                    LKR 85,000
                    <span className="text-sm font-semibold text-slate-400">
                      {' '}
                      /mo
                    </span>
                  </h4>
                </div>

                <button className="btn-press cursor-pointer mt-8 w-full rounded-lg bg-[#05735f] py-3 text-sm font-bold text-white transition hover:bg-[#046553]">
                  Sign Up as a Pro
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Free to join. No hidden fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className={`${pageWidthClass} scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-24 2xl:py-28 min-[1920px]:py-32`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Simple, transparent pricing for workers
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Start free. Upgrade when you&apos;re ready to grow.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-7 ring-1 ring-slate-200 sm:p-8">
              <h3 className="text-xl font-extrabold text-slate-800">
                FREE PLAN
              </h3>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-3xl font-black">LKR 0</span>

                <span className="pb-1 text-xs text-slate-500">/month</span>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ['Basic Directory Listing', true],
                  ['Accept 5 Direct Jobs/mo', true],
                  ['Pro Badge on Profile', false],
                  ['Priority Search Ranking', false],
                  ['Zero Platform Fees on Direct Jobs', false],
                ].map(([item, active]) => (
                  <div
                    key={item}
                    className={`flex items-center gap-3 text-sm ${
                      active ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {active ? (
                      <CheckCircle size={16} className="shrink-0 text-[#05735f]" />
                    ) : (
                      <XCircle size={16} className="shrink-0 text-slate-300" />
                    )}

                    {item}
                  </div>
                ))}
              </div>

              <button className="btn-press cursor-pointer mt-12 w-full rounded-lg border border-[#05735f] py-3 text-sm font-bold text-slate-800 hover:bg-emerald-50">
                Get started free
              </button>
            </div>

            <div className="relative rounded-2xl bg-[#eef4ff] p-7 ring-2 ring-[#05735f] sm:p-8">
              <span className="absolute -top-3 right-8 rounded-full bg-yellow-400 px-4 py-1 text-[10px] font-bold text-white">
                MOST POPULAR
              </span>

              <h3 className="text-xl font-extrabold text-[#05735f]">
                PRO PLAN
              </h3>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-3xl font-black">LKR 2,500</span>

                <span className="pb-1 text-xs text-slate-500">/month</span>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  'Premium Directory Listing',
                  'Unlimited Direct Jobs',
                  'Pro Badge on Profile',
                  'Priority Search Ranking (+30%)',
                  'Zero Platform Fees on Direct Jobs',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <CheckCircle size={16} className="shrink-0 text-[#05735f]" />
                    {item}
                  </div>
                ))}
              </div>

              <button className="btn-press cursor-pointer mt-12 w-full rounded-lg bg-[#05735f] py-3 text-sm font-bold text-white hover:bg-[#046553]">
                Subscribe & go Pro
              </button>

              <p className="mt-4 text-center text-xs text-slate-500">
                Average Pro worker earns LKR 42,000/month
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className={`${pageWidthClass} scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24 2xl:pb-28 min-[1920px]:pb-32`}
        >
          <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            What our customers say
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="lp-fade-up lp-card-hover rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100 sm:p-8"
              >
                <RatingStars />

                <p className="mt-5 text-sm italic leading-7 text-slate-600 sm:text-[15px]">
                  &quot;{item.quote}&quot;
                </p>

                <div className="mt-7 flex items-center gap-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </h4>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {authConfig && (
        <AuthFlow
          initialView={authConfig.initialView}
          entryMode={authConfig.entryMode}
        />
      )}
    </div>
  );
}