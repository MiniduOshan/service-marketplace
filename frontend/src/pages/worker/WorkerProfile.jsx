import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Globe2,
  HelpCircle,
  ImagePlus,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

const initialServices = [
  {
    id: 1,
    title: 'Interior Painting',
    rating: '4.9',
    reviews: 42,
    price: 'LKR 4,500',
    unit: '/ hour',
    active: true,
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 2,
    title: 'Leak Repair',
    rating: '5.0',
    reviews: 18,
    price: 'LKR 3,800',
    unit: '/ task',
    active: true,
    image:
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=80',
  },
];

const initialPortfolio = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?auto=format&fit=crop&w=700&q=80',
  },
];

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-74px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-14 rounded-full transition ${
        checked ? 'bg-emerald-700' : 'bg-slate-300'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'left-8' : 'left-1'
        }`}
      />
    </button>
  );
}

function StatBox({ label, value, icon: Icon, iconClassName }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-4">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
      </div>

      <div className={`grid h-9 w-9 place-items-center rounded-full ${iconClassName}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}

function SettingsRow({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-slate-200 px-5 py-5 text-left last:border-b-0 transition hover:bg-slate-50"
    >
      <span className="flex items-center gap-3 font-medium text-slate-700">
        <Icon size={19} className="text-slate-500" />
        {label}
      </span>

      <ChevronRight size={18} className="text-slate-500" />
    </button>
  );
}

function ProfileCompleteness({ onManage }) {
  return (
    <section className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-slate-950">
            Profile Completeness
          </h2>

          <div className="mt-4 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-[85%] rounded-full bg-emerald-700" />
            </div>

            <span className="text-lg font-bold text-emerald-700">85%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onManage}
          className="shrink-0 text-sm font-bold text-emerald-700 hover:underline"
        >
          Manage All
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CheckCircle2 size={18} className="fill-emerald-500 text-white" />
          Identity Verified
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CheckCircle2 size={18} className="fill-emerald-500 text-white" />
          Phone Linked
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <span className="h-[18px] w-[18px] rounded-full border-2 border-slate-300" />
          Certificates
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, onToggle }) {
  return (
    <article className="overflow-hidden rounded-xl border border-emerald-900/20 bg-white shadow-sm">
      <div className="relative h-32 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute right-3 top-3">
          <Toggle checked={service.active} onChange={onToggle} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-slate-950">{service.title}</h3>

        <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
          <Star size={15} className="fill-emerald-600 text-emerald-600" />
          {service.rating} ({service.reviews} reviews)
        </p>

        <p className="mt-2 text-sm font-bold text-emerald-700">
          {service.price}{' '}
          <span className="font-medium text-slate-500">{service.unit}</span>
        </p>
      </div>
    </article>
  );
}

function PortfolioCard({ item, onRemove }) {
  return (
    <div className="group relative h-40 overflow-hidden rounded-lg bg-slate-200">
      <img
        src={item.image}
        alt="Portfolio"
        className="h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 opacity-0 shadow transition group-hover:opacity-100"
        aria-label="Remove portfolio image"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function ReviewCard() {
   const navigate = useNavigate();
  return (
    <section className="overflow-hidden rounded-xl border border-emerald-900/20 bg-white shadow-sm">
      <div className="grid gap-6 p-6 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div>
          <p className="text-5xl font-bold text-slate-950">5.0</p>

          <div className="mt-2 flex text-emerald-600">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={17} className="fill-emerald-600" />
            ))}
          </div>

          <p className="mt-1 text-sm text-slate-500">60 Reviews</p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3].map((rating, index) => (
            <div key={rating} className="flex items-center gap-4">
              <span className="w-4 text-sm text-slate-500">{rating}</span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: index === 0 ? '95%' : index === 1 ? '8%' : '0%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 p-6">
        <div className="flex gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-slate-500">
            AM
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-slate-950">Amara M.</p>
              <span className="text-xs text-slate-400">• 2 days ago</span>
            </div>

            <div className="mt-1 flex text-emerald-600">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={14} className="fill-emerald-600" />
              ))}
            </div>

            <p className="mt-2 leading-relaxed text-slate-600">
              “Kasun did an amazing job with our kitchen leak. He was
              professional, on time, and left the place spotless. Highly
              recommended!”
            </p>
          </div>
        </div>
      </div>

      <button
      type="button"
      onClick={() => navigate('/worker/reviews')}
      className="w-full bg-blue-50 px-5 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
      >
      View All Reviews
      </button>
    </section>
  );
}

