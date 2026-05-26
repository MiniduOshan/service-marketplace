import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Paintbrush,
  Zap,
  Wrench,
  Hammer,
  Snowflake,
  Brush,
  Warehouse,
  MoreHorizontal,
  Star,
  Navigation,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import { getStoredSessionUser, apiRequest } from '../../lib/api';

const categories = [
  {
    name: 'Painting',
    icon: Paintbrush,
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
  },
  {
    name: 'Electrical',
    icon: Zap,
    bg: 'bg-amber-50',
    color: 'text-orange-500',
  },
  {
    name: 'Plumbing',
    icon: Wrench,
    bg: 'bg-blue-50',
    color: 'text-blue-600',
  },
  {
    name: 'Carpentry',
    icon: Hammer,
    bg: 'bg-rose-50',
    color: 'text-rose-500',
  },
  {
    name: 'AC Repair',
    icon: Snowflake,
    bg: 'bg-purple-50',
    color: 'text-purple-500',
  },
  {
    name: 'Cleaning',
    icon: Brush,
    bg: 'bg-teal-50',
    color: 'text-teal-600',
  },
  {
    name: 'Masonry',
    icon: Warehouse,
    bg: 'bg-slate-100',
    color: 'text-slate-600',
  },
  {
    name: 'More',
    icon: MoreHorizontal,
    bg: 'bg-blue-50',
    color: 'text-emerald-700',
  },
];

