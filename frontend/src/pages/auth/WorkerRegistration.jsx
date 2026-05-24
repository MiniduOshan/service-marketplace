import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Camera,
  Check,
  ChevronDown,
  FileCheck2,
  ImagePlus,
  Info,
  LockKeyhole,
  MapPin,
  Navigation,
  Plus,
  ShieldCheck,
  Trash2,
  UploadCloud,
  User,
  X,
} from 'lucide-react';
import CustomerFooter from '../../components/layout/CustomerFooter';

const serviceCategories = [
  'Home Painting & Renovation',
  'Electrical Services',
  'Plumbing',
  'AC Repair',
  'Carpentry',
  'Cleaning',
  'Gardening',
];

const districts = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Galle',
  'Matara',
];

const initialSkills = ['Interior Painting', 'Exterior', 'Waterproofing'];
const initialZones = ['Colombo 01-15', 'Dehiwala', 'Nugegoda'];

function WorkerRegistrationHeader({ isEditMode }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1760px] items-center justify-between px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-20">
        <button
          type="button"
          onClick={() => navigate(isEditMode ? '/worker/profile' : '/')}
          className="text-2xl font-extrabold tracking-tight text-emerald-700"
        >
          SkilledLK
        </button>

        <div className="flex items-center gap-4">
          <p className="hidden text-sm font-semibold text-slate-500 sm:block">
            {isEditMode ? 'Edit Worker Profile' : 'Worker Registration'}
          </p>

          <div className="grid h-11 w-11 place-items-center rounded-full border-4 border-emerald-700 bg-emerald-50 text-emerald-700">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}

function ProgressHeader({ step, title, percent, isEditMode = false }) {
  return (
    <section className="mb-10">
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
            {isEditMode
              ? `Edit Profile · Section ${step - 1} of 3`
              : `Step ${step} of 4`}
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h1>
        </div>

        <p className="hidden text-sm font-medium text-slate-600 sm:block">
          {percent}% complete
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-emerald-700 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-right text-sm font-medium text-slate-600 sm:hidden">
        {percent}% complete
      </p>
    </section>
  );
}

function ActionBar({ onBack, onNext, nextLabel, submit = false }) {
  return (
    <div className="mt-9 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-white px-7 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        className="rounded-lg bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
      >
        {submit ? nextLabel : nextLabel}
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 ${className}`}
    />
  );
}

function TextArea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`min-h-32 w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 ${className}`}
    />
  );
}

function Select({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-12 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 ${className}`}
      >
        {children}
      </select>

      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
      {children}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-emerald-600 transition hover:text-red-600"
          aria-label="Remove"
        >
          <X size={14} />
        </button>
      )}
    </span>
  );
}