function NotificationPreferencesModal({ onClose }) {
  const [booking, setBooking] = useState(true);
  const [messages, setMessages] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <Modal title="Notification Preferences" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
          <div>
            <h3 className="font-bold text-slate-950">Booking updates</h3>
            <p className="text-sm text-slate-500">
              Receive updates about booking requests and confirmations.
            </p>
          </div>
          <Toggle checked={booking} onChange={setBooking} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
          <div>
            <h3 className="font-bold text-slate-950">Messages</h3>
            <p className="text-sm text-slate-500">
              Receive notifications when customers send messages.
            </p>
          </div>
          <Toggle checked={messages} onChange={setMessages} />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
          <div>
            <h3 className="font-bold text-slate-950">Promotions</h3>
            <p className="text-sm text-slate-500">
              Receive platform offers and visibility boost tips.
            </p>
          </div>
          <Toggle checked={marketing} onChange={setMarketing} />
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-lg bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800"
      >
        Save Preferences
      </button>
    </Modal>
  );
}

function PaymentDetailsModal({ onClose, onManageAccount }) {
  return (
    <Modal title="Payment Details" onClose={onClose}>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm text-slate-500">Primary bank account</p>
        <h3 className="mt-1 font-bold text-slate-950">
          Commercial Bank of Ceylon
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Savings Account •••• 8902
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onManageAccount}
          className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
        >
          Manage Account
        </button>

        <button
          type="button"
          onClick={onManageAccount}
          className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
        >
          Add New Account
        </button>
      </div>
    </Modal>
  );
}

