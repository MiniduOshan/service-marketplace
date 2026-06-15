import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { apiRequest, getStoredSessionUser } from '../../lib/api';
import useLanguage from '../../hooks/useLanguage';

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
  categoriesList = [],
  mobile = false,
  onClose,
}) {
  const { t } = useLanguage();

  const distanceOptions = [
    { label: t.within_5km, value: '5' },
    { label: t.within_10km, value: '10' },
    { label: t.within_20km, value: '20' },
    { label: t.any_distance, value: 'any' },
  ];

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
            {t.filters}
          </h2>
          <p className="mt-1 text-sm text-slate-500 lg:text-xs">
            {t.refine_search}
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
            {t.price_range}
          </h3>

          <div className="space-y-3">
            <CheckboxRow
              label={t.under_5000}
              checked={filters.under5000}
              onChange={() => updateFilter('under5000', !filters.under5000)}
            />

            <CheckboxRow
              label={t.between_5000_15000}
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
            {t.ratings}
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
            {t.distance}
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
            {t.verified_status}
          </h3>

          <CheckboxRow
            label={t.verified_only}
            checked={filters.verifiedOnly}
            onChange={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
          />
        </div>

        <div>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <SlidersHorizontal size={15} />
            {t.categories}
          </h3>

          <div className="space-y-2">
            {categoriesList.map((category) => {
              const categoryName = category.name || category;
              const isSelected =
                filters.category.toLowerCase() === categoryName.toLowerCase() ||
                filters.serviceQuery.trim().toLowerCase() ===
                  categoryName.toLowerCase();

              return (
                <button
                  key={category.id || categoryName}
                  type="button"
                  onClick={() => selectCategory(categoryName)}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition ${
                    isSelected
                      ? 'bg-emerald-50 font-semibold text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {categoryName}
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
          {t.clear_all_filters}
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
  const { t } = useLanguage();

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        worker.pro ? 'border-emerald-200' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div
            onClick={() => navigate(`/worker/${worker.id}`)}
            className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl font-bold cursor-pointer hover:opacity-90 transition ${worker.avatar_url ? '' : worker.avatarClass}`}
          >
            {worker.avatar_url ? (
              <img
                src={worker.avatar_url}
                alt={worker.name}
                className="h-full w-full object-cover"
              />
            ) : (
              worker.avatar
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 
                onClick={() => navigate(`/worker/${worker.id}`)}
                className="text-xl font-bold text-slate-950 cursor-pointer hover:text-emerald-750 transition"
              >
                {worker.name}
              </h3>

              {worker.verified ? (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <BadgeCheck size={12} />
                  {t.verified}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">
                  {t.unverified}
                </span>
              )}

              {worker.featured && (
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                  {t.featured}
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
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    fill={index < Math.round(worker.rating) ? "currentColor" : "none"}
                    className={index < Math.round(worker.rating) ? "text-amber-400" : "text-slate-300"}
                  />
                ))}
              </div>
              <span className="font-semibold text-slate-700">
                {worker.rating.toFixed(1)}
              </span>
              <span className="font-medium text-slate-400">
                ({worker.reviews} {t.reviews_label})
              </span>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 text-left md:w-[220px] md:text-right">
          <p className="text-xs text-slate-400">{t.starting_from}</p>

          <div className="mt-1 flex items-end gap-1 md:justify-end">
            <p className="text-xl font-bold text-emerald-700">
              LKR {formatPrice(worker.price)}
            </p>
            <p className="pb-0.5 text-xs text-slate-500">{worker.unit}</p>
          </div>

          <div className="mt-4 flex gap-2 justify-start md:justify-end">
            <button
              type="button"
              onClick={() => navigate('/chat', {
                state: {
                  workerId: worker.id,
                  workerName: worker.name,
                }
              })}
              className="h-9 flex-1 min-w-[90px] rounded-lg border border-emerald-700 bg-white px-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {t.chat_first}
            </button>

            <button
              type="button"
              onClick={() => navigate('/book/details', {
                state: {
                  workerId: worker.id,
                  servicePackageId: worker.servicePackageId,
                  workerName: worker.name,
                  serviceTitle: worker.role,
                  priceLabel: `LKR ${worker.price.toLocaleString()} / task`,
                }
              })}
              className="h-9 flex-1 min-w-[90px] rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {t.book_now}
            </button>
          </div>
        </div>
      </div>

      {worker.pro && (
        <div className="flex items-center justify-between border-t border-amber-100 bg-amber-50 px-6 py-3 text-xs">
          <span className="font-bold uppercase tracking-wide text-orange-600">
            {t.pro_member}
          </span>
          <span className="font-medium text-slate-400">
            {t.top_experts}
          </span>
        </div>
      )}
    </article>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [filters, setFilters] = useState(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const distanceOptions = useMemo(() => [
    { label: t.within_5km, value: '5' },
    { label: t.within_10km, value: '10' },
    { label: t.within_20km, value: '20' },
    { label: t.any_distance, value: 'any' },
  ], [t]);

  const sortOptions = useMemo(() => [
    { label: t.recommended, value: 'Recommended' },
    { label: t.highest_rated, value: 'Highest Rated' },
    { label: t.lowest_price, value: 'Lowest Price' },
    { label: t.highest_price, value: 'Highest Price' },
    { label: t.most_experienced, value: 'Most Experienced' },
  ], [t]);

  const isLoggedIn = !!getStoredSessionUser();

  const [workersList, setWorkersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from database on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await apiRequest('/categories');
        const data = res.data || res || [];
        setCategoriesList(data);
      } catch (err) {
        setCategoriesList([
          { id: 1, name: 'Painting', slug: 'painting' },
          { id: 2, name: 'Electrical', slug: 'electrical' },
          { id: 3, name: 'Plumbing', slug: 'plumbing' },
          { id: 4, name: 'Carpentry', slug: 'carpentry' },
          { id: 5, name: 'AC Repair', slug: 'ac-repair' },
          { id: 6, name: 'Cleaning', slug: 'cleaning' },
          { id: 7, name: 'Masonry', slug: 'masonry' },
          { id: 8, name: 'Gardening', slug: 'gardening' },
          { id: 9, name: 'Appliance Repair', slug: 'appliance-repair' },
          { id: 10, name: 'Pest Control', slug: 'pest-control' },
          { id: 11, name: 'Auto Repair', slug: 'auto-repair' },
          { id: 12, name: 'Car Detailing', slug: 'car-detailing' },
          { id: 13, name: 'Tech Support', slug: 'tech-support' },
          { id: 14, name: 'Graphic Design', slug: 'graphic-design' },
          { id: 15, name: 'Photography', slug: 'photography' },
          { id: 16, name: 'Catering', slug: 'catering' },
          { id: 17, name: 'Personal Training', slug: 'personal-training' },
          { id: 18, name: 'Academic Tutoring', slug: 'academic-tutoring' },
          { id: 19, name: 'Moving & Packing', slug: 'moving-and-packing' },
          { id: 20, name: 'Translation', slug: 'translation' },
        ]);
      }
    }
    fetchCategories();
  }, []);

  // Parse URL search parameters on load/change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || '';
    const searchParam = params.get('search') || '';
    const locationParam = params.get('location') || '';

    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      serviceQuery: searchParam || categoryParam,
      locationQuery: locationParam,
    }));
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    async function loadWorkers() {
      try {
        setLoading(true);
        let catQuery = '';
        if (filters.category) {
          const matched = categoriesList.find(
            (c) => (c.name || c).toLowerCase() === filters.category.toLowerCase()
          );
          catQuery = matched ? matched.slug : filters.category.toLowerCase().replace(/\s+/g, '-');
        }

        let path = '/services';
        const params = [];
        if (catQuery) params.push(`category=${catQuery}`);
        if (filters.serviceQuery && (!filters.category || filters.serviceQuery.toLowerCase() !== filters.category.toLowerCase())) {
          params.push(`search=${filters.serviceQuery}`);
        }
        if (params.length > 0) path += `?${params.join('&')}`;

        const res = await apiRequest(path);
        const data = res.data?.data || res.data || [];

        const seenWorkers = new Set();
        const mappedWorkers = [];

        data.forEach((service) => {
          const workerId = service.worker?.id;
          if (workerId && seenWorkers.has(workerId)) {
            return;
          }
          if (workerId) {
            seenWorkers.add(workerId);
          }

          const workerName = service.worker?.name || 'Verified Pro';
          mappedWorkers.push({
            id: workerId || '1',
            servicePackageId: service.id,
            name: workerName,
             avatar: workerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            avatar_url: service.worker?.avatar_url || null,
            role: service.title || 'Service Pro',
            category: service.category?.name || 'All',
            location: 'Colombo',
            experience: '6 years exp.',
            experienceYears: 6,
            rating: service.worker?.average_rating !== null && service.worker?.average_rating !== undefined
              ? parseFloat(service.worker.average_rating)
              : 0.0,
            reviews: service.worker?.reviews_count !== null && service.worker?.reviews_count !== undefined
              ? parseInt(service.worker.reviews_count, 10)
              : 0,
            price: parseFloat(service.price) || 0,
            unit: '/ task',
            distance: 4,
            verified: service.worker?.verification === 'Verified',
            featured: service.is_active,
            pro: service.worker?.verification === 'Verified',
            avatarClass: 'bg-emerald-700 text-white',
          });
        });

        setWorkersList(mappedWorkers);
        setLoading(false);
      } catch (err) {
        setWorkersList(workers.map(w => ({ ...w, servicePackageId: w.id })));
        setLoading(false);
      }
    }

    loadWorkers();
  }, [filters.category, filters.serviceQuery, categoriesList]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  const updateServiceSearch = (value) => {
    const matchingCategory = categoriesList.find(
      (category) => (category.name || category).toLowerCase() === value.trim().toLowerCase()
    );

    setFilters((prev) => ({
      ...prev,
      serviceQuery: value,
      category: matchingCategory ? (matchingCategory.name || matchingCategory) : '',
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
    let result = [...workersList];

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
  }, [filters, workersList]);

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
      label: t.under_5000,
      remove: () => updateFilter('under5000', false),
    },

    filters.between5000And15000 && {
      key: 'between5000And15000',
      label: t.between_5000_15000,
      remove: () => updateFilter('between5000And15000', false),
    },

    filters.rating4Plus && {
      key: 'rating4Plus',
      label: '4++ ' + (t.ratings || 'Rating'),
      remove: () => updateFilter('rating4Plus', false),
    },

    filters.verifiedOnly && {
      key: 'verifiedOnly',
      label: t.verified_only,
      remove: () => updateFilter('verifiedOnly', false),
    },

    filters.distance !== initialFilters.distance && {
      key: 'distance',
      label:
        distanceOptions.find((option) => option.value === filters.distance)
          ?.label || t.distance,
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
        isLoggedIn={isLoggedIn}
      />

      <main className={`flex min-h-[calc(100vh-80px)] ${!isLoggedIn ? 'pt-16' : ''}`}>
        <FilterPanel
          filters={filters}
          updateFilter={updateFilter}
          selectCategory={selectCategory}
          clearFilters={clearFilters}
          categoriesList={categoriesList}
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
                categoriesList={categoriesList}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-8 xl:px-10">
          {/* Breadcrumb */}
          <div className="hidden items-center gap-2 text-sm font-medium text-slate-400 sm:flex">
            <span>{t.home}</span>
            <span>›</span>
            <span className={!filters.category ? 'font-bold text-emerald-700' : ''}>
              {t.search_nav}
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
                {t.showing} {filteredWorkers.length}{' '}
                {filters.category || t.professionals}
                {filters.locationQuery ? ` ${t.in} ${filters.locationQuery}` : ''}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 lg:hidden"
              >
                <Filter size={18} />
                {t.filters}
              </button>

              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="h-11 appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t.sort_by}: {option.label}
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
                  {t.no_professionals}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {t.no_professionals_sub}
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  {t.clear_all_filters}
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

      {isLoggedIn ? <CustomerFooter /> : <Footer />}
    </div>
  );
}