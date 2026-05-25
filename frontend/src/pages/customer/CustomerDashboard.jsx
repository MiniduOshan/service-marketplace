import React from 'react';
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
import { getStoredSessionUser } from '../../lib/api';

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

const topRatedProfessionals = [
  {
    initials: 'SK',
    name: 'Saman Kumara',
    role: 'Master Electrician',
    rating: '4.9',
    distance: '2.4 km',
    price: 'LKR 5,000',
    verified: true,
    avatarBg: 'bg-emerald-300',
  },
  {
    initials: 'NP',
    name: 'Nimal Perera',
    role: 'Expert Painter',
    rating: '4.8',
    distance: '5.1 km',
    price: 'LKR 3,500',
    verified: true,
    avatarBg: 'bg-indigo-100',
  },
  {
    initials: 'AD',
    name: 'Anura Dharmasena',
    role: 'Senior Plumber',
    rating: '5.0',
    distance: '1.8 km',
    price: 'LKR 4,000',
    verified: true,
    avatarBg: 'bg-slate-200',
  },
  {
    initials: 'RS',
    name: 'Rohan Silva',
    role: 'AC Specialist',
    rating: '4.7',
    distance: '3.9 km',
    price: 'LKR 5,000',
    verified: false,
    avatarBg: 'bg-blue-100',
  },
];

const featuredList = [
  {
    name: 'Kamal Perera',
    role: 'Masonry Expert',
    rating: '4.9',
    reviews: '124 reviews',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Shanti Abeysekera',
    role: 'Interior Painter',
    rating: '4.8',
    reviews: '89 reviews',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Ruwan Gunatunga',
    role: 'Plumbing Specialist',
    rating: '5.0',
    reviews: '56 reviews',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
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
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-7 transition hover:-translate-y-1 hover:border-emerald-600 hover:shadow-md">
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

      <button className="mt-6 w-full rounded-md bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
        Book Now
      </button>
    </div>
  );
}

function FeaturedSmallCard({ person }) {
  return (
    <button className="flex w-full items-center gap-5 rounded-xl border border-slate-300 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-emerald-600 hover:shadow-md">
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

  const handleCategorySelect = (categoryName) => {
    const targetCategory = categoryName === 'More' ? '' : categoryName;
    const query = targetCategory
      ? `?category=${encodeURIComponent(targetCategory)}`
      : '';
    navigate(`/search${query}`);
  };

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

            <div className="hidden items-center gap-3 sm:flex">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-emerald-700 hover:text-emerald-700">
                <ChevronLeft size={21} />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-emerald-700 hover:text-emerald-700">
                <ChevronRight size={21} />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7 xl:grid-cols-4 2xl:gap-8">
            {topRatedProfessionals.map((professional) => (
              <ProfessionalCard key={professional.name} professional={professional} />
            ))}
          </div>
        </section>

        {/* Featured Professionals */}
        <section className="dashboard-shell py-14 sm:py-16 md:py-20">
          <h2 className="text-2xl font-bold text-slate-950">Featured Professionals</h2>

          <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-[1fr_430px] 2xl:grid-cols-[1fr_520px]">
            {/* Main Featured Card */}
            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
                <div className="relative min-h-[320px] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=900&q=80"
                    alt="Kasun Wijesinghe"
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-7 top-7 rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold uppercase text-white">
                    Top Pick
                  </span>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <h3 className="text-3xl font-bold text-slate-950">
                    Kasun Wijesinghe
                  </h3>

                  <p className="mt-2 text-sm font-bold text-emerald-700">
                    Master Carpenter • 15 Years Experience
                  </p>

                  <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                    Specializing in high-end teak furniture, modern interior wood accents,
                    and heritage restoration. Known for precision and timely delivery
                    across the Western Province.
                  </p>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <button className="rounded-md bg-emerald-700 px-10 py-4 text-sm font-bold text-white transition hover:bg-emerald-800">
                      Book Now
                    </button>

                    <button className="rounded-md border border-emerald-700 px-10 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured List */}
            <div className="grid gap-6">
              {featuredList.map((person) => (
                <FeaturedSmallCard key={person.name} person={person} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}