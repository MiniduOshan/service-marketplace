import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  CircleDollarSign,
  Info,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';
import { apiRequest, getStoredSessionUser, getStoredSessionToken, storeSession } from '../../lib/api';

const getRenewalDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const proBenefits = [
  'Unlimited skill badge certifications',
  '0% Commission on first 5 monthly jobs',
  'Priority support via dedicated WhatsApp',
  'Advanced analytics for profile views',
  'Instant SMS alerts for new lead invites',
  'Verification badge next to name',
];

const freeComparison = [
  {
    feature: 'Lead Fees',
    free: 'LKR 150 per lead',
    pro: 'LKR 150 per lead',
    proSub: 'Pay per lead applied',
    premium: 'LKR 150 per lead',
    premiumSub: 'Pay per lead applied',
  },
  {
    feature: 'Search Visibility',
    free: 'Standard listing',
    pro: 'Priority Ranking',
    proSub: 'Top of search results',
    premium: 'Top Boost',
    premiumSub: 'Featured top rank visibility',
  },
  {
    feature: 'Profile Badge',
    free: 'No special badge',
    pro: "'Featured' Badge",
    proSub: 'Build instant trust',
    premium: "'Elite' Badge",
    premiumSub: 'Premium verification badge',
  },
  {
    feature: 'Monthly Bookings',
    free: 'Limited to 3/mo',
    pro: 'Unlimited',
    proSub: 'Unlimited bookings & leads',
    premium: 'Unlimited + priority support',
    premiumSub: 'Dedicated help desk support',
  },
];

const featureRows = [
  { feature: 'Lead Invitations', free: '5 / Month', pro: 'Unlimited', premium: 'Unlimited + Early Access' },
  { feature: 'Commission Rate', free: '10%', pro: '5% Fixed', premium: '0% First 5 Jobs, then 3%' },
  { feature: 'Skill Badges', free: 'Max 2', pro: 'Unlimited', premium: 'Unlimited' },
  { feature: 'Profile Analytics', free: 'Basic', pro: 'Advanced', premium: 'Custom Reporting' },
  { feature: 'Lead Fees', free: 'Pay-per-lead', pro: 'Pay-per-lead', premium: 'Pay-per-lead' },
];

function ScoreRow({ label, points }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-emerald-700">{points}</span>
    </div>
  );
}