function StepTwo({ onBack, onNext, isEditMode }) {
  const [skills, setSkills] = useState(initialSkills);
  const [zones, setZones] = useState(initialZones);
  const [skillInput, setSkillInput] = useState('');
  const [zoneInput, setZoneInput] = useState('');

  function addSkill() {
    const cleanSkill = skillInput.trim();
    if (!cleanSkill) return;
    setSkills((current) => [...current, cleanSkill]);
    setSkillInput('');
  }

  function addZone() {
    const cleanZone = zoneInput.trim();
    if (!cleanZone) return;
    setZones((current) => [...current, cleanZone]);
    setZoneInput('');
  }

  return (
    <>
      <ProgressHeader
        step={2}
        title={isEditMode ? 'Edit Personal Details' : 'Personal Details'}
        percent={25}
        isEditMode={isEditMode}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="text-xl font-bold text-slate-950">
            Tell us about yourself
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This information will appear on your public profile.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field label="Full Name">
              <Input defaultValue="Kasun Silva" />
            </Field>

            <Field label="Phone Number">
              <div className="flex">
                <span className="grid h-12 place-items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-4 text-sm font-bold text-slate-600">
                  +94
                </span>
                <Input defaultValue="771234567" className="rounded-l-none" />
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Email Address Optional">
                <Input
                  type="email"
                  defaultValue="kasun.silva@example.com"
                />
              </Field>
            </div>

            <Field label="Service Category">
              <Select defaultValue="Home Painting & Renovation">
                {serviceCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </Select>
            </Field>

            <Field label="Years of Experience">
              <Input type="number" min="0" defaultValue="5" />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Bio / About">
                <TextArea
                  defaultValue={
                    isEditMode
                      ? 'Experienced home painting and renovation worker with reliable service quality and strong customer reviews.'
                      : ''
                  }
                  placeholder="Describe your expertise and what makes your service unique..."
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Skills / Specializations">
                <div className="flex gap-3">
                  <Input
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    placeholder="Add a skill"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
                    aria-label="Add skill"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      onRemove={() =>
                        setSkills((current) =>
                          current.filter((item) => item !== skill)
                        )
                      }
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="font-bold uppercase tracking-wide text-slate-600">
              Profile Photo
            </h2>

            <div className="mt-5 flex flex-col items-center text-center">
              <button
                type="button"
                className="grid h-36 w-36 place-items-center rounded-full border-2 border-dashed border-emerald-900/30 bg-emerald-50 text-emerald-700 transition hover:border-emerald-700"
              >
                <div>
                  <Camera className="mx-auto" size={32} />
                  <p className="mt-2 text-sm font-bold">Upload photo</p>
                </div>
              </button>

              <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">
                Please upload a clear, professional photo of yourself. Profile
                photos help build trust with customers.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-bold uppercase tracking-wide text-slate-600">
                Service Location
              </h2>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                Use my GPS
                <button
                  type="button"
                  className="relative h-6 w-12 rounded-full bg-emerald-700"
                  aria-label="GPS enabled"
                >
                  <span className="absolute left-7 top-1 h-4 w-4 rounded-full bg-white" />
                </button>
              </div>
            </div>

            <div className="mt-5">
              <Field label="District">
                <Select defaultValue="Colombo">
                  {districts.map((district) => (
                    <option key={district}>{district}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Service Zones">
                <div className="flex gap-3">
                  <Input
                    value={zoneInput}
                    onChange={(event) => setZoneInput(event.target.value)}
                    placeholder="Add zone"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addZone();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={addZone}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
                    aria-label="Add zone"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {zones.map((zone) => (
                    <Chip
                      key={zone}
                      onRemove={() =>
                        setZones((current) =>
                          current.filter((item) => item !== zone)
                        )
                      }
                    >
                      {zone}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mt-5 grid h-40 place-items-center rounded-xl border border-slate-200 bg-slate-100 text-center text-slate-500">
              <div>
                <MapPin className="mx-auto text-emerald-700" size={28} />
                <p className="mt-2 text-sm font-medium">Map preview</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ActionBar
        onBack={onBack}
        onNext={onNext}
        nextLabel={isEditMode ? 'Save & Continue' : 'Next: Documents'}
      />
    </>
  );
}

function UploadBox({ title, subtitle, uploaded = false, optional = false }) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        uploaded
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-dashed border-slate-300 bg-slate-50'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`grid h-12 w-12 place-items-center rounded-lg ${
              uploaded
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-emerald-700'
            }`}
          >
            {uploaded ? <FileCheck2 size={24} /> : <UploadCloud size={24} />}
          </div>

          <div>
            <h3 className="font-bold text-slate-950">
              {title}
              {optional && (
                <span className="ml-2 text-xs font-semibold text-slate-400">
                  Optional
                </span>
              )}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        {uploaded ? (
          <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white">
            <Check size={14} />
            Uploaded
          </span>
        ) : (
          <button
            type="button"
            className="rounded-lg border border-emerald-700 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

function StepThree({ onBack, onNext, isEditMode }) {
  return (
    <>
      <ProgressHeader
        step={3}
        title={isEditMode ? 'Edit Documents' : 'Upload your documents'}
        percent={50}
        isEditMode={isEditMode}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <div className="flex gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <AlertCircle size={22} className="mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold">
                {isEditMode ? 'Documents loaded' : 'Verification pending'}
              </h3>
              <p className="mt-1 text-sm">
                {isEditMode
                  ? 'You can replace or add documents below.'
                  : 'Admin reviews your submitted documents within 24 hours.'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Required Documents
            </h2>

            <div className="mt-6 space-y-4">
              <UploadBox
                title="National ID / NIC - Front Side"
                subtitle="Front image uploaded successfully."
                uploaded
              />

              <UploadBox
                title="National ID / NIC - Back Side"
                subtitle="Back image uploaded successfully."
                uploaded
              />

              <UploadBox
                title="Work Certificate"
                subtitle="Upload professional certificates or work experience letters."
                optional
              />

              <UploadBox
                title="Police Clearance"
                subtitle="Recommended for building more customer trust."
                optional
              />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Portfolio Photos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add your previous work samples.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                <ImagePlus size={17} />
                Add photo
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="relative h-36 overflow-hidden rounded-xl bg-slate-200"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${
                      item === 1
                        ? '1581578731548-c64695cc6952'
                        : '1503387762-592deb58ef4e'
                    }?auto=format&fit=crop&w=400&q=80`}
                    alt="Portfolio"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 shadow"
                    aria-label="Remove photo"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="grid h-36 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                <div className="text-center">
                  <Plus className="mx-auto" size={24} />
                  <p className="mt-2 text-sm font-bold">Add more</p>
                </div>
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Trust Score</h2>

            <div className="mt-5 text-center">
              <p className="text-4xl font-bold text-emerald-700">72</p>
              <p className="text-sm font-semibold text-slate-500">/100</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">NIC Verified</span>
                <span className="font-bold text-emerald-700">+20</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Phone Verified</span>
                <span className="font-bold text-emerald-700">+15</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Portfolio Added</span>
                <span className="font-bold text-emerald-700">+15</span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Add a work certificate to increase your trust score.
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-bold text-slate-950">
              <LockKeyhole size={19} className="text-emerald-700" />
              Secure Handling
            </h2>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700" />
                256-bit SSL encryption
              </p>

              <p className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700" />
                Hidden from other users
              </p>

              <p className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700" />
                Reviewed only by admins
              </p>
            </div>
          </div>
        </aside>
      </div>

      <ActionBar
        onBack={onBack}
        onNext={onNext}
        nextLabel={isEditMode ? 'Save & Continue' : 'Next: Packages'}
      />
    </>
  );
}

function PackageCard({ title, price, description, active = false }) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        active
          ? 'border-emerald-600 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        {active && (
          <span className="rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-bold uppercase text-white">
            Added
          </span>
        )}
      </div>

      <p className="mt-5 text-2xl font-bold text-emerald-700">{price}</p>

      {!active && (
        <button
          type="button"
          className="mt-5 w-full rounded-lg border border-emerald-700 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
        >
          Add this package
        </button>
      )}
    </div>
  );
}

