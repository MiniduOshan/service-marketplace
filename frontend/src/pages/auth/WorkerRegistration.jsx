import React, { useState, useEffect } from 'react';
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
  Pencil,
} from 'lucide-react';
import CustomerFooter from '../../components/layout/CustomerFooter';
import { getStoredSessionUser, apiRequest, storeSession } from '../../lib/api';
import { uploadImageToSupabase } from '../../lib/supabase';

const serviceCategories = [
  'Painting',
  'Electrical',
  'Plumbing',
  'AC Repair',
  'Carpentry',
  'Cleaning',
  'Masonry',
  'Gardening',
  'Appliance Repair',
  'Pest Control',
  'Auto Repair',
  'Car Detailing',
  'Tech Support',
  'Graphic Design',
  'Photography',
  'Catering',
  'Personal Training',
  'Academic Tutoring',
  'Moving & Packing',
  'Translation',
];

const initialSkills = [];
const cityOptions = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
];

const districtOptions = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
];

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

function StepTwo({
  onBack,
  onNext,
  isEditMode,
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  primaryServiceCategoryId,
  setPrimaryServiceCategoryId,
  skills,
  setSkills,
  avatarUrl,
  setAvatarUrl,
  city,
  setCity,
  district,
  setDistrict,
  dbCategories,
  saveProfileData,
}) {
  const [skillInput, setSkillInput] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef(null);

  function addSkill() {
    const cleanSkill = skillInput.trim();
    if (!cleanSkill) return;
    setSkills((current) => [...current, cleanSkill]);
    setSkillInput('');
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, 'avatars');
      setAvatarUrl(publicUrl);
    } catch (err) {
      alert(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleNextStep() {
    try {
      await saveProfileData({
        name,
        phone: phone ? `+94${phone}` : null,
        email,
        primary_service_category_id: primaryServiceCategoryId ? parseInt(primaryServiceCategoryId) : null,
        skills,
        avatar_url: avatarUrl,
        city,
        district,
      });
      onNext();
    } catch (err) {
      // API error handled/alerted in saveProfileData
    }
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
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field label="Phone Number">
              <div className="flex">
                <span className="grid h-12 place-items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-4 text-sm font-bold text-slate-600">
                  +94
                </span>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-l-none" />
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Email Address Optional">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Service Category">
              <Select value={primaryServiceCategoryId} onChange={(e) => setPrimaryServiceCategoryId(e.target.value)}>
                <option value="" disabled>Select Category</option>
                {dbCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </Field>

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
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid h-36 w-36 place-items-center rounded-full border-2 border-dashed border-emerald-900/30 bg-emerald-50 text-emerald-700 transition hover:border-emerald-700 overflow-hidden"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
                ) : isUploadingAvatar ? (
                  <p className="text-sm font-bold">Uploading...</p>
                ) : (
                  <div>
                    <Camera className="mx-auto" size={32} />
                    <p className="mt-2 text-sm font-bold">Upload photo</p>
                  </div>
                )}
              </button>

              <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">
                Please upload a clear, professional photo of yourself. Profile
                photos help build trust with customers.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="font-bold uppercase tracking-wide text-slate-600">
              Service Location
            </h2>

            <div className="mt-5 space-y-4">
              <Field label="District">
                <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="" disabled>Select District</option>
                  {districtOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Select>
              </Field>

              <Field label="City">
                <Select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="" disabled>Select City</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
        </aside>
      </div>

      <ActionBar
        onBack={onBack}
        onNext={handleNextStep}
        nextLabel={isEditMode ? 'Save & Continue' : 'Next: Documents'}
      />
    </>
  );
}

function UploadBox({ title, subtitle, uploaded = false, optional = false, onFileSelect }) {
  const fileInputRef = React.useRef(null);
  return (
    <div
      className={`rounded-xl border p-5 ${
        uploaded
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-dashed border-slate-300 bg-slate-50'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onFileSelect) onFileSelect(file);
        }}
      />
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
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-emerald-700 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

function StepThree({
  onBack,
  onNext,
  isEditMode,
  nicFrontUrl,
  setNicFrontUrl,
  nicBackUrl,
  setNicBackUrl,
  certificateUrl,
  setCertificateUrl,
  policeClearanceUrl,
  setPoliceClearanceUrl,
  portfolio,
  setPortfolio,
  saveProfileData,
}) {
  const portfolioInputRef = React.useRef(null);
  const [isUploading, setIsUploading] = useState({});

  async function handleUpload(file, fieldName, setUrl) {
    if (!file) return;
    setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const publicUrl = await uploadImageToSupabase(file, 'documents');
      setUrl(publicUrl);
    } catch (err) {
      alert(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  }

  async function handlePortfolioFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading((prev) => ({ ...prev, portfolio: true }));
    try {
      const publicUrl = await uploadImageToSupabase(file, 'portfolio');
      setPortfolio((current) => [...current, { id: Date.now(), image: publicUrl }]);
    } catch (err) {
      alert(err.message || 'Failed to upload portfolio image.');
    } finally {
      setIsUploading((prev) => ({ ...prev, portfolio: false }));
    }
    event.target.value = '';
  }

  async function handleNextStep() {
    try {
      await saveProfileData({
        nic_front: nicFrontUrl,
        nic_back: nicBackUrl,
        certificates: certificateUrl ? [certificateUrl] : [],
        police_clearance: policeClearanceUrl,
        portfolio: portfolio.map((p) => p.image),
      });
      onNext();
    } catch (err) {
      // Error handled
    }
  }

  const currentUser = getStoredSessionUser();
  const baseScore = 20;
  const nicFrontScore = nicFrontUrl ? 20 : 0;
  const nicBackScore = nicBackUrl ? 20 : 0;
  const phoneScore = currentUser?.phone_verified_at ? 15 : 0;
  const portfolioScore = portfolio.length > 0 ? 15 : 0;
  const certificateScore = certificateUrl ? 10 : 0;
  const score = baseScore + nicFrontScore + nicBackScore + phoneScore + portfolioScore + certificateScore;

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
                subtitle={nicFrontUrl ? "Front ID uploaded successfully." : "Front side image of your National Identity Card."}
                uploaded={!!nicFrontUrl || isUploading.nicFront}
                onFileSelect={(file) => handleUpload(file, 'nicFront', setNicFrontUrl)}
              />

              <UploadBox
                title="National ID / NIC - Back Side"
                subtitle={nicBackUrl ? "Back ID uploaded successfully." : "Back side image of your National Identity Card."}
                uploaded={!!nicBackUrl || isUploading.nicBack}
                onFileSelect={(file) => handleUpload(file, 'nicBack', setNicBackUrl)}
              />

              <UploadBox
                title="Work Certificate"
                subtitle={certificateUrl ? "Certificate uploaded successfully." : "Upload professional certificates or work experience letters."}
                optional
                uploaded={!!certificateUrl || isUploading.certificate}
                onFileSelect={(file) => handleUpload(file, 'certificate', setCertificateUrl)}
              />

              <UploadBox
                title="Police Clearance"
                subtitle={policeClearanceUrl ? "Clearance uploaded successfully." : "Recommended for building more customer trust."}
                optional
                uploaded={!!policeClearanceUrl || isUploading.policeClearance}
                onFileSelect={(file) => handleUpload(file, 'policeClearance', setPoliceClearanceUrl)}
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

              <input
                type="file"
                ref={portfolioInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePortfolioFileSelect}
              />
              <button
                type="button"
                onClick={() => portfolioInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                <ImagePlus size={17} />
                Add photo
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="relative h-36 overflow-hidden rounded-xl bg-slate-200"
                >
                  <img
                    src={item.image}
                    alt="Portfolio"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => setPortfolio((current) => current.filter((p) => p.id !== item.id))}
                    className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-600 shadow"
                    aria-label="Remove photo"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => portfolioInputRef.current?.click()}
                className="grid h-36 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                <div className="text-center">
                  <Plus className="mx-auto" size={24} />
                  <p className="mt-2 text-sm font-bold">
                    {isUploading.portfolio ? 'Uploading...' : 'Add more'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Trust Score</h2>

            <div className="mt-5 text-center">
              <p className="text-4xl font-bold text-emerald-700">{score}</p>
              <p className="text-sm font-semibold text-slate-500">/100</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">NIC Verified</span>
                <span className={`font-bold ${nicFrontUrl && nicBackUrl ? 'text-emerald-700' : 'text-slate-400'}`}>+20</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Phone Verified</span>
                <span className={`font-bold ${phoneScore > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>+15</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Portfolio Added</span>
                <span className={`font-bold ${portfolioScore > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>+15</span>
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
        onNext={handleNextStep}
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
  const [customPackages, setCustomPackages] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingPackageId, setUploadingPackageId] = useState(null);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgImage, setNewPkgImage] = useState('');

  // Basic package states
  const [basicPkgId, setBasicPkgId] = useState(null);
  const [basicPkgName, setBasicPkgName] = useState('');
  const [basicPkgPrice, setBasicPkgPrice] = useState('');
  const [basicPkgDesc, setBasicPkgDesc] = useState('');
  const [basicPkgImage, setBasicPkgImage] = useState('');

  // Editing state variables
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [editPkgName, setEditPkgName] = useState('');
  const [editPkgPrice, setEditPkgPrice] = useState('');
  const [editPkgDesc, setEditPkgDesc] = useState('');
  const [editPkgImage, setEditPkgImage] = useState('');

  // Load existing packages if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      apiRequest('/auth/worker/services')
        .then((res) => {
          const pkgs = res.data || res;
          if (Array.isArray(pkgs) && pkgs.length > 0) {
            const basic = pkgs[0];
            setBasicPkgId(basic.id);
            setBasicPkgName(basic.title);
            setBasicPkgPrice(`LKR ${parseFloat(basic.price).toLocaleString()}`);
            setBasicPkgDesc(basic.description);
            setBasicPkgImage(basic.image_url || '');

            setCustomPackages(pkgs.slice(1).map(p => ({
              id: p.id,
              title: p.title,
              price: `LKR ${parseFloat(p.price).toLocaleString()}`,
              description: p.description,
              active: !!p.is_active,
              image_url: p.image_url || '',
            })));
          }
        })
        .catch(err => console.error("Failed to load packages", err));
    }
  }, [isEditMode]);

  async function handleImageSelect(file, setImage, packageId = 'new') {
    if (!file) return;

    setIsUploadingImage(true);
    setUploadingPackageId(packageId);

    try {
      const publicUrl = await uploadImageToSupabase(file, 'service-packages');
      setImage(publicUrl);
    } catch (err) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      setUploadingPackageId(null);
    }
  }

  async function saveCustomPackage() {
    const name = newPkgName.trim();
    const rawPrice = newPkgPrice.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(rawPrice);
    const description = newPkgDesc.trim();

    if (!name || isNaN(priceVal) || !description) return;

    if (isEditMode) {
      try {
        const currentUser = getStoredSessionUser();
        const res = await apiRequest('/auth/worker/services', {
          method: 'POST',
          body: JSON.stringify({
            title: name,
            price: priceVal,
            description: description,
            service_category_id: currentUser?.primary_service_category_id || 1,
            duration_minutes: 60,
            location_type: 'onsite',
            image_url: newPkgImage || null,
          })
        });
        const newPkg = res.data || res;
        setCustomPackages((current) => [
          ...current,
          {
            id: newPkg.id,
            title: newPkg.title,
            price: `LKR ${parseFloat(newPkg.price).toLocaleString()}`,
            description: newPkg.description,
            active: !!newPkg.is_active,
            image_url: newPkg.image_url || newPkgImage || '',
          },
        ]);
      } catch (err) {
        alert(err.message || 'Failed to save package.');
        return;
      }
    } else {
      setCustomPackages((current) => [
        ...current,
        {
          id: Date.now(),
          title: name,
          price: `LKR ${priceVal.toLocaleString()}`,
          description: description,
          active: true,
          image_url: newPkgImage,
        },
      ]);
    }

    // Reset input fields and close form
    setNewPkgName('');
    setNewPkgPrice('');
    setNewPkgDesc('');
    setNewPkgImage('');
    setIsAdding(false);
  }

  async function removeCustomPackage(id) {
    if (isEditMode) {
      try {
        // Toggle is_active to false in backend instead of deleting
        await apiRequest(`/auth/worker/services/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: false })
        });
      } catch (err) {
        alert(err.message || 'Failed to remove package.');
        return;
      }
    }
    setCustomPackages((current) => current.filter((pkg) => pkg.id !== id));
  }

  function startEditing(pkg) {
    setEditingPkgId(pkg.id);
    setEditPkgName(pkg.title);
    setEditPkgPrice(pkg.price);
    setEditPkgDesc(pkg.description);
    setEditPkgImage(pkg.image_url || '');
  }

  async function saveEditedPackage() {
    const name = editPkgName.trim();
    const rawPrice = editPkgPrice.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(rawPrice);
    const description = editPkgDesc.trim();

    if (!name || isNaN(priceVal) || !description) return;

    if (isEditMode) {
      try {
        await apiRequest(`/auth/worker/services/${editingPkgId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: name,
            price: priceVal,
            description: description,
            image_url: editPkgImage || null,
          })
        });
      } catch (err) {
        alert(err.message || 'Failed to save edits.');
        return;
      }
    }

    setCustomPackages((current) =>
      current.map((pkg) =>
        pkg.id === editingPkgId
          ? { ...pkg, title: name, price: `LKR ${priceVal.toLocaleString()}`, description: description, image_url: editPkgImage }
          : pkg
      )
    );
    setEditingPkgId(null);
    setEditPkgImage('');
  }

  async function handleSubmit() {
    if (!agreedTerms || !authenticDocs) {
      alert('Please agree to all terms and conditions before submitting.');
      return;
    }

    const rawPrice = basicPkgPrice.replace(/[^0-9.]/g, '');
    const priceVal = parseFloat(rawPrice);

    if (basicPkgName.trim() && !isNaN(priceVal) && basicPkgDesc.trim()) {
      try {
        const currentUser = getStoredSessionUser();
        const payload = {
          title: basicPkgName.trim(),
          price: priceVal,
          description: basicPkgDesc.trim(),
          service_category_id: currentUser?.primary_service_category_id || 1,
          duration_minutes: 60,
          location_type: 'onsite',
          image_url: basicPkgImage || null,
        };

        if (isEditMode && basicPkgId) {
          await apiRequest(`/auth/worker/services/${basicPkgId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
          });
        } else {
          await apiRequest('/auth/worker/services', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
        }
      } catch (err) {
        alert(err.message || 'Failed to save basic package.');
        return;
      }
    }

    if (!isEditMode && customPackages.length > 0) {
      for (const pkg of customPackages) {
        try {
          const currentUser = getStoredSessionUser();
          const pkgPrice = parseFloat(pkg.price.replace(/[^0-9.]/g, ''));
          await apiRequest('/auth/worker/services', {
            method: 'POST',
            body: JSON.stringify({
              title: pkg.title,
              price: pkgPrice,
              description: pkg.description,
              service_category_id: currentUser?.primary_service_category_id || 1,
              duration_minutes: 60,
              location_type: 'onsite',
              image_url: pkg.image_url || null,
            }),
          });
        } catch (err) {
          alert(`Failed to save package "${pkg.title}": ${err.message}`);
          return;
        }
      }
    }

    onSubmit();
  }

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
                <Input value={basicPkgName} onChange={(e) => setBasicPkgName(e.target.value)} placeholder="e.g. Room Painting - Small" />
              </Field>

              <Field label="Base Price">
                <Input value={basicPkgPrice} onChange={(e) => setBasicPkgPrice(e.target.value)} placeholder="e.g. LKR 15,000" />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Description">
                  <TextArea value={basicPkgDesc} onChange={(e) => setBasicPkgDesc(e.target.value)} placeholder="Describe what is included in the basic package..." />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Package Image">
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Attach a service image</p>
                        <p className="mt-1 text-sm text-slate-500">Use Supabase storage so the image stays available after refresh.</p>
                      </div>

                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
                        <ImagePlus size={17} />
                        {isUploadingImage && uploadingPackageId === 'basic' ? 'Uploading...' : 'Select image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImageSelect(event.target.files?.[0], setBasicPkgImage, 'basic')}
                        />
                      </label>
                    </div>

                    {basicPkgImage ? (
                      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <img src={basicPkgImage} alt="Package preview" className="h-44 w-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* Render added custom packages */}
          {customPackages.map((pkg) => {
            const isEditing = editingPkgId === pkg.id;

            if (isEditing) {
              return (
                <div key={pkg.id} className="rounded-xl border border-emerald-600 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950 mb-4">Edit Custom Package</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Package Name">
                      <Input 
                        value={editPkgName} 
                        onChange={(e) => setEditPkgName(e.target.value)} 
                        placeholder="e.g. Premium Full House Painting" 
                      />
                    </Field>

                    <Field label="Price">
                      <Input 
                        value={editPkgPrice} 
                        onChange={(e) => setEditPkgPrice(e.target.value)} 
                        placeholder="e.g. LKR 45,000" 
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Description">
                        <TextArea 
                          value={editPkgDesc} 
                          onChange={(e) => setEditPkgDesc(e.target.value)} 
                          placeholder="Describe what services and benefits are included in this package..." 
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label="Package Image">
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Replace the package image</p>
                              <p className="mt-1 text-sm text-slate-500">The uploaded Supabase URL will be saved with the package.</p>
                            </div>

                            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
                              <ImagePlus size={17} />
                              {isUploadingImage && uploadingPackageId === pkg.id ? 'Uploading...' : 'Select image'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => handleImageSelect(event.target.files?.[0], setEditPkgImage, pkg.id)}
                              />
                            </label>
                          </div>

                          {editPkgImage ? (
                            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                              <img src={editPkgImage} alt="Package preview" className="h-44 w-full object-cover" />
                            </div>
                          ) : null}
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingPkgId(null)}
                      className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveEditedPackage}
                      disabled={!editPkgName.trim() || !editPkgPrice.trim() || !editPkgDesc.trim()}
                      className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={pkg.id} className="relative rounded-xl border border-emerald-600 bg-emerald-50/50 p-6 shadow-sm">
                <div className="absolute right-4 top-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(pkg)}
                    className="text-slate-400 hover:text-emerald-700 transition"
                    aria-label="Edit package"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCustomPackage(pkg.id)}
                    className="text-slate-400 hover:text-red-600 transition"
                    aria-label="Remove package"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-950 text-lg mr-14">{pkg.title}</h3>
                  <span className="text-xl font-extrabold text-emerald-700 mr-8">{pkg.price}</span>
                </div>
                {pkg.image_url ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img src={pkg.image_url} alt={pkg.title} className="h-40 w-full object-cover" />
                  </div>
                ) : null}
                <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-[90%]">{pkg.description}</p>
              </div>
            );
          })}


          {/* Inline Form to add a new custom package */}
          {isAdding && (
            <div className="rounded-xl border border-dashed border-emerald-700 bg-emerald-50/30 p-6 shadow-sm animate-fadeIn">
              <h3 className="text-lg font-bold text-slate-950 mb-4">New Custom Package</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Package Name">
                  <Input 
                    value={newPkgName} 
                    onChange={(e) => setNewPkgName(e.target.value)} 
                    placeholder="e.g. Premium Full House Painting" 
                  />
                </Field>

                <Field label="Price">
                  <Input 
                    value={newPkgPrice} 
                    onChange={(e) => setNewPkgPrice(e.target.value)} 
                    placeholder="e.g. LKR 45,000" 
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Description">
                    <TextArea 
                      value={newPkgDesc} 
                      onChange={(e) => setNewPkgDesc(e.target.value)} 
                      placeholder="Describe what services and benefits are included in this package..." 
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Package Image">
                    <div className="rounded-lg border border-dashed border-emerald-700/30 bg-white p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Optional: add a product image</p>
                          <p className="mt-1 text-sm text-slate-500">This image is uploaded to Supabase and stored with the package.</p>
                        </div>

                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800">
                          <ImagePlus size={17} />
                          {isUploadingImage && uploadingPackageId === 'new' ? 'Uploading...' : 'Select image'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => handleImageSelect(event.target.files?.[0], setNewPkgImage)}
                          />
                        </label>
                      </div>

                      {newPkgImage ? (
                        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          <img src={newPkgImage} alt="Package preview" className="h-44 w-full object-cover" />
                        </div>
                      ) : null}
                    </div>
                  </Field>
                </div>
              </div>

              <div className="mt-5 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveCustomPackage}
                  disabled={!newPkgName.trim() || !newPkgPrice.trim() || !newPkgDesc.trim()}
                  className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Package
                </button>
              </div>
            </div>
          )}

          {!isAdding && (
            <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Add package
              </p>

              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Plus size={18} />
                More packages
              </button>
            </div>
          )}
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
        onNext={handleSubmit}
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
  const [currentUser, setCurrentUser] = useState(() => getStoredSessionUser());

  // Step 2 state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/^\+94/, '') : '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [primaryServiceCategoryId, setPrimaryServiceCategoryId] = useState(currentUser?.primary_service_category_id || '');
  const [skills, setSkills] = useState(currentUser?.skills || []);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [district, setDistrict] = useState(currentUser?.district || '');

  // Step 3 state
  const [nicFrontUrl, setNicFrontUrl] = useState(currentUser?.nic_front || '');
  const [nicBackUrl, setNicBackUrl] = useState(currentUser?.nic_back || '');
  const [certificateUrl, setCertificateUrl] = useState(currentUser?.certificates?.[0] || '');
  const [policeClearanceUrl, setPoliceClearanceUrl] = useState(currentUser?.police_clearance || '');
  const [portfolio, setPortfolio] = useState(
    currentUser?.portfolio 
      ? currentUser.portfolio.map((img, idx) => ({ id: idx, image: img })) 
      : []
  );

  const [dbCategories, setDbCategories] = useState([]);
  useEffect(() => {
    apiRequest('/categories')
      .then((res) => setDbCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  async function saveProfileData(fields) {
    try {
      const res = await apiRequest('/auth/profile', {
        method: 'POST',
        body: JSON.stringify(fields),
      });
      if (res.data && res.data.user) {
        storeSession(undefined, res.data.user);
        setCurrentUser(res.data.user);
      }
      return res.data.user;
    } catch (err) {
      alert(err.message || 'Failed to save profile details.');
      throw err;
    }
  }

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
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            primaryServiceCategoryId={primaryServiceCategoryId}
            setPrimaryServiceCategoryId={setPrimaryServiceCategoryId}
            skills={skills}
            setSkills={setSkills}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            city={city}
            setCity={setCity}
            district={district}
            setDistrict={setDistrict}
            dbCategories={dbCategories}
            saveProfileData={saveProfileData}
          />
        )}

        {step === 3 && (
          <StepThree
            onBack={goBack}
            onNext={goNext}
            isEditMode={isEditMode}
            nicFrontUrl={nicFrontUrl}
            setNicFrontUrl={setNicFrontUrl}
            nicBackUrl={nicBackUrl}
            setNicBackUrl={setNicBackUrl}
            certificateUrl={certificateUrl}
            setCertificateUrl={setCertificateUrl}
            policeClearanceUrl={policeClearanceUrl}
            setPoliceClearanceUrl={setPoliceClearanceUrl}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            saveProfileData={saveProfileData}
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