function CategoryCard({ item, onSelect }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.name)}
      className="group flex min-h-[132px] flex-col items-center justify-center rounded-xl border border-slate-300 bg-white p-4 transition hover:-translate-y-1 hover:border-emerald-600 hover:shadow-md"
    >
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${item.bg}`}>
        <Icon className={item.color} size={30} strokeWidth={2.4} />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
        {item.name}
      </p>
    </button>
  );
}

function ProfessionalCard({ professional }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/worker/${professional.id}`)}
      className="cursor-pointer rounded-xl border border-slate-300 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-600 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${professional.avatarBg}`}
        >
          <span className="text-lg font-bold text-slate-900">{professional.initials}</span>
        </div>

        {professional.verified && (
          <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-700">
            <BadgeCheck size={13} />
            Verified
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-base font-bold text-slate-950">{professional.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{professional.role}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span>{professional.rating}</span>
        </div>

        <span className="h-4 w-px bg-slate-300" />

        <div className="flex items-center gap-1">
          <Navigation size={14} />
          <span>{professional.distance}</span>
        </div>

        <span className="h-4 w-px bg-slate-300" />

        <div>
          <p className="leading-tight text-slate-600">Starting at</p>
          <p className="font-bold text-emerald-700">{professional.price}</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/worker/${professional.id}`);
        }}
        className="mt-6 w-full rounded-md bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
      >
        Book Now
      </button>
    </div>
  );
}

function FeaturedSmallCard({ person }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/worker/${person.id}`)}
      className="flex w-full items-center gap-5 rounded-xl border border-slate-300 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-emerald-600 hover:shadow-md"
    >
      <img
        src={person.image}
        alt={person.name}
        className="h-16 w-16 rounded-md object-cover"
      />

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-base font-bold text-slate-950">{person.name}</h4>
        <p className="truncate text-sm text-slate-600">{person.role}</p>

        <div className="mt-1 flex items-center gap-1 text-sm">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-700">{person.rating}</span>
          <span className="text-slate-600">({person.reviews})</span>
        </div>
      </div>

      <ArrowRight size={20} className="text-slate-500" />
    </button>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const currentUser = getStoredSessionUser();
  const customerName = currentUser?.name?.trim();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        setLoading(true);
        const res = await apiRequest('/services');
        const services = res.data?.data || res.data || [];
        if (isMounted) {
          const bgColors = [
            'bg-emerald-300',
            'bg-indigo-100',
            'bg-slate-200',
            'bg-blue-100',
            'bg-amber-100',
            'bg-rose-100',
            'bg-teal-100',
            'bg-purple-100',
          ];
          const mapped = services.map((service, idx) => {
            const workerName = service.worker?.name || 'Verified Pro';
            const initials = workerName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const defaultImages = [
              'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
            ];
            return {
              id: service.worker?.id || '1',
              initials,
              name: workerName,
              role: service.title || 'Service Expert',
              rating: '4.8',
              distance: `${(1.2 + idx * 0.7).toFixed(1)} km`,
              price: `LKR ${parseFloat(service.price).toLocaleString()}`,
              verified: !!service.worker?.phone_verified_at,
              avatarBg: bgColors[idx % bgColors.length],
              reviews: `${24 + idx * 7} reviews`,
              image: defaultImages[idx % defaultImages.length],
            };
          });
          setServicesList(mapped);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setServicesList([]);
          setLoading(false);
        }
      }
    }
    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (categoryName) => {
    const targetCategory = categoryName === 'More' ? '' : categoryName;
    const query = targetCategory
      ? `?category=${encodeURIComponent(targetCategory)}`
      : '';
    navigate(`/search${query}`);
  };

  const topPick = servicesList.length > 0 ? servicesList[0] : null;
  const topRated = servicesList.slice(0, 4);
  const featuredList = servicesList.length > 4 ? servicesList.slice(4, 7) : servicesList.slice(1, 4);

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-950">
      <CustomerNavbar />

      <main>
        {/* Hero Search Section */}
        <section className="border-b border-slate-300 bg-gradient-to-br from-white via-white to-emerald-50/40">
          <div className="dashboard-shell py-14 sm:py-16 md:py-20 xl:py-24">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-[clamp(1.75rem,2.3vw,3.5rem)] font-bold leading-tight tracking-tight text-slate-950">
                {customerName ? `Good morning, ${customerName}!` : 'Find the best skilled professionals in Sri Lanka'}
              </h1>

              <div className="mx-auto mt-8 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm 2xl:mt-10">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px_220px]">
                  <div className="flex items-center gap-5 px-6 py-5">
                    <Search size={24} className="shrink-0 text-emerald-700" />
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center gap-5 border-t border-slate-200 px-6 py-5 md:border-l md:border-t-0">
                    <MapPin size={23} className="shrink-0 text-emerald-700" />
                    <input
                      type="text"
                      placeholder="Colombo, Sri Lanka"
                      className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="p-1.5">
                    <button className="h-full min-h-[58px] w-full rounded-lg bg-emerald-700 px-8 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-emerald-800">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="font-semibold text-slate-600">Popular:</span>

                {['Plumbing', 'Electrician', 'Masonry'].map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="dashboard-shell py-14 sm:py-16 md:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Explore Categories</h2>
              <p className="mt-1 text-base text-slate-600">
                Browse through our wide range of services
              </p>
            </div>

            <a
              href="/search"
              className="text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
            >
              View All Categories
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-8 2xl:gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                item={category}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>
        </section>

        {/* Top Rated Professionals */}
        <section className="dashboard-shell py-14 sm:py-16 md:py-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Top Rated Professionals</h2>
          </div>

          {loading ? (
            <div className="mt-10 text-center text-slate-500 py-10">Loading professionals...</div>
          ) : servicesList.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base font-medium text-slate-600">No professionals available at the moment.</p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7 xl:grid-cols-4 2xl:gap-8">
              {topRated.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Professionals */}
        {!loading && servicesList.length > 0 && (
          <section className="dashboard-shell py-14 sm:py-16 md:py-20">
            <h2 className="text-2xl font-bold text-slate-950">Featured Professionals</h2>

            <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-[1fr_430px] 2xl:grid-cols-[1fr_520px]">
              {/* Main Featured Card */}
              {topPick && (
                <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
                    <div className="relative min-h-[320px] overflow-hidden">
                      <img
                        src={topPick.image}
                        alt={topPick.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute left-7 top-7 rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold uppercase text-white">
                        Top Pick
                      </span>
                    </div>

                    <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                      <h3 className="text-3xl font-bold text-slate-950">
                        {topPick.name}
                      </h3>

                      <p className="mt-2 text-sm font-bold text-emerald-700">
                        {topPick.role} • Verified Pro
                      </p>

                      <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                        Specializing in high-quality professional {topPick.role.toLowerCase()} services.
                        Known for precision, reliability, and timely delivery.
                      </p>

                      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <button
                          onClick={() => navigate(`/worker/${topPick.id}`)}
                          className="rounded-md bg-emerald-700 px-10 py-4 text-sm font-bold text-white transition hover:bg-emerald-800"
                        >
                          Book Now
                        </button>

                        <button
                          onClick={() => navigate(`/worker/${topPick.id}`)}
                          className="rounded-md border border-emerald-700 px-10 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Featured List */}
              <div className="grid gap-6">
                {featuredList.map((person) => (
                  <FeaturedSmallCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
}