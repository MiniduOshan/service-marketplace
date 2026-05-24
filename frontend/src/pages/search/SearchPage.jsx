import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Briefcase,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  Navigation,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';

const categoryOptions = ['Painters', 'Interior Designers'];

const workers = [
  {
    id: 1,
    name: 'Arjuna Mahendra',
    avatar: 'AM',
    role: 'Painter',
    category: 'Painters',
    location: 'Colombo 5',
    experience: '8 years exp.',
    experienceYears: 8,
    rating: 4.9,
    reviews: 127,
    price: 5000,
    unit: '/ room',
    distance: 4,
    verified: true,
    featured: true,
    pro: true,
    avatarClass: 'bg-emerald-700 text-white',
  },
  {
    id: 2,
    name: 'Sunil Wijesinghe',
    avatar: 'SW',
    role: 'Painter',
    category: 'Painters',
    location: 'Dehiwala',
    experience: '12 years exp.',
    experienceYears: 12,
    rating: 4.2,
    reviews: 84,
    price: 4200,
    unit: '/ room',
    distance: 8,
    verified: true,
    featured: false,
    pro: false,
    avatarClass: 'bg-slate-200 text-slate-600',
  },
  {
    id: 3,
    name: 'Kasun Perera',
    avatar: 'KP',
    role: 'Painter',
    category: 'Painters',
    location: 'Battaramulla',
    experience: '5 years exp.',
    experienceYears: 5,
    rating: 4.7,
    reviews: 210,
    price: 6500,
    unit: '/ room',
    distance: 12,
    verified: true,
    featured: false,
    pro: false,
    avatarClass: 'bg-slate-950 text-white',
  },
  {
    id: 4,
    name: 'Nimali Fernando',
    avatar: 'NF',
    role: 'Interior Designer',
    category: 'Interior Designers',
    location: 'Colombo 7',
    experience: '6 years exp.',
    experienceYears: 6,
    rating: 4.6,
    reviews: 96,
    price: 12000,
    unit: '/ project',
    distance: 6,
    verified: false,
    featured: false,
    pro: false,
    avatarClass: 'bg-purple-100 text-purple-700',
  },
  {
    id: 5,
    name: 'Ruwan Jayasinghe',
    avatar: 'RJ',
    role: 'Painter',
    category: 'Painters',
    location: 'Nugegoda',
    experience: '3 years exp.',
    experienceYears: 3,
    rating: 3.9,
    reviews: 42,
    price: 3500,
    unit: '/ room',
    distance: 18,
    verified: false,
    featured: false,
    pro: false,
    avatarClass: 'bg-orange-100 text-orange-700',
  },
  {
    id: 6,
    name: 'Shanthi Abeysekera',
    avatar: 'SA',
    role: 'Interior Designer',
    category: 'Interior Designers',
    location: 'Colombo 3',
    experience: '10 years exp.',
    experienceYears: 10,
    rating: 4.8,
    reviews: 156,
    price: 15000,
    unit: '/ project',
    distance: 3,
    verified: true,
    featured: true,
    pro: false,
    avatarClass: 'bg-blue-100 text-blue-700',
  },
];

const initialFilters = {
  serviceQuery: '',
  locationQuery: '',
  under5000: false,
  between5000And15000: false,
  rating4Plus: false,
  verifiedOnly: false,
  distance: 'any',
  category: '',
  sortBy: 'Recommended',
};

const distanceOptions = [
  { label: 'Within 5km', value: '5' },
  { label: 'Within 10km', value: '10' },
  { label: 'Within 20km', value: '20' },
  { label: 'Any distance', value: 'any' },
];

const sortOptions = [
  'Recommended',
  'Highest Rated',
  'Lowest Price',
  'Highest Price',
  'Most Experienced',
];

const itemsPerPage = 3;

function formatPrice(price) {
  return price.toLocaleString('en-US');
}

function CheckboxRow({ label, checked, onChange, orange = false }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
          checked
            ? 'border-emerald-700 bg-emerald-700'
            : 'border-slate-400 bg-white'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>

      <span className={orange ? 'text-orange-500' : ''}>{label}</span>
    </label>
  );
}

