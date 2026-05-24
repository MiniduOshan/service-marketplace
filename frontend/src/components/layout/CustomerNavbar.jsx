import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  CreditCard,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Star,
  User,
  Wrench,
  X,
} from 'lucide-react';

const initialCustomerNotifications = [
  {
    id: 1,
    group: 'TODAY',
    title: 'Booking Confirmed',
    message: "Your booking for 'Room Painting - Bedroom' has been confirmed.",
    time: '20m ago',
    unread: true,
    icon: CalendarCheck,
    iconClassName: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 2,
    group: 'TODAY',
    title: 'Worker Message',
    message: 'Kasun Silva sent you a message about your upcoming booking.',
    time: '1h ago',
    unread: true,
    icon: MessageSquare,
    iconClassName: 'bg-blue-50 text-blue-600',
  },
  {
    id: 3,
    group: 'TODAY',
    title: 'Payment Successful',
    message: 'Your payment of LKR 5,000 was successfully processed.',
    time: '3h ago',
    unread: false,
    icon: CreditCard,
    iconClassName: 'bg-amber-50 text-amber-600',
  },
  {
    id: 4,
    group: 'YESTERDAY',
    title: 'Job Completed',
    message: 'Your ceiling fan installation booking was marked as completed.',
    time: 'Yesterday',
    unread: false,
    icon: Wrench,
    iconClassName: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 5,
    group: 'YESTERDAY',
    title: 'Review Reminder',
    message: 'Please rate your recent service experience with Sunil Perera.',
    time: 'Yesterday',
    unread: true,
    icon: Star,
    iconClassName: 'bg-purple-50 text-purple-600',
  },
  {
    id: 6,
    group: 'THIS WEEK',
    title: 'New Worker Match',
    message: 'We found 3 available electricians near Maharagama.',
    time: '2d ago',
    unread: false,
    icon: User,
    iconClassName: 'bg-slate-100 text-slate-600',
  },
  {
    id: 7,
    group: 'THIS WEEK',
    title: 'Booking Reminder',
    message: 'Your plumbing repair booking is scheduled for tomorrow at 2:30 PM.',
    time: '4d ago',
    unread: false,
    icon: CalendarCheck,
    iconClassName: 'bg-emerald-50 text-emerald-700',
  },
];

function CustomerNotificationPanel({
  notifications,
  expanded,
  onToggleExpanded,
  onMarkAllAsRead,
  onClose,
}) {
  const visibleNotifications = expanded
    ? notifications
    : notifications.slice(0, 4);

  const groupedNotifications = visibleNotifications.reduce(
    (groups, notification) => {
      if (!groups[notification.group]) {
        groups[notification.group] = [];
      }

      groups[notification.group].push(notification);
      return groups;
    },
    {}
  );

  const hasUnread = notifications.some((notification) => notification.unread);

  return (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="fixed inset-x-0 bottom-0 top-20 z-40 cursor-default bg-white/20 backdrop-blur-sm"
      />

      <div
        className={`fixed right-4 top-[88px] z-50 flex w-[calc(100vw-32px)] max-w-[450px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:right-6 lg:right-10 xl:right-12 ${
          expanded
            ? 'max-h-[calc(100vh-104px)]'
            : 'max-h-[min(620px,calc(100vh-104px))]'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-950">Notifications</h2>

          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={!hasUnread}
            className={`text-sm font-bold transition ${
              hasUnread
                ? 'text-emerald-700 hover:text-emerald-800'
                : 'cursor-not-allowed text-slate-300'
            }`}
          >
            Mark all as read
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group} className="mb-6 last:mb-0">
              <h3 className="mb-3 text-xs font-bold tracking-widest text-slate-400">
                {group}
              </h3>

              <div className="space-y-1">
                {items.map((notification) => {
                  const Icon = notification.icon;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      className="flex w-full gap-4 rounded-lg px-2 py-4 text-left transition hover:bg-slate-50"
                    >
                      <div
                        className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full ${notification.iconClassName}`}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-bold text-slate-950">
                            {notification.title}
                          </h4>

                          <div className="flex shrink-0 items-center gap-2">
                            {notification.time && (
                              <span className="text-xs text-slate-400">
                                {notification.time}
                              </span>
                            )}

                            {notification.unread && (
                              <span className="h-2 w-2 rounded-full bg-emerald-600" />
                            )}
                          </div>
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          {notification.message}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggleExpanded}
          className="w-full shrink-0 border-t border-slate-100 px-5 py-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
        >
          {expanded ? 'Show less notifications' : 'See all notifications'}
        </button>
      </div>
    </>
  );
}