function PriorityScoreCard({ plan }) {
  const ispremium = plan === 'premium';
  const isPro = plan === 'pro';
  const score = ispremium ? 98 : isPro ? 87 : 62;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-center text-2xl font-bold text-slate-950">
        Priority Score
      </h2>

      <div
        className="mx-auto mt-7 grid h-32 w-32 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#047857 ${score}%, #f1f5f9 ${score}% 100%)`,
        }}
      >
        <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-white">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-950">{score}%</p>
            <p className="text-xs font-medium text-slate-500">Priority</p>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {ispremium ? (
          <>
            <ScoreRow label="premium Subscription" points="+35" />
            <ScoreRow label="Response Rate" points="+20" />
            <ScoreRow label="Rating Average" points="+22" />
            <ScoreRow label="Featured Worker Bonus" points="+21" />

            <p className="pt-2 text-xs leading-relaxed text-slate-500">
              Top Tier visibility. Direct early access invitations and peak ranking visibility across search results.
            </p>
          </>
        ) : isPro ? (
          <>
            <ScoreRow label="Pro Subscription" points="+25" />
            <ScoreRow label="Response Rate" points="+20" />
            <ScoreRow label="Rating Average" points="+22" />

            <p className="pt-2 text-xs leading-relaxed text-slate-500">
              Top 5% of workers in your category. Increased visibility for
              high-budget jobs.
            </p>
          </>
        ) : (
          <>
            <ScoreRow label="Profile Activity" points="+20" />
            <ScoreRow label="Response Rate" points="+20" />
            <ScoreRow label="Rating Average" points="+22" />

            <p className="pt-2 text-xs leading-relaxed text-slate-500">
              Get <span className="font-bold">+25 points instantly</span> by
              upgrading to Pro and boost your visibility by 3x.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function PaidPlanHero({ title, onManageBilling, onCancelPlan, onUpgradepremium, premiumPrice, formattedPrice }) {
  const isPro = title?.toLowerCase() === 'pro';

  return (
    <div
      className="rounded-xl p-6 text-white shadow-xl sm:p-7"
      style={{
        background:
          'linear-gradient(135deg, #047857 0%, #047857 45%, #0f766e 100%)',
      }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {title} Plan — Active
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            {formattedPrice}/month
          </h2>

          <p className="mt-2 flex items-center gap-2 text-sm text-emerald-50">
            <CircleDollarSign size={16} />
            Next renewal: {getRenewalDate()}
          </p>
        </div>

        <div className="rounded-lg border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-200 text-emerald-700">
              <TrendingUp size={22} />
            </div>

            <div>
              <p className="text-sm font-medium uppercase text-emerald-50">
                Profile Boost
              </p>
              <p className="text-2xl font-bold leading-tight">
                {title?.toLowerCase() === 'premium' ? '+50 points' : '+25 points'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={onManageBilling}
          className="rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
        >
          Manage Billing
        </button>

        {isPro && (
          <button
            type="button"
            onClick={onUpgradepremium}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 px-7 py-3.5 text-sm font-bold text-slate-950 transition shadow-md whitespace-nowrap"
          >
            <Sparkles size={16} className="text-slate-950" />
            Upgrade to premium
            {premiumPrice && <span className="text-[10px] font-semibold opacity-90 ml-1">({premiumPrice}/mo)</span>}
          </button>
        )}

        <button
          type="button"
          onClick={onCancelPlan}
          className="rounded-lg px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Cancel plan
        </button>
      </div>
    </div>
  );
}

function FreePlanHero({ onUpgradePro, onUpgradepremium, proPrice, premiumPrice }) {
  return (
    <div
      className="rounded-xl p-6 text-white shadow-xl sm:p-7"
      style={{
        background:
          'linear-gradient(135deg, #047857 0%, #047857 45%, #0f766e 100%)',
      }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Free Plan — Active
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight">
            LKR 0/month
          </h2>

          <p className="mt-8 max-w-2xl leading-relaxed text-emerald-50">
            You are currently using the limited free tier. Your visibility is
            limited, and lead fees apply to all client bookings.
          </p>

          <p className="mt-5 flex items-center gap-2 text-sm text-emerald-100">
            <Info size={15} />
            LKR 150 per lead fee applies
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 lg:self-center shrink-0">
          <button
            type="button"
            onClick={onUpgradePro}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/20 active:scale-[0.98] whitespace-nowrap min-w-[200px]"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              Upgrade to PRO
            </div>
            {proPrice && <span className="text-xs font-normal opacity-85">({proPrice}/mo)</span>}
          </button>

          <button
            type="button"
            onClick={onUpgradepremium}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-transparent bg-amber-500 hover:bg-amber-600 px-6 py-4 text-sm font-bold text-slate-950 transition active:scale-[0.98] shadow-lg whitespace-nowrap min-w-[200px]"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-slate-950" />
              Upgrade to premium
            </div>
            {premiumPrice && <span className="text-xs font-normal text-slate-900 opacity-90">({premiumPrice}/mo)</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProBenefitsGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">
        What Pro gives you
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {proBenefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-center gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <CheckCircle2
              size={23}
              className="shrink-0 fill-emerald-700 text-white"
            />

            <p className="leading-relaxed text-slate-700">{benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FreePlanComparison() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">Plan Comparison</h2>

      <div className="mt-6 overflow-hidden rounded-lg border border-emerald-900/20 bg-white shadow-sm">
        <div className="grid grid-cols-3 border-b border-emerald-900/20">
          <div className="border-r border-emerald-900/20 px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
            Free Tier
          </div>

          <div className="border-r border-emerald-900/20 px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-emerald-700">
            Pro Tier
          </div>

          <div className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest text-amber-600">
            premium Tier
          </div>
        </div>

        {freeComparison.map((row) => (
          <div
            key={row.feature}
            className="grid grid-cols-3 border-b border-emerald-900/20 last:border-b-0"
          >
            <div className="border-r border-emerald-900/20 px-6 py-6">
              <p className="font-bold text-slate-950">{row.feature}</p>
              <p className="mt-1 text-sm text-slate-500">{row.free}</p>
            </div>

            <div className="border-r border-emerald-900/20 px-6 py-6">
              <p className="font-bold text-emerald-700">{row.pro}</p>
              <p className="mt-1 text-sm text-slate-500">{row.proSub}</p>
            </div>

            <div className="px-6 py-6">
              <p className="font-bold text-amber-600">{row.premium}</p>
              <p className="mt-1 text-sm text-slate-500">{row.premiumSub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureTable({ plan }) {
  const isFree = plan?.toLowerCase() === 'free';
  const isPro = plan?.toLowerCase() === 'pro';
  const ispremium = plan?.toLowerCase() === 'premium';

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-4 border-b border-slate-200">
        <div className="px-6 py-6 text-2xl font-bold text-slate-950 flex items-center">
          Features
        </div>

        <div
          className={`relative px-4 py-6 text-center text-lg font-bold flex flex-col justify-center items-center gap-1.5 ${
            isFree ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500'
          }`}
        >
          FREE
          {isFree && (
            <span className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider">
              Active
            </span>
          )}
        </div>

        <div
          className={`relative px-4 py-6 text-center text-lg font-bold flex flex-col justify-center items-center gap-1.5 ${
            isPro ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500'
          }`}
        >
          PRO
          {isPro && (
            <span className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider">
              Active
            </span>
          )}
        </div>

        <div
          className={`relative px-4 py-6 text-center text-lg font-bold flex flex-col justify-center items-center gap-1.5 ${
            ispremium ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500'
          }`}
        >
          premium
          {ispremium && (
            <span className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase text-white tracking-wider">
              Active
            </span>
          )}
        </div>
      </div>

      {featureRows.map((row) => (
        <div
          key={row.feature}
          className="grid grid-cols-4 border-b border-slate-100 last:border-b-0"
        >
          <div className="px-6 py-6 font-medium text-slate-700 text-sm flex items-center">
            {row.feature}
          </div>

          <div
            className={`px-4 py-6 text-center font-bold text-sm flex items-center justify-center ${
              isFree ? 'bg-emerald-50/30 text-slate-950 font-bold' : 'text-slate-500'
            }`}
          >
            {row.free}
          </div>

          <div
            className={`px-4 py-6 text-center font-bold text-sm flex items-center justify-center ${
              isPro ? 'bg-emerald-50/30 text-slate-950 font-bold' : 'text-slate-700'
            }`}
          >
            {row.pro}
          </div>

          <div
            className={`px-4 py-6 text-center font-bold text-sm flex items-center justify-center ${
              ispremium ? 'bg-emerald-50/30 text-slate-950 font-bold' : 'text-slate-700'
            }`}
          >
            {row.premium}
          </div>
        </div>
      ))}
    </section>
  );
}

function LeadFeeModelCard({ plan }) {
  const isPaid = plan === 'pro' || plan === 'premium';
  const enabled = !isPaid;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-bold text-slate-950">Lead Fee Model</h2>

        <button
          type="button"
          disabled
          className={`relative h-7 w-14 cursor-not-allowed rounded-full transition ${
            enabled ? 'bg-emerald-700' : 'bg-slate-300'
          }`}
          aria-label="Lead fee model status"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              enabled ? 'left-8' : 'left-1'
            }`}
          />
        </button>
      </div>

      <p className="mt-5 text-sm font-medium leading-relaxed text-slate-600">
        {isPaid ? (
          <>
            Pay-per-lead option is currently{' '}
            <span className="font-bold text-slate-800">Inactive</span> because
            you are a Premium Member. You get all lead invitations for free.
          </>
        ) : (
          <>
            Pay-per-lead option is currently{' '}
            <span className="font-bold text-slate-800">Active</span> because
            you are using the Free Plan. Lead fees apply when customer inquiries
            are received.
          </>
        )}
      </p>
    </div>
  );
}

function BillingModal({ planTitle, onClose, onCancelPlan, formattedPrice }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-950">Manage Billing</h2>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Current card</p>
          <p className="mt-1 font-bold text-slate-950">Visa ending in ****</p>
          <p className="mt-1 text-sm text-slate-500">
            Next charge: {formattedPrice} on {getRenewalDate()}
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            className="rounded-lg border border-emerald-700 px-5 py-3 font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Update Payment Method
          </button>

          <button
            type="button"
            onClick={onCancelPlan}
            className="rounded-lg border border-red-200 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50"
          >
            Cancel {planTitle || 'Pro'} Plan
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-slate-100 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function CancelPlanModal({ planTitle, onClose, onConfirm }) {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (inputValue === 'CANCEL') {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-950">Cancel {planTitle || 'Pro'} Subscription?</h2>
        
        <p className="mt-3 text-sm text-slate-500 leading-normal">
          This will immediately revoke your profile priority rankings, featured badges, and restore pay-per-lead fees of LKR 150.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Type CANCEL to confirm
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="CANCEL"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-200 text-xs"
          >
            Keep {planTitle || 'Pro'} Plan
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={inputValue !== 'CANCEL'}
            className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-xs"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkerSubscription() {
  const [currentPlan, setCurrentPlan] = useState(() => {
    const user = getStoredSessionUser();
    return user?.pricing_plan ? user.pricing_plan.title : 'Free';
  });
  const [currentPlanPrice, setCurrentPlanPrice] = useState(() => {
    const user = getStoredSessionUser();
    return user?.pricing_plan ? Number(user.pricing_plan.price) : 0;
  });
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pricingPlan, setPricingPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const isPaid = currentPlan !== 'Free';

  const proPlan = allPlans.find((p) => p.title?.toLowerCase() === 'pro');
  const premiumPlan = allPlans.find((p) => p.title?.toLowerCase() === 'premium');

  const formattedPrice = isPaid 
    ? `LKR ${currentPlanPrice.toLocaleString()}`
    : pricingPlan 
      ? `LKR ${Number(pricingPlan.price).toLocaleString()}` 
      : 'LKR 0';

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, plansRes] = await Promise.all([
          apiRequest('/auth/me'),
          apiRequest('/pricing-plans'),
        ]);

        const user = userRes.data.user;
        storeSession(getStoredSessionToken(), user);
        setCurrentPlan(user?.pricing_plan ? user.pricing_plan.title : 'Free');
        setCurrentPlanPrice(user?.pricing_plan ? Number(user.pricing_plan.price) : 0);

        const plans = plansRes.data;
        setAllPlans(plans);
        const paidPlan = plans.find((p) => Number(p.price) > 0);
        if (paidPlan) {
          setPricingPlan(paidPlan);
        }
      } catch (err) {
        console.error('Failed to fetch subscription data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleUpgrade(plan) {
    if (!plan) return;
    try {
      const res = await apiRequest('/auth/user/pricing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing_plan_id: plan.id }),
      });
      const user = res.data.user;
      storeSession(getStoredSessionToken(), user);
      setCurrentPlan(user?.pricing_plan ? user.pricing_plan.title : plan.title);
      setCurrentPlanPrice(user?.pricing_plan ? Number(user.pricing_plan.price) : Number(plan.price));
    } catch (err) {
      if (err.status !== 401) {
        alert(err.message || 'Failed to upgrade subscription.');
      }
    }
  }

  function handleCancelTrigger() {
    setBillingModalOpen(false);
    setCancelModalOpen(true);
  }

  async function handleCancelConfirm() {
    try {
      const freePlan = allPlans.find((p) => Number(p.price) === 0);
      const res = await apiRequest('/auth/user/pricing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricing_plan_id: freePlan ? freePlan.id : null }),
      });
      const user = res.data.user;
      storeSession(getStoredSessionToken(), user);
      setCurrentPlan('Free');
      setCurrentPlanPrice(0);
      setCancelModalOpen(false);
    } catch (err) {
      if (err.status !== 401) {
        alert(err.message || 'Failed to cancel subscription.');
      }
    }
  }

  if (loading) {
    return (
      <WorkerLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
        </div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,760px)_320px] 2xl:grid-cols-[minmax(0,820px)_340px]">
          <main className="space-y-9">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Subscription & Plan
              </h1>
              <p className="mt-2 text-slate-500">
                Manage your professional presence and billing cycles.
              </p>
            </div>

            {isPaid ? (
              <PaidPlanHero
                title={currentPlan}
                onManageBilling={() => setBillingModalOpen(true)}
                onCancelPlan={handleCancelTrigger}
                onUpgradepremium={() => handleUpgrade(premiumPlan)}
                premiumPrice={premiumPlan ? `${Number(premiumPlan.price).toLocaleString()}` : ''}
                formattedPrice={formattedPrice}
              />
            ) : (
              <FreePlanHero
                onUpgradePro={() => handleUpgrade(proPlan)}
                onUpgradepremium={() => handleUpgrade(premiumPlan)}
                proPrice={proPlan ? `${Number(proPlan.price).toLocaleString()}` : ''}
                premiumPrice={premiumPlan ? `${Number(premiumPlan.price).toLocaleString()}` : ''}
              />
            )}

            {isPaid ? <ProBenefitsGrid /> : <FreePlanComparison />}

            <FeatureTable plan={currentPlan.toLowerCase()} />
          </main>

          <aside className="space-y-6">
            <PriorityScoreCard plan={currentPlan.toLowerCase()} />
            <LeadFeeModelCard plan={currentPlan.toLowerCase()} />
          </aside>
        </div>
      </div>

      {billingModalOpen && (
        <BillingModal
          planTitle={currentPlan}
          onClose={() => setBillingModalOpen(false)}
          onCancelPlan={handleCancelTrigger}
          formattedPrice={formattedPrice}
        />
      )}

      {cancelModalOpen && (
        <CancelPlanModal
          planTitle={currentPlan}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </WorkerLayout>
  );
}