function FilterPanel({
  filters,
  updateFilter,
  selectCategory,
  clearFilters,
  mobile = false,
  onClose,
}) {
  return (
    <aside
      className={`bg-white ${
        mobile
          ? 'h-full w-full overflow-y-auto p-6'
          : 'hidden w-64 shrink-0 border-r border-slate-200 py-6 lg:block lg:px-8 xl:px-10'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 lg:text-xl">
            Filters
          </h2>
          <p className="mt-1 text-sm text-slate-500 lg:text-xs">
            Refine your search
          </p>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="mt-8 space-y-9">
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-700">
            <Briefcase size={15} />
            Price Range
          </h3>

          <div className="space-y-3">
            <CheckboxRow
              label="Under LKR 5,000"
              checked={filters.under5000}
              onChange={() => updateFilter('under5000', !filters.under5000)}
            />

            <CheckboxRow
              label="LKR 5,000 - 15,000"
              checked={filters.between5000And15000}
              onChange={() =>
                updateFilter(
                  'between5000And15000',
                  !filters.between5000And15000
                )
              }
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Star size={15} />
            Ratings
          </h3>

          <CheckboxRow
            label="4++"
            orange
            checked={filters.rating4Plus}
            onChange={() => updateFilter('rating4Plus', !filters.rating4Plus)}
          />
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Navigation size={15} />
            Distance
          </h3>

          <div className="relative">
            <select
              value={filters.distance}
              onChange={(e) => updateFilter('distance', e.target.value)}
              className="h-9 w-full appearance-none rounded border border-slate-300 bg-slate-100 px-3 pr-9 text-sm font-medium text-slate-800 outline-none"
            >
              {distanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <ShieldCheck size={15} />
            Verified Status
          </h3>

          <CheckboxRow
            label="Verified Workers Only"
            checked={filters.verifiedOnly}
            onChange={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
          />
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <SlidersHorizontal size={15} />
            Categories
          </h3>

          <div className="space-y-2">
            {categoryOptions.map((category) => {
              const isSelected =
                filters.category === category ||
                filters.serviceQuery.trim().toLowerCase() ===
                  category.toLowerCase();

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => selectCategory(category)}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? 'bg-emerald-50 font-semibold text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="h-12 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-500 transition hover:border-emerald-700 hover:text-emerald-700"
        >
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
    >
      {label}
      <X size={13} />
    </button>
  );
}

function WorkerCard({ worker }) {
  const navigate = useNavigate();

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        worker.pro ? 'border-emerald-200' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col gap-6 p-6 sm:p-7 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${worker.avatarClass}`}
          >
            {worker.avatar}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-950 sm:text-xl">
                {worker.name}
              </h3>

              {worker.verified && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <BadgeCheck size={12} />
                  Verified
                </span>
              )}

              {worker.featured && (
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                  Featured
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500 sm:text-base">
              <span className="flex items-center gap-1">
                <Briefcase size={15} />
                {worker.role}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={15} />
                {worker.location}
              </span>

              <span className="flex items-center gap-1">
                <Clock3 size={15} />
                {worker.experience}
              </span>

              <span className="flex items-center gap-1">
                <Navigation size={15} />
                {worker.distance} km
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="tracking-tight text-amber-400">★★★★★</span>
              <span className="font-semibold text-slate-700">
                {worker.rating.toFixed(1)}
              </span>
              <span className="font-medium text-slate-400">
                ({worker.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 text-left md:w-44 md:text-right">
          <p className="text-sm text-slate-400">Starting from</p>

          <div className="mt-1 flex items-end gap-1 md:justify-end">
            <p className="text-2xl font-bold text-emerald-700">
              LKR {formatPrice(worker.price)}
            </p>
            <p className="pb-1 text-sm text-slate-500">{worker.unit}</p>
          </div>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="h-10 rounded-lg border border-emerald-700 bg-white px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Chat first
            </button>

            <button
              type="button"
              onClick={() => navigate('/book/details')}
              className="h-10 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Book now
            </button>
          </div>
        </div>
      </div>

      {worker.pro && (
        <div className="flex items-center justify-between border-t border-amber-100 bg-amber-50 px-6 py-3 text-xs">
          <span className="font-bold uppercase tracking-wide text-orange-600">
            Pro Member
          </span>
          <span className="font-medium text-slate-400">
            Top 5% SkilledLK Experts
          </span>
        </div>
      )}
    </article>
  );
}

export default function SearchPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  const updateServiceSearch = (value) => {
    const matchingCategory = categoryOptions.find(
      (category) => category.toLowerCase() === value.trim().toLowerCase()
    );

    setFilters((prev) => ({
      ...prev,
      serviceQuery: value,
      category: matchingCategory || '',
    }));

    setCurrentPage(1);
  };

  const clearServiceSearch = () => {
    setFilters((prev) => ({
      ...prev,
      serviceQuery: '',
      category: '',
    }));

    setCurrentPage(1);
  };

  const selectCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category,
      serviceQuery: category,
    }));

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const filteredWorkers = useMemo(() => {
    let result = [...workers];

    const serviceQuery = filters.serviceQuery.trim().toLowerCase();
    const locationQuery = filters.locationQuery.trim().toLowerCase();

    if (serviceQuery) {
      result = result.filter((worker) => {
        return (
          worker.role.toLowerCase().includes(serviceQuery) ||
          worker.category.toLowerCase().includes(serviceQuery) ||
          worker.name.toLowerCase().includes(serviceQuery)
        );
      });
    }

    if (locationQuery) {
      result = result.filter((worker) =>
        worker.location.toLowerCase().includes(locationQuery)
      );
    }

    if (filters.category) {
      result = result.filter((worker) => worker.category === filters.category);
    }

    if (filters.under5000 || filters.between5000And15000) {
      result = result.filter((worker) => {
        const under = filters.under5000 && worker.price < 5000;
        const between =
          filters.between5000And15000 &&
          worker.price >= 5000 &&
          worker.price <= 15000;

        return under || between;
      });
    }

    if (filters.rating4Plus) {
      result = result.filter((worker) => worker.rating >= 4);
    }

    if (filters.verifiedOnly) {
      result = result.filter((worker) => worker.verified);
    }

    if (filters.distance !== 'any') {
      result = result.filter(
        (worker) => worker.distance <= Number(filters.distance)
      );
    }

    switch (filters.sortBy) {
      case 'Highest Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;

      case 'Lowest Price':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'Highest Price':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'Most Experienced':
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;

      case 'Recommended':
      default:
        result.sort((a, b) => {
          if (a.pro !== b.pro) return Number(b.pro) - Number(a.pro);
          if (a.featured !== b.featured) {
            return Number(b.featured) - Number(a.featured);
          }
          return b.rating - a.rating;
        });
        break;
    }

    return result;
  }, [filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWorkers.length / itemsPerPage)
  );

  const visibleWorkers = filteredWorkers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeChips = [
    filters.serviceQuery.trim() && {
      key: 'serviceQuery',
      label: filters.serviceQuery,
      remove: clearServiceSearch,
    },

    filters.locationQuery.trim() && {
      key: 'locationQuery',
      label: filters.locationQuery,
      remove: () => updateFilter('locationQuery', ''),
    },

    filters.under5000 && {
      key: 'under5000',
      label: 'Under LKR 5,000',
      remove: () => updateFilter('under5000', false),
    },

    filters.between5000And15000 && {
      key: 'between5000And15000',
      label: 'LKR 5,000 - 15,000',
      remove: () => updateFilter('between5000And15000', false),
    },

    filters.rating4Plus && {
      key: 'rating4Plus',
      label: '4++ Rating',
      remove: () => updateFilter('rating4Plus', false),
    },

    filters.verifiedOnly && {
      key: 'verifiedOnly',
      label: 'Verified only',
      remove: () => updateFilter('verifiedOnly', false),
    },

    filters.distance !== initialFilters.distance && {
      key: 'distance',
      label:
        distanceOptions.find((option) => option.value === filters.distance)
          ?.label || 'Distance',
      remove: () => updateFilter('distance', initialFilters.distance),
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <CustomerNavbar
        activePage="search"
        showSearchBar
        serviceValue={filters.serviceQuery}
        locationValue={filters.locationQuery}
        onServiceChange={updateServiceSearch}
        onLocationChange={(value) => updateFilter('locationQuery', value)}
      />

      <main className="flex min-h-[calc(100vh-80px)]">
        <FilterPanel
          filters={filters}
          updateFilter={updateFilter}
          selectCategory={selectCategory}
          clearFilters={clearFilters}
        />

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[60] bg-black/40 lg:hidden">
            <div className="h-full max-w-sm bg-white shadow-xl">
              <FilterPanel
                mobile
                filters={filters}
                updateFilter={updateFilter}
                selectCategory={selectCategory}
                clearFilters={clearFilters}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-8 xl:px-10">
          {/* Breadcrumb */}
          <div className="hidden items-center gap-2 text-sm font-medium text-slate-400 sm:flex">
            <span>Home</span>
            <span>›</span>
            <span className={!filters.category ? 'font-bold text-emerald-700' : ''}>
              Search
            </span>

            {filters.category && (
              <>
                <span>›</span>
                <span className="font-bold text-emerald-700">
                  {filters.category}
                </span>
              </>
            )}
          </div>

          {/* Heading */}
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[32px]">
                Showing {filteredWorkers.length}{' '}
                {filters.category || 'Professionals'}
                {filters.locationQuery ? ` in ${filters.locationQuery}` : ''}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 lg:hidden"
              >
                <Filter size={18} />
                Filters
              </button>

              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="h-11 appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      Sort by: {option}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          {activeChips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  label={chip.label}
                  onRemove={chip.remove}
                />
              ))}
            </div>
          )}

          {/* Result Cards */}
          <div className="mt-8 space-y-6">
            {visibleWorkers.length > 0 ? (
              visibleWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                <h3 className="text-xl font-bold text-slate-950">
                  No professionals found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search, filters, category, or distance.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredWorkers.length > itemsPerPage && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-lg text-sm font-bold transition ${
                      currentPage === page
                        ? 'bg-emerald-700 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}