function StepFour({ onBack, onSubmit, isEditMode }) {
  const [agreedTerms, setAgreedTerms] = useState(isEditMode);
  const [authenticDocs, setAuthenticDocs] = useState(isEditMode);

  return (
    <>
      <ProgressHeader
        step={4}
        title={isEditMode ? 'Edit Service Packages' : 'Set your service packages'}
        percent={75}
        isEditMode={isEditMode}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="space-y-6">
          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Basic / Starting Service
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Package Name">
                <Input defaultValue="Room Painting - Small" />
              </Field>

              <Field label="Base Price">
                <Input defaultValue="LKR 15,000" />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Description">
                  <TextArea defaultValue="Standard wall preparation, single color application for a standard 12x12 room. Includes minor crack filling and protective sheeting for floors." />
                </Field>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <PackageCard
              title="Full House / Large Project"
              price="LKR 35,000+"
              description="Comprehensive service for multiple rooms or exterior work."
            />

            <PackageCard
              title="Custom Quote / Hourly"
              price="Custom"
              description="For specialized tasks that require on-site assessment."
            />
          </div>

          <button
            type="button"
            className="grid min-h-40 w-full place-items-center rounded-xl border border-dashed border-emerald-600 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
          >
            <div className="text-center">
              <Plus className="mx-auto" size={26} />
              <p className="mt-2 font-bold">Add custom package</p>
            </div>
          </button>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-950">Lead Fee Preference</h2>

            <div className="mt-5 rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-emerald-700">
                    Pro Subscription
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Covers up to 50 inquiries per month.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-bold uppercase text-white">
                  Recommended
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
              You can switch to pay-per-lead later from Subscription settings.
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-950">Compliance & Terms</h2>

            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(event) => setAgreedTerms(event.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-700"
              />
              <span>I agree to SkilledLK Professional Terms of Service.</span>
            </label>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={authenticDocs}
                onChange={(event) => setAuthenticDocs(event.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-700"
              />
              <span>I confirm that all submitted documents are authentic.</span>
            </label>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            <h2 className="flex items-center gap-2 font-bold">
              <Award size={19} />
              Pro Tip
            </h2>

            <p className="mt-3 text-sm leading-relaxed">
              Workers with at least 3 packages receive better booking rates and
              more customer inquiries.
            </p>
          </div>
        </aside>
      </div>

      <ActionBar
        onBack={onBack}
        onNext={onSubmit}
        submit
        nextLabel={isEditMode ? 'Save Changes' : 'Submit'}
      />
    </>
  );
}

export default function WorkerRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');
  const stepFromUrl = Number(searchParams.get('step'));

  const isEditMode = mode === 'edit';
  const initialStep = stepFromUrl >= 2 && stepFromUrl <= 4 ? stepFromUrl : 2;

  const [step, setStep] = useState(initialStep);

  function updateStep(nextStep) {
    setStep(nextStep);

    if (isEditMode) {
      navigate(`/worker/register?mode=edit&step=${nextStep}`, {
        replace: true,
      });
    }
  }

  function goBack() {
    if (step === 2) {
      navigate(isEditMode ? '/worker/profile' : '/signup');
      return;
    }

    updateStep(step - 1);
  }

  function goNext() {
    updateStep(Math.min(4, step + 1));
  }

  function submit() {
    navigate(isEditMode ? '/worker/profile' : '/worker/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <WorkerRegistrationHeader isEditMode={isEditMode} />

      <main className="mx-auto w-full max-w-[1760px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 2xl:py-12">
        {isEditMode && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
            You are editing your worker profile. Existing profile data is
            already loaded.
          </div>
        )}

        {step === 2 && (
          <StepTwo
            onBack={goBack}
            onNext={goNext}
            isEditMode={isEditMode}
          />
        )}

        {step === 3 && (
          <StepThree
            onBack={goBack}
            onNext={goNext}
            isEditMode={isEditMode}
          />
        )}

        {step === 4 && (
          <StepFour
            onBack={goBack}
            onSubmit={submit}
            isEditMode={isEditMode}
          />
        )}
      </main>

      <CustomerFooter logoHref="/worker/dashboard" />
    </div>
  );
}