function LanguageModal({ onClose }) {
  const [language, setLanguage] = useState('English');

  return (
    <Modal title="Language" onClose={onClose}>
      <div className="grid gap-3">
        {['English', 'සිංහල', 'தமிழ்'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            className={`rounded-lg border px-5 py-4 text-left font-bold transition ${
              language === item
                ? 'border-emerald-700 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-lg bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800"
      >
        Apply Language
      </button>
    </Modal>
  );
}

function HelpCenterModal({ onClose }) {
  return (
    <Modal title="Help Center" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-bold text-slate-950">Contact Support</h3>
          <p className="mt-1 text-sm text-slate-500">
            Our team is available 24/7 for worker account support.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-bold text-slate-950">Worker Guide</h3>
          <p className="mt-1 text-sm text-slate-500">
            Learn how to improve your profile, respond to jobs, and increase
            bookings.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-bold text-slate-950">Verification Help</h3>
          <p className="mt-1 text-sm text-slate-500">
            Get help with document review and profile approval.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function AnalyticsModal({ onClose }) {
  return (
    <Modal title="Visibility Analytics" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-5 text-center">
          <p className="text-3xl font-bold text-emerald-700">422</p>
          <p className="mt-1 text-sm text-slate-500">Profile Views</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">38</p>
          <p className="mt-1 text-sm text-slate-500">New Leads</p>
        </div>

        <div className="rounded-xl bg-amber-50 p-5 text-center">
          <p className="text-3xl font-bold text-amber-600">12%</p>
          <p className="mt-1 text-sm text-slate-500">Conversion</p>
        </div>
      </div>

      <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Your profile visibility is 40% higher this month because of your worker
        badge.
      </p>
    </Modal>
  );
}

export default function WorkerProfile() {
  const navigate = useNavigate();

  const [services, setServices] = useState(initialServices);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [modal, setModal] = useState(null);

  function toggleService(id) {
    setServices((current) =>
      current.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  }

  function addPortfolio() {
    const newImages = [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80',
    ];

    setPortfolio((current) => [
      ...current,
      {
        id: Date.now(),
        image: newImages[current.length % newImages.length],
      },
    ]);
  }

  function removePortfolio(id) {
    setPortfolio((current) => current.filter((item) => item.id !== id));
  }

  function goToEditProfile(step = 2) {
    navigate(`/worker/register?mode=edit&step=${step}`);
  }

  function goToEarnings() {
    setModal(null);
    navigate('/worker/earnings');
  }

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1560px]">
        <section className="overflow-hidden rounded-t-xl bg-white">
          <div className="relative h-56 overflow-hidden lg:h-64">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
              alt="Cover"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => alert('Cover photo upload opened.')}
              className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-bold text-emerald-700 shadow transition hover:bg-white"
            >
              <Camera size={17} />
              Change Cover
            </button>
          </div>

          <div className="relative px-6 pb-8 lg:px-8">
            <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/160?img=12"
                  alt="Kasun Silva"
                  className="h-32 w-32 rounded-xl border-4 border-white object-cover shadow-xl"
                />

                <button
                  type="button"
                  onClick={() => alert('Profile photo upload opened.')}
                  className="absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-emerald-700 text-white shadow-lg hover:bg-emerald-800"
                  aria-label="Change profile photo"
                >
                  <Camera size={17} />
                </button>
              </div>

              <div className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold text-white drop-shadow sm:text-slate-950 sm:drop-shadow-none">
                    Kasun Silva
                  </h1>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase text-white">
                    <ShieldCheck size={13} />
                    Verified Professional
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-white drop-shadow sm:text-slate-600 sm:drop-shadow-none">
                  Licensed General Contractor • Colombo, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-slate-950">Performance</h2>

              <div className="mt-5 space-y-4">
                <StatBox
                  label="Total Earnings"
                  value="LKR 45.2k"
                  icon={CircleDollarSign}
                  iconClassName="bg-emerald-50 text-emerald-700"
                />

                <StatBox
                  label="Jobs Done"
                  value="128"
                  icon={CheckCircle2}
                  iconClassName="bg-blue-50 text-blue-600"
                />

                <StatBox
                  label="Profile Views"
                  value="422"
                  icon={Eye}
                  iconClassName="bg-purple-50 text-purple-600"
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-emerald-900/20 bg-white shadow-sm">
              <div className="px-5 py-5">
                <h2 className="font-bold text-slate-950">Account Settings</h2>
              </div>

              <SettingsRow
                icon={Bell}
                label="Notification Preferences"
                onClick={() => setModal('notifications')}
              />

              <SettingsRow
                icon={CircleDollarSign}
                label="Payment Details"
                onClick={() => setModal('payment')}
              />

              <SettingsRow
                icon={Globe2}
                label="Language"
                onClick={() => setModal('language')}
              />

              <SettingsRow
                icon={HelpCircle}
                label="Help Center"
                onClick={() => setModal('help')}
              />
            </section>

            <section
              className="overflow-hidden rounded-xl p-6 text-white shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, #047857 0%, #047857 60%, #065f46 100%)',
              }}
            >
              <h2 className="text-xl font-bold">Visibility Boost</h2>

              <p className="mt-3 text-sm leading-relaxed text-emerald-50">
                Increase your profile visibility by 40% with our Premium Worker
                badge.
              </p>

              <button
                type="button"
                onClick={() => setModal('analytics')}
                className="mt-6 w-full rounded-lg bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                See Analytics
              </button>
            </section>
          </aside>

          <main className="space-y-8">
            <ProfileCompleteness onManage={() => goToEditProfile(2)} />

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-950">
                  Your Active Services
                </h2>

                <button
                  type="button"
                  onClick={() => goToEditProfile(4)}
                  className="text-sm font-bold text-emerald-700 hover:underline"
                >
                  Manage All
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onToggle={() => toggleService(service.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-950">Portfolio</h2>

                <button
                  type="button"
                  onClick={addPortfolio}
                  className="text-sm font-bold text-emerald-700 hover:underline"
                >
                  Edit Gallery
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                {portfolio.map((item) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    onRemove={() => removePortfolio(item.id)}
                  />
                ))}

                <button
                  type="button"
                  onClick={addPortfolio}
                  className="grid h-40 place-items-center rounded-lg border-2 border-dashed border-slate-400 bg-white text-slate-500 transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <div className="text-center">
                    <ImagePlus className="mx-auto" size={30} />
                    <p className="mt-2 text-xs font-bold uppercase">Add New</p>
                  </div>
                </button>
              </div>
            </section>

            <ReviewCard />
          </main>
        </div>
      </div>

      {modal === 'notifications' && (
        <NotificationPreferencesModal onClose={() => setModal(null)} />
      )}

      {modal === 'payment' && (
        <PaymentDetailsModal
          onClose={() => setModal(null)}
          onManageAccount={goToEarnings}
        />
      )}

      {modal === 'language' && <LanguageModal onClose={() => setModal(null)} />}

      {modal === 'help' && <HelpCenterModal onClose={() => setModal(null)} />}

      {modal === 'analytics' && (
        <AnalyticsModal onClose={() => setModal(null)} />
      )}
    </WorkerLayout>
  );
}