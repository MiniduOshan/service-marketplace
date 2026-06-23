import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Info,
  MapPin,
  Shield,
  Star,
  UploadCloud,
  X,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import BookingProgress from './BookingProgress';
import { compressImage } from '../../lib/image';
import { getStoredSessionUser, storeSession, getStoredSessionToken, apiRequest } from '../../lib/api';

export default function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { config } = useConfig();

  const stateWorker = location.state?.worker || (location.state?.workerId ? {
    id: location.state.workerId,
    name: location.state.workerName || 'Verified Pro',
    rating: '4.8',
    reviews: '24 reviews',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(location.state.workerName || 'Pro')}&background=006D44&color=fff`,
  } : null);

  const statePackage = location.state?.servicePackage || (location.state?.servicePackageId ? {
    id: location.state.servicePackageId,
    title: location.state.serviceTitle || 'Professional Service',
    price: location.state.priceLabel ? parseFloat(location.state.priceLabel.replace(/[^0-9.]/g, '')) || 3500 : 3500,
  } : { id: 'dummy', title: 'Unknown', price: 0 });

  const worker = stateWorker || { id: 'dummy' };
  const servicePackage = statePackage;


  const storedDraft = React.useMemo(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem('bookingDraft') || '{}');
      if (data.servicePackageId === servicePackage.id) {
        return data;
      }
    } catch(e) { console.warn(e); }
    return {};
  }, [servicePackage.id]);

  const [date, setDate] = useState(storedDraft.date || '');
  const [time, setTime] = useState(storedDraft.time || 'Morning (08:00 AM - 12:00 PM)');
  const [isTBD, setIsTBD] = useState(storedDraft.isTBD || false);
  const [streetAddress, setStreetAddress] = useState(storedDraft.streetAddress || '');
  const [city, setCity] = useState(storedDraft.city || 'Colombo');
  const [landmark, setLandmark] = useState(storedDraft.landmark || '');
  const [description, setDescription] = useState(storedDraft.description || '');
  const [photos, setPhotos] = useState(storedDraft.photos || []);

  React.useEffect(() => {
    sessionStorage.setItem('bookingDraft', JSON.stringify({
      servicePackageId: servicePackage.id,
      date, time, isTBD, streetAddress, city, landmark, description, photos
    }));
  }, [servicePackage.id, date, time, isTBD, streetAddress, city, landmark, description, photos]);
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawBase64 = event.target.result;
        compressImage(rawBase64, 1200, 1200, 0.75).then((compressedBase64) => {
          setPhotos((prev) => [...prev, compressedBase64]);
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (!isTBD && !date) {
      alert('Please select a preferred date or choose to discuss it later.');
      return;
    }
    if (!streetAddress) {
      alert('Please enter your street address.');
      return;
    }

    const fullAddress = `${streetAddress}, ${city}${landmark ? ` (near ${landmark})` : ''}`;

    navigate('/book/review', {
      state: {
        worker,
        servicePackage,
        bookingDetails: {
          date: isTBD ? null : date,
          time: isTBD ? null : time,
          address: fullAddress,
          description: description || 'No description provided.',
          photos,
        },
      },
    });
  };

  const displayPrice = `LKR ${parseFloat(servicePackage.price || 0).toLocaleString()}`;

  const [currentUser, setCurrentUser] = useState(getStoredSessionUser());
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(!currentUser?.phone_verified_at);
  const [verificationPhone, setVerificationPhone] = useState(currentUser?.phone || '');
  const [verificationOtp, setVerificationOtp] = useState(['', '', '', '', '', '']);
  const [verificationStep, setVerificationStep] = useState(1); // 1 = request, 2 = enter otp
  const [verificationError, setVerificationError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const otpInputRefs = React.useRef([]);

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setVerificationError('');
    setIsSendingOtp(true);
    try {
      await apiRequest('/auth/user/request-phone-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: verificationPhone }),
      });
      setVerificationStep(2);
    } catch (err) {
      setVerificationError(err.message || 'Failed to send OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const code = verificationOtp.join('');
    if (code.length !== 6) return;
    setVerificationError('');
    setIsSendingOtp(true);
    try {
      const res = await apiRequest('/auth/user/verify-phone-otp', {
        method: 'POST',
        body: JSON.stringify({ otp: code }),
      });
      const updatedUser = res.data.user;
      storeSession(getStoredSessionToken(), updatedUser);
      setCurrentUser(updatedUser);
      setIsVerifyingPhone(false);
    } catch (err) {
      setVerificationError(err.message || 'Invalid OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 1);
    const updatedOtp = [...verificationOtp];
    updatedOtp[index] = cleanValue;
    setVerificationOtp(updatedOtp);
    if (cleanValue && index < verificationOtp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const nextOtp = [...verificationOtp];
    pasted.split('').forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setVerificationOtp(nextOtp);
    otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  if (config?.bookings === false) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <CustomerNavbar activePage="" />
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 sm:p-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">Bookings Disabled</h2>
            <p className="mt-2 text-slate-500">The booking feature is currently disabled by the administrator.</p>
          </div>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  if (worker.id === 'dummy' || servicePackage.id === 'dummy') {
    return <Navigate to="/" replace />;
  }


  if (isVerifyingPhone) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <CustomerNavbar activePage="bookings" />
        <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <Shield size={32} className="text-emerald-700" />
            </div>
            
            <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
              Verify Your Phone Number
            </h1>
            <p className="mb-8 text-center text-sm text-slate-500">
              For security and to coordinate with workers, we need to verify your phone number before you can book.
            </p>

            {verificationError && (
              <p className="mb-6 text-center text-sm font-medium text-red-600">
                {verificationError}
              </p>
            )}

            {verificationStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    value={verificationPhone}
                    onChange={(e) => setVerificationPhone(e.target.value)}
                    placeholder="e.g. 077 123 4567"
                    className="h-12 w-full rounded-lg border border-slate-200 px-4 text-slate-900 outline-none transition focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-emerald-700 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-70"
                >
                  {isSendingOtp ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {verificationOtp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white sm:h-14 sm:w-14"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isSendingOtp || verificationOtp.join('').length !== 6}
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-emerald-700 font-bold text-white transition hover:bg-emerald-800 disabled:opacity-70"
                >
                  {isSendingOtp ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setVerificationStep(1)}
                    className="text-sm font-bold text-emerald-700 transition hover:underline"
                  >
                    Change Phone Number
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="bookings" />

      <BookingProgress
        currentStep={2}
        showBack
        onBack={() => navigate(-1)}
      />

      <main className="mx-auto w-full max-w-none px-5 py-10 sm:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <section>
            <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
              Provide Job Details
            </h1>

            <div className="space-y-8">
              {/* Preferred Date & Time */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={23} className="text-emerald-700" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      Preferred Date & Time
                    </h2>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTBD}
                      onChange={(e) => setIsTBD(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                    />
                    <span className="text-sm text-slate-600">Discuss in chat later</span>
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled={isTBD}
                      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-600 disabled:opacity-50 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Preferred Time
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      disabled={isTBD}
                      className="h-12 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-600 disabled:opacity-50 disabled:bg-slate-50"
                    >
                      <option>Morning (08:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 04:00 PM)</option>
                      <option>Evening (04:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <MapPin size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Location
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="House No, Street Name"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Landmark Optional
                      </label>
                      <input
                        type="text"
                        placeholder="Near Petrol Shed"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <FileText size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Job Description
                  </h2>
                </div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Describe the work in detail
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide specific details about the service required (e.g. scope of work, dimensions, material preferences)."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
                />
              </div>

              {/* Photos */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <UploadCloud size={23} className="text-emerald-700" />
                  <h2 className="text-xl font-semibold text-slate-900">
                    Photos
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <UploadCloud size={31} className="text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs font-medium uppercase text-slate-400">
                    SVG, PNG, JPG or GIF max. 10MB
                  </p>
                </button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {photos.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="group relative h-24 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <img src={photo} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex h-14 min-w-72 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-8 text-lg font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  Continue to Review
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Worker Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {worker.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-700">
                      <Star size={15} fill="currentColor" />
                      {worker.rating} ({worker.reviews})
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service</span>
                    <span className="font-semibold text-slate-900">
                      {servicePackage.title}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Est. Base Price</span>
                    <span className="font-semibold text-slate-900">
                      {displayPrice}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                  <Info size={18} className="mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold leading-4">
                    Final price will be confirmed after worker reviews your job
                    description.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Shield size={22} className="mt-0.5 text-slate-400" />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    SkillMarket Protection
                  </h3>
                  <p className="text-sm leading-5 text-slate-500">
                    Your payments are secure until you approve the work.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}