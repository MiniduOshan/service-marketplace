import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  HelpCircle,
  Home,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Star,
  Trash2,
  User,
  X,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import {
  apiRequest,
  clearSession,
  getStoredSessionToken,
  getStoredSessionUser,
  storeSession,
} from '../../lib/api';

const initialAddresses = [];

const initialPaymentMethods = [];

const emptyAddressForm = {
  label: '',
  address: '',
  note: '',
  default: false,
};

const emptyCardForm = {
  type: '',
  number: '',
  expiry: '',
  default: false,
};

const emptyPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const profileSections = [
  {
    id: 'account',
    label: 'Account Settings',
    description: 'Preferences and account summary',
    icon: Bell,
  },
  {
    id: 'personal',
    label: 'Personal Information',
    description: 'Profile details and password',
    icon: User,
  },
  {
    id: 'addressBilling',
    label: 'Address & Billing',
    description: 'Addresses and payment methods',
    icon: CreditCard,
  },
];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, description, children, action }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  show,
  onToggleShow,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 focus:border-emerald-600"
        />

        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-emerald-700 disabled:cursor-not-allowed"
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());

  useEffect(() => {
    if (!sessionUser) {
      navigate('/login');
    }
  }, [sessionUser, navigate]);

  const [statsData, setStatsData] = useState({
    total_bookings: 0,
    completed_bookings: 0,
    reviews_given: 0,
    messages: 0,
  });

  const isPhoneVerified = Boolean(
    sessionUser?.phone_verified_at || sessionUser?.phoneVerifiedAt,
  );

  const joinedDate = useMemo(() => {
    if (!sessionUser?.created_at) return 'Joined April 2025';
    try {
      const date = new Date(sessionUser.created_at);
      const monthName = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return `Joined ${monthName} ${year}`;
    } catch {
      return 'Joined April 2025';
    }
  }, [sessionUser?.created_at]);

  const customer = useMemo(
    () => ({
      name: sessionUser?.name?.trim() || 'Profile',
      email: sessionUser?.email?.trim() || 'Signed in user',
      phone: sessionUser?.phone?.trim() || '',
      location: sessionUser?.location?.trim() || '',
      joinedDate: joinedDate,
    }),
    [sessionUser, joinedDate],
  );

  const displayInitials = useMemo(() => {
    const name = customer.name || 'Customer';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [customer.name]);

  const stats = useMemo(() => [
    { label: 'Total Bookings', value: String(statsData.total_bookings), icon: CalendarDays },
    { label: 'Completed', value: String(statsData.completed_bookings), icon: CheckCircle2 },
    { label: 'Reviews Given', value: String(statsData.reviews_given), icon: Star },
    { label: 'Messages', value: String(statsData.messages), icon: MessageSquare },
  ], [statsData]);

  const [activeSection, setActiveSection] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const [profileForm, setProfileForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    location: customer.location,
  });

  const [savedProfileForm, setSavedProfileForm] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    location: customer.location,
  });

  useEffect(() => {
    async function loadProfileData() {
      try {
        const meRes = await apiRequest('/auth/me');
        const latestUser = meRes.data?.user || meRes.data || meRes;
        if (latestUser) {
          setSessionUser(latestUser);
          storeSession(getStoredSessionToken(), latestUser);
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
      }

      try {
        const statsRes = await apiRequest('/auth/customer/stats');
        const sData = statsRes.data || statsRes;
        if (sData) {
          setStatsData({
            total_bookings: sData.total_bookings || 0,
            completed_bookings: sData.completed_bookings || 0,
            reviews_given: sData.reviews_given || 0,
            messages: sData.messages || 0,
          });
        }
      } catch (err) {
        console.error('Failed to load customer stats:', err);
      }
    }

    loadProfileData();
  }, []);

  useEffect(() => {
    if (sessionUser) {
      const freshForm = {
        name: sessionUser.name?.trim() || '',
        email: sessionUser.email?.trim() || '',
        phone: sessionUser.phone?.trim() || '',
        location: sessionUser.location?.trim() || '',
      };
      setProfileForm(freshForm);
      setSavedProfileForm(freshForm);
      setAddresses(sessionUser.addresses || []);
      setSavedAddresses(sessionUser.addresses || []);
      setPaymentMethods(sessionUser.payment_methods || []);
      setSavedPaymentMethods(sessionUser.payment_methods || []);
    }
  }, [sessionUser]);

  const [addresses, setAddresses] = useState(() => sessionUser?.addresses || []);
  const [savedAddresses, setSavedAddresses] = useState(() => sessionUser?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const [paymentMethods, setPaymentMethods] = useState(() => sessionUser?.payment_methods || []);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState(
    () => sessionUser?.payment_methods || []
  );
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState(emptyCardForm);

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [savedPasswordForm, setSavedPasswordForm] = useState(emptyPasswordForm);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [savedPreferences, setSavedPreferences] = useState({
    notificationsEnabled: true,
    language: 'English',
  });
  const [verificationOtp, setVerificationOtp] = useState('');
  const [hasOtpSent, setHasOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationNotice, setVerificationNotice] = useState('');

  const activeSectionMeta =
    profileSections.find((section) => section.id === activeSection) ||
    profileSections[0];

  const ActiveSectionIcon = activeSectionMeta.icon;

  const hasUnsavedChanges = useMemo(() => {
    return (
      JSON.stringify(profileForm) !== JSON.stringify(savedProfileForm) ||
      JSON.stringify(addresses) !== JSON.stringify(savedAddresses) ||
      JSON.stringify(paymentMethods) !== JSON.stringify(savedPaymentMethods) ||
      JSON.stringify(passwordForm) !== JSON.stringify(savedPasswordForm) ||
      notificationsEnabled !== savedPreferences.notificationsEnabled ||
      language !== savedPreferences.language ||
      showAddressForm ||
      showCardForm
    );
  }, [
    profileForm,
    savedProfileForm,
    addresses,
    savedAddresses,
    paymentMethods,
    savedPaymentMethods,
    passwordForm,
    savedPasswordForm,
    notificationsEnabled,
    language,
    savedPreferences,
    showAddressForm,
    showCardForm,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges) return;

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Do you want to discard them?'
      );

      if (!confirmed) return;
    }

    setProfileForm(savedProfileForm);
    setAddresses(savedAddresses);
    setPaymentMethods(savedPaymentMethods);
    setPasswordForm(savedPasswordForm);
    setNotificationsEnabled(savedPreferences.notificationsEnabled);
    setLanguage(savedPreferences.language);
    setAddressForm(emptyAddressForm);
    setCardForm(emptyCardForm);
    setShowAddressForm(false);
    setShowCardForm(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (
      passwordForm.newPassword ||
      passwordForm.currentPassword ||
      passwordForm.confirmPassword
    ) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('New password and confirm password do not match.');
        setActiveSection('personal');
        return;
      }

      if (!passwordForm.currentPassword) {
        alert('Please enter your current password.');
        setActiveSection('personal');
        return;
      }
    }

    const requestPayload = {
      name: profileForm.name,
      phone: profileForm.phone,
      addresses: addresses,
      payment_methods: paymentMethods,
    };

    if (passwordForm.newPassword && passwordForm.currentPassword) {
      requestPayload.current_password = passwordForm.currentPassword;
      requestPayload.password = passwordForm.newPassword;
      requestPayload.password_confirmation = passwordForm.confirmPassword;
    }

    try {
      const response = await apiRequest('/auth/profile', {
        method: 'POST',
        body: JSON.stringify(requestPayload),
      });

      const updatedUser = response?.data?.user || response?.data || response;
      if (updatedUser) {
        setSessionUser(updatedUser);
        storeSession(getStoredSessionToken(), updatedUser);

        const freshForm = {
          name: updatedUser.name?.trim() || '',
          email: updatedUser.email?.trim() || '',
          phone: updatedUser.phone?.trim() || '',
          location: updatedUser.location?.trim() || '',
        };
        setSavedProfileForm(freshForm);
        setProfileForm(freshForm);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile details.');
      return;
    }

    setSavedAddresses(addresses);
    setSavedPaymentMethods(paymentMethods);
    setSavedPasswordForm(emptyPasswordForm);
    setSavedPreferences({
      notificationsEnabled,
      language,
    });
    setPasswordForm(emptyPasswordForm);
    setAddressForm(emptyAddressForm);
    setCardForm(emptyCardForm);
    setShowAddressForm(false);
    setShowCardForm(false);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (!confirmed) return;

    clearSession();
    window.location.href = '/';
  };

  const handleRequestPhoneOtp = async () => {
    const phone = profileForm.phone.trim();
    const name = profileForm.name.trim();

    setVerificationError('');
    setVerificationNotice('');

    if (!phone) {
      setVerificationError('Please add your phone number before verification.');
      setActiveSection('personal');
      return;
    }

    if (!name) {
      setVerificationError('Please add your name before verification.');
      setActiveSection('personal');
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await apiRequest('/auth/user/request-phone-otp', {
        method: 'POST',
        body: JSON.stringify({
          phone,
        }),
      });

      const normalizedPhone = response?.data?.phone;
      if (normalizedPhone) {
        setProfileForm((prev) => ({ ...prev, phone: normalizedPhone }));
      }

      setHasOtpSent(true);
      setVerificationNotice('OTP sent. Enter the 6-digit code to verify.');
      setActiveSection('personal');
    } catch (requestError) {
      setVerificationError(requestError.message || 'Unable to send OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const phone = profileForm.phone.trim();
    const otp = verificationOtp.trim();

    setVerificationError('');
    setVerificationNotice('');

    if (!phone) {
      setVerificationError('Phone number is required.');
      return;
    }

    if (otp.length !== 6) {
      setVerificationError('Enter the 6-digit OTP code.');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await apiRequest('/auth/user/verify-phone-otp', {
        method: 'POST',
        body: JSON.stringify({
          otp,
        }),
      });

      const verifiedUser = response?.data?.user;

      if (verifiedUser) {
        storeSession(undefined, verifiedUser);
        setSessionUser(verifiedUser);
      }

      setSavedProfileForm((prev) => ({
        ...prev,
        phone: verifiedUser?.phone || prev.phone,
      }));
      setProfileForm((prev) => ({
        ...prev,
        phone: verifiedUser?.phone || prev.phone,
      }));

      setVerificationOtp('');
      setHasOtpSent(false);
      setVerificationNotice('Phone number verified successfully.');
    } catch (requestError) {
      setVerificationError(requestError.message || 'Unable to verify OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleAddAddress = () => {
    if (!addressForm.label.trim() || !addressForm.address.trim()) {
      alert('Please enter both address label and address.');
      return;
    }

    const newAddress = {
      id: Date.now(),
      label: addressForm.label.trim(),
      address: addressForm.address.trim(),
      note: addressForm.note.trim() || 'Saved service location',
      default: addressForm.default,
    };

    setAddresses((prev) => {
      if (newAddress.default) {
        return [
          ...prev.map((address) => ({ ...address, default: false })),
          newAddress,
        ];
      }

      return [...prev, newAddress];
    });

    setAddressForm(emptyAddressForm);
    setShowAddressForm(false);
  };

  const handleRemoveAddress = (id) => {
    const confirmed = window.confirm('Remove this address?');
    if (!confirmed) return;

    setAddresses((prev) => prev.filter((address) => address.id !== id));
  };

  const handleAddCard = () => {
    if (
      !cardForm.type.trim() ||
      !cardForm.number.trim() ||
      !cardForm.expiry.trim()
    ) {
      alert('Please enter card type, card number, and expiry date.');
      return;
    }

    const lastFour = cardForm.number.replace(/\s/g, '').slice(-4) || '0000';

    const newCard = {
      id: Date.now(),
      type: cardForm.type.trim(),
      number: `•••• •••• •••• ${lastFour}`,
      expiry: cardForm.expiry.trim().startsWith('Expires')
        ? cardForm.expiry.trim()
        : `Expires ${cardForm.expiry.trim()}`,
      default: cardForm.default,
    };

    setPaymentMethods((prev) => {
      if (newCard.default) {
        return [
          ...prev.map((method) => ({ ...method, default: false })),
          newCard,
        ];
      }

      return [...prev, newCard];
    });

    setCardForm(emptyCardForm);
    setShowCardForm(false);
  };

  const handleRemoveCard = (id) => {
    const confirmed = window.confirm('Remove this card?');
    if (!confirmed) return;

    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderAccountSettings = () => (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <SectionCard
        title="Account Summary"
        description="Quick overview of your customer account and activity."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Account Type
            </p>
            <p className="mt-2 font-semibold text-slate-800">
              {isPhoneVerified ? 'Verified Customer' : 'Unverified Customer'}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Member Since
            </p>
            <p className="mt-2 font-semibold text-slate-800">
              {customer.joinedDate}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Default Location
            </p>
            <p className="mt-2 font-semibold text-slate-800">
              {profileForm.location}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Saved Payment Methods
            </p>
            <p className="mt-2 font-semibold text-slate-800">
              {paymentMethods.length} card
              {paymentMethods.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Preferences"
        description="Control how you receive updates and customize your account experience."
      >
        <div className="divide-y divide-slate-100">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Bell size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Notifications
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Receive updates about your bookings and messages.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                isEditing &&
                setNotificationsEnabled((previousValue) => !previousValue)
              }
              disabled={!isEditing}
              className={`relative h-7 w-13 rounded-full transition disabled:cursor-not-allowed ${
                notificationsEnabled ? 'bg-emerald-700' : 'bg-slate-300'
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  notificationsEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Language</h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose the language you prefer to use in your customer account.
              </p>
            </div>

            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              disabled={!isEditing}
              className="h-11 min-w-44 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-emerald-600"
            >
              <option>English</option>
              <option>Sinhala</option>
              <option>Tamil</option>
            </select>
          </div>

          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <HelpCircle size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Help Center</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get support for your bookings, payments, and account.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="h-10 w-fit cursor-pointer rounded-lg border border-emerald-700 bg-white px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Open Help Center
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderPersonalInformation = () => (
    <div className="space-y-7">
      <SectionCard
        title="Personal Information"
        description="Update your contact details used for bookings and communication."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={profileForm.name}
                onChange={(event) => handleChange('name', event.target.value)}
                disabled={!isEditing}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={profileForm.email}
                onChange={(event) => handleChange('email', event.target.value)}
                disabled={!isEditing}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={profileForm.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                disabled={!isEditing}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-emerald-600"
              />
            </div>

            <div className="mt-3">
              <p
                className={`text-xs font-semibold ${
                  isPhoneVerified ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {isPhoneVerified
                  ? 'Phone is verified.'
                  : 'Phone verification required.'}
              </p>

              {!isPhoneVerified && (
                <div className="mt-3 space-y-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                  <button
                    type="button"
                    onClick={handleRequestPhoneOtp}
                    disabled={isSendingOtp}
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400"
                  >
                    {isSendingOtp ? 'Sending OTP...' : 'Send Verification OTP'}
                  </button>

                  {hasOtpSent && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={verificationOtp}
                        onChange={(event) =>
                          setVerificationOtp(
                            event.target.value.replace(/\D/g, '').slice(0, 6),
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 sm:max-w-52"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyPhoneOtp}
                        disabled={isVerifyingOtp}
                        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-emerald-700 bg-white px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300"
                      >
                        {isVerifyingOtp ? 'Verifying...' : 'Verify Phone'}
                      </button>
                    </div>
                  )}

                  {verificationError && (
                    <p className="text-xs font-medium text-red-600">
                      {verificationError}
                    </p>
                  )}

                  {verificationNotice && (
                    <p className="text-xs font-medium text-emerald-700">
                      {verificationNotice}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Main Location
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={profileForm.location}
                onChange={(event) =>
                  handleChange('location', event.target.value)
                }
                disabled={!isEditing}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition disabled:bg-slate-50 disabled:text-slate-500 focus:border-emerald-600"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Change Password"
        description="Update your password to keep your account secure."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <PasswordInput
            label="Current Password"
            value={passwordForm.currentPassword}
            onChange={(value) => handlePasswordChange('currentPassword', value)}
            disabled={!isEditing}
            placeholder="Current password"
            show={showPasswords.currentPassword}
            onToggleShow={() => toggleShowPassword('currentPassword')}
          />

          <PasswordInput
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(value) => handlePasswordChange('newPassword', value)}
            disabled={!isEditing}
            placeholder="New password"
            show={showPasswords.newPassword}
            onToggleShow={() => toggleShowPassword('newPassword')}
          />

          <PasswordInput
            label="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={(value) => handlePasswordChange('confirmPassword', value)}
            disabled={!isEditing}
            placeholder="Confirm password"
            show={showPasswords.confirmPassword}
            onToggleShow={() => toggleShowPassword('confirmPassword')}
          />
        </div>

        {!isEditing && (
          <p className="mt-4 text-sm text-slate-400">
            Click Edit Profile to update your password.
          </p>
        )}
      </SectionCard>
    </div>
  );

  const renderAddressBilling = () => (
    <div className="space-y-7">
      <SectionCard
        title="Saved Addresses"
        description="Manage locations you frequently use for service bookings."
        action={
          isEditing ? (
            <button
              type="button"
              onClick={() => setShowAddressForm((prev) => !prev)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {showAddressForm ? <X size={16} /> : <Plus size={16} />}
              {showAddressForm ? 'Close' : 'Add Address'}
            </button>
          ) : null
        }
      >
        {showAddressForm && isEditing && (
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={addressForm.label}
                onChange={(event) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    label: event.target.value,
                  }))
                }
                placeholder="Label e.g. Home, Office"
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              />

              <input
                type="text"
                value={addressForm.address}
                onChange={(event) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    address: event.target.value,
                  }))
                }
                placeholder="Full address"
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              />

              <input
                type="text"
                value={addressForm.note}
                onChange={(event) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
                placeholder="Note optional"
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              />

              <label className="flex h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={addressForm.default}
                  onChange={(event) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      default: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-emerald-700"
                />
                Set as default address
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddAddress}
                className="h-10 cursor-pointer rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Add Address
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700">
                    <Home size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {address.label}
                      </h3>

                      {address.default && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {address.address}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {address.note}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(address.id)}
                    className="cursor-pointer text-slate-400 transition hover:text-red-500"
                    aria-label="Delete address"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Payment Methods"
        description="Saved payment options for faster checkout."
        action={
          isEditing ? (
            <button
              type="button"
              onClick={() => setShowCardForm((prev) => !prev)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-emerald-700 bg-white px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              {showCardForm ? <X size={16} /> : <Plus size={16} />}
              {showCardForm ? 'Close' : 'Add Card'}
            </button>
          ) : null
        }
      >
        {showCardForm && isEditing && (
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={cardForm.type}
                onChange={(event) =>
                  setCardForm((prev) => ({
                    ...prev,
                    type: event.target.value,
                  }))
                }
                placeholder="Card type e.g. Visa Card"
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              />

              <input
                type="text"
                value={cardForm.number}
                onChange={(event) =>
                  setCardForm((prev) => ({
                    ...prev,
                    number: event.target.value,
                  }))
                }
                placeholder="Card number"
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              />

              <input
                type="text"
                value={cardForm.expiry}
                onChange={(event) =>
                  setCardForm((prev) => ({
                    ...prev,
                    expiry: event.target.value,
                  }))
                }
                placeholder="MM/YY"
                className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-emerald-600"
              />

              <label className="flex h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={cardForm.default}
                  onChange={(event) =>
                    setCardForm((prev) => ({
                      ...prev,
                      default: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-emerald-700"
                />
                Set as default card
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddCard}
                className="h-10 cursor-pointer rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Add Card
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <CreditCard size={23} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">{method.type}</h3>

                    {method.default && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-600">{method.number}</p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {method.expiry}
                  </p>
                </div>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleRemoveCard(method.id)}
                  className="w-fit cursor-pointer text-sm font-semibold text-slate-500 transition hover:text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderActiveContent = () => {
    if (activeSection === 'account') return renderAccountSettings();
    if (activeSection === 'personal') return renderPersonalInformation();
    if (activeSection === 'addressBilling') return renderAddressBilling();

    return renderAccountSettings();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="" />

      <main className="w-full flex-1 px-5 py-8 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                My Profile
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your account settings, personal details, addresses, and
                billing methods.
              </p>

              {isEditing && hasUnsavedChanges && (
                <p className="mt-2 text-sm font-medium text-amber-600">
                  You have unsaved changes. Please save before leaving this page.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 font-semibold text-white transition hover:bg-emerald-800"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}

              <button
                type="button"
                onClick={isEditing ? handleCancelEdit : handleStartEditing}
                className="inline-flex h-11 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-white px-5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]">
            {/* Left Profile Sidebar */}
            <aside className="space-y-7">
              <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="relative mx-auto h-28 w-28">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-700 text-3xl font-bold text-white shadow-sm">
                    {displayInitials}
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800"
                      aria-label="Change profile photo"
                    >
                      <Camera size={17} />
                    </button>
                  )}
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                  {profileForm.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {customer.joinedDate}
                </p>

                <div
                  className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                    isPhoneVerified
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <ShieldCheck size={17} />
                  {isPhoneVerified ? 'Verified Customer' : 'Unverified Customer'}
                </div>

                {!isPhoneVerified && (
                  <button
                    type="button"
                    onClick={handleRequestPhoneOtp}
                    disabled={isSendingOtp}
                    className="mt-3 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-emerald-700 bg-white px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:text-emerald-300"
                  >
                    {isSendingOtp ? 'Sending OTP...' : 'Verify Account'}
                  </button>
                )}

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-left">
                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={18} className="text-slate-400" />
                    {profileForm.email}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={18} className="text-slate-400" />
                    {profileForm.phone}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin size={18} className="text-slate-400" />
                    {profileForm.location}
                  </p>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="space-y-1">
                  {profileSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => handleSectionChange(section.id)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">
                            {section.label}
                          </p>

                          <p
                            className={`truncate text-xs ${
                              isActive ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          >
                            {section.description}
                          </p>
                        </div>

                        <ChevronRight
                          size={18}
                          className={
                            isActive ? 'text-emerald-700' : 'text-slate-300'
                          }
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-red-500 transition hover:bg-red-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <LogOut size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">Sign Out</p>
                      <p className="truncate text-xs text-red-300">
                        Log out from this account
                      </p>
                    </div>
                  </button>
                </div>
              </section>
            </aside>

            {/* Dynamic Main Content */}
            <section className="space-y-7">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <ActiveSectionIcon size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      {activeSectionMeta.label}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {activeSectionMeta.description}
                    </p>
                  </div>
                </div>
              </div>

              {renderActiveContent()}
            </section>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}