export default function CustomerNavbar({
  activePage = 'home',
  showSearchBar = false,
  serviceValue = '',
  locationValue = '',
  onServiceChange,
  onLocationChange,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationExpanded, setNotificationExpanded] = useState(false);
  const [notifications, setNotifications] = useState(
    initialCustomerNotifications
  );

  const navigate = useNavigate();

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications]
  );

  const navLinks = [
    { label: 'Home', href: '/customer/dashboard', key: 'home' },
    { label: 'Search', href: '/search', key: 'search' },
    { label: 'Bookings', href: '/bookings', key: 'bookings' },
    { label: 'About Us', href: '/about', key: 'about' },
  ];

  const goTo = (href) => {
    setMobileMenuOpen(false);
    setNotificationOpen(false);
    setNotificationExpanded(false);
    navigate(href);
  };

  function closeNotifications() {
    setNotificationOpen(false);
    setNotificationExpanded(false);
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  function toggleNotifications() {
    setNotificationOpen((value) => !value);
    setNotificationExpanded(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div
          className={
            showSearchBar
              ? 'grid min-h-20 w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 sm:px-8 lg:grid-cols-[170px_minmax(360px,520px)_minmax(300px,1fr)_auto] lg:gap-5 lg:px-8 xl:grid-cols-[190px_minmax(420px,620px)_minmax(330px,1fr)_auto] xl:px-10 2xl:grid-cols-[220px_minmax(520px,700px)_minmax(360px,1fr)_auto]'
              : 'relative grid min-h-20 w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 sm:px-8 lg:grid-cols-[220px_1fr_220px] lg:px-10 xl:px-12'
          }
        >
          <button
            type="button"
            onClick={() => goTo('/customer/dashboard')}
            className="shrink-0 cursor-pointer text-left text-2xl font-bold tracking-tight text-emerald-700"
          >
            SkilledLK
          </button>

          {showSearchBar ? (
            <div className="hidden min-w-0 items-center gap-3 lg:flex">
              <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-slate-100 px-4">
                <Search size={20} className="shrink-0 text-slate-500" />
                <input
                  type="text"
                  value={serviceValue}
                  onChange={(e) => onServiceChange?.(e.target.value)}
                  placeholder="What service do you need?"
                  className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex h-12 w-[170px] shrink-0 items-center gap-3 rounded-lg border border-slate-300 bg-slate-100 px-4 xl:w-[200px] 2xl:w-[220px]">
                <MapPin size={20} className="shrink-0 text-slate-500" />
                <input
                  type="text"
                  value={locationValue}
                  onChange={(e) => onLocationChange?.(e.target.value)}
                  placeholder="Location"
                  className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          ) : null}

          <nav
            className={
              showSearchBar
                ? 'hidden min-w-0 items-center justify-center gap-5 lg:flex xl:gap-7 2xl:gap-9'
                : 'hidden min-w-0 items-center justify-center gap-8 lg:flex'
            }
          >
            {navLinks.map((link) => {
              const isActive = activePage === link.key;

              return (
                <button
                  key={link.key}
                  type="button"
                  onClick={() => goTo(link.href)}
                  className={`relative cursor-pointer whitespace-nowrap text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-700'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  {link.label}

                  {isActive && (
                    <span className="absolute -bottom-3 left-0 h-[2px] w-full rounded-full bg-emerald-700" />
                  )}
                </button>
              );
            })}
          </nav>

          <div
            className={
              showSearchBar
                ? 'hidden shrink-0 items-center gap-4 lg:flex xl:gap-5 2xl:gap-6'
                : 'hidden shrink-0 items-center justify-end gap-5 lg:flex'
            }
          >
            <button
              type="button"
              onClick={toggleNotifications}
              className={`relative cursor-pointer rounded-full p-2 transition ${
                notificationOpen
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700'
              }`}
              aria-label="Notifications"
            >
              <Bell size={22} strokeWidth={1.9} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => goTo('/chat')}
              className="cursor-pointer text-slate-700 transition hover:text-emerald-700"
              aria-label="Messages"
            >
              <MessageSquare size={22} strokeWidth={1.9} />
            </button>

            <button
              type="button"
              onClick={() => goTo('/customer/profile')}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800"
              aria-label="Profile"
            >
              <User size={20} />
            </button>
          </div>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {showSearchBar && (
          <div className="grid gap-3 border-t border-slate-100 px-5 py-3 sm:px-8 lg:hidden">
            <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-300 bg-slate-100 px-4">
              <Search size={18} className="shrink-0 text-slate-500" />
              <input
                type="text"
                value={serviceValue}
                onChange={(e) => onServiceChange?.(e.target.value)}
                placeholder="What service do you need?"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-300 bg-slate-100 px-4">
              <MapPin size={18} className="shrink-0 text-slate-500" />
              <input
                type="text"
                value={locationValue}
                onChange={(e) => onLocationChange?.(e.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.key;

                return (
                  <button
                    key={link.key}
                    type="button"
                    onClick={() => goTo(link.href)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={toggleNotifications}
                className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 ${
                  notificationOpen
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700'
                }`}
                aria-label="Notifications"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => goTo('/chat')}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700"
                aria-label="Messages"
              >
                <MessageSquare size={20} />
              </button>

              <button
                type="button"
                onClick={() => goTo('/customer/profile')}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-emerald-700 text-white"
                aria-label="Profile"
              >
                <User size={19} />
              </button>
            </div>
          </div>
        )}
      </header>

      {notificationOpen && (
        <CustomerNotificationPanel
          notifications={notifications}
          expanded={notificationExpanded}
          onToggleExpanded={() => setNotificationExpanded((value) => !value)}
          onMarkAllAsRead={markAllAsRead}
          onClose={closeNotifications}
        />
      )}
    </>
  );
}