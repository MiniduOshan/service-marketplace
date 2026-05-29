import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getStoredSessionUser, clearSession, apiRequest } from '../../lib/api';
import {
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  CircleDollarSign,
  CreditCard,
  LayoutGrid,
  LogOut,
  Mail,
  MessageSquare,
  MessagesSquare,
  Settings,
  Star,
  Wrench,
  Check,
  X,
} from 'lucide-react';
import CustomerFooter from './CustomerFooter';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutGrid, path: '/worker/dashboard' },
  { name: 'My Jobs', icon: BriefcaseBusiness, path: '/worker/jobs' },
  { name: 'My Services', icon: Wrench, path: '/worker/services' },
  { name: 'Earnings', icon: CircleDollarSign, path: '/worker/earnings' },
  { name: 'Messages', icon: MessagesSquare, path: '/worker/messages' },
  { name: 'Subscription', icon: Settings, path: '/worker/subscription' },
];

const initialNotifications = [];

function NotificationPanel({
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
      if (!groups[notification.group]) groups[notification.group] = [];
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
        className="fixed inset-x-0 bottom-0 top-[72px] z-30 cursor-default bg-transparent"
      />

      <div
        className={`fixed right-4 top-[76px] z-50 flex w-[calc(100vw-32px)] max-w-[450px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:right-6 lg:right-10 xl:right-12 2xl:right-16 ${
          expanded
            ? 'max-h-[calc(100vh-92px)]'
            : 'max-h-[min(620px,calc(100vh-92px))]'
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

export default function WorkerLayout({ children, noMainPadding = false }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationExpanded, setNotificationExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const currentUser = getStoredSessionUser();
  const firstName = currentUser?.name?.split(' ')[0] || 'Worker';

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchNotifications = () => {
      apiRequest('/auth/notifications')
        .then((res) => {
          const list = res.data || res;
          if (Array.isArray(list)) {
            setNotifications(list.map(n => {
              let Icon = CalendarCheck;
              let iconClassName = 'bg-blue-50 text-blue-700';
              if (n.title.toLowerCase().includes('message') || n.type === 'message') {
                Icon = MessageSquare;
                iconClassName = 'bg-emerald-50 text-emerald-700';
              } else if (n.title.toLowerCase().includes('cancel')) {
                Icon = X;
                iconClassName = 'bg-red-50 text-red-700';
              } else if (n.title.toLowerCase().includes('complete')) {
                Icon = Check;
                iconClassName = 'bg-emerald-50 text-emerald-700';
              }
              
              return {
                id: n.id,
                group: n.type === 'booking' ? 'Bookings' : 'System',
                title: n.title,
                message: n.message,
                unread: !!n.unread,
                time: new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                icon: Icon,
                iconClassName: iconClassName
              };
            }));
          }
        })
        .catch(err => console.error(err));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications]
  );

  function closeNotifications() {
    setNotificationOpen(false);
    setNotificationExpanded(false);
  }

  function markAllAsRead() {
    apiRequest('/auth/notifications/mark-read', { method: 'POST' })
      .then(() => {
        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            unread: false,
          }))
        );
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col 2xl:w-72">
          <div className="px-7 py-6">
            <button
              type="button"
              onClick={() => navigate('/worker/dashboard')}
              className="text-2xl font-extrabold tracking-tight text-emerald-700"
            >
              SkilledLK
            </button>

            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </div>
          </div>

          <nav className="mt-10 flex-1 space-y-2">
            {sidebarItems.map(({ name, icon: Icon, path }) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 border-r-4 px-6 py-4 text-sm font-semibold transition ${
                    isActive
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-700'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                  }`
                }
              >
                <Icon size={21} />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="px-6 py-7">
            <button
              type="button"
              onClick={() => {
                clearSession();
                window.location.href = '/';
              }}
              className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={21} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
                aria-label="Open worker menu"
              >
                <LayoutGrid size={20} />
              </button>

              <h1 className="text-lg font-bold text-slate-950 sm:text-xl">
                Good morning, {firstName} 👷
              </h1>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button
                className={`relative rounded-full p-2 transition ${
                  notificationOpen
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700'
                }`}
                aria-label="Notifications"
                type="button"
                onClick={() => setNotificationOpen((value) => !value)}
              >
                <Bell size={22} />

                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-600" />
                )}
              </button>

              <button
                className="rounded-full bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
                aria-label="Messages"
                type="button"
                onClick={() => navigate('/worker/messages')}
              >
                <MessageSquare size={22} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/worker/profile')}
                className="rounded-full"
                aria-label="Open worker profile"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-emerald-700 bg-emerald-700 text-sm font-bold text-white transition hover:ring-4 hover:ring-emerald-100">
                  {firstName.slice(0, 2).toUpperCase()}
                </div>
              </button>
            </div>
          </header>

          {mobileMenuOpen && (
            <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
              <nav className="grid gap-2 sm:grid-cols-2">
                {sidebarItems.map(({ name, icon: Icon, path }) => (
                  <NavLink
                    key={name}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon size={19} />
                    {name}
                  </NavLink>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    clearSession();
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={19} />
                  Logout
                </button>
              </nav>
            </div>
          )}

          <div
            className={`flex flex-1 flex-col transition ${
              notificationOpen ? 'blur-[3px]' : ''
            }`}
          >
            <main
              className={
                noMainPadding
                  ? 'flex-1'
                  : 'flex-1 px-5 py-8 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 2xl:py-10'
              }
            >
              {children}
            </main>

            <CustomerFooter logoHref="/worker/dashboard" />
          </div>

          {notificationOpen && (
            <NotificationPanel
              notifications={notifications}
              expanded={notificationExpanded}
              onToggleExpanded={() =>
                setNotificationExpanded((value) => !value)
              }
              onMarkAllAsRead={markAllAsRead}
              onClose={closeNotifications}
            />
          )}
        </div>
      </div>
    </div>
  );
}