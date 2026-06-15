import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Info,
  Menu,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  X,
  SquarePen,
  MessageSquare,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';
import { apiRequest, getStoredSessionUser } from '../../lib/api';
import { useConfig } from '../../context/ConfigContext';

const filters = ['All Chats', 'Unread', 'Starring'];

function ConversationAvatar({ conversation }) {
  return (
    <div className="relative shrink-0">
      <img
        src={conversation.avatar}
        alt={conversation.name}
        className="h-12 w-12 rounded-full object-cover"
      />

      {conversation.online && (
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600" />
      )}
    </div>
  );
}

function ConversationItem({ conversation, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full cursor-pointer gap-3 px-5 py-4 text-left transition hover:bg-emerald-50/60 ${
        active ? 'bg-emerald-50' : 'bg-white'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-0 h-full w-1 bg-emerald-700" />
      )}

      <ConversationAvatar conversation={conversation} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {conversation.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-emerald-700">
              {conversation.role}
            </p>
          </div>

          <span className="shrink-0 text-xs text-slate-500">
            {conversation.time}
          </span>
        </div>

        <p className="mt-1 truncate text-sm text-slate-500">
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  );
}

function ChatBubble({ message, workerAvatar, workerName }) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-slate-200 px-5 py-2 text-sm font-medium text-slate-500">
          {message.text}
        </span>
      </div>
    );
  }

  if (message.type === 'confirmation') {
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-100 px-5 py-2.5 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={18} />
          {message.text}
        </span>
      </div>
    );
  }

  const isCustomer = message.sender === 'customer';

  return (
    <div
      className={`flex items-end gap-3 ${
        isCustomer ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isCustomer && (
        <img
          src={workerAvatar}
          alt="Worker"
          className="h-8 w-8 rounded-full object-cover"
        />
      )}

      <div
        className={`flex max-w-[78%] flex-col sm:max-w-[70%] lg:max-w-[64%] ${
          isCustomer ? 'items-end' : 'items-start'
        }`}
      >
        {!isCustomer && (
          <p className="mb-1 text-left text-xs font-semibold text-slate-500">
            {workerName}
          </p>
        )}
        <div
          className={`rounded-2xl px-5 py-4 text-base leading-7 shadow-sm ${
            isCustomer
              ? 'rounded-br-none bg-emerald-800 text-white'
              : 'rounded-bl-none border border-slate-200 bg-white text-slate-800'
          }`}
        >
          {message.text}
        </div>

        <span
          className={`mt-1 text-xs text-slate-400 ${
            isCustomer ? 'mr-1' : 'ml-1'
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const location = useLocation();
  const currentUser = getStoredSessionUser();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversationMessages, setConversationMessages] = useState({});
  const [activeFilter, setActiveFilter] = useState('All Chats');
  const [messageInput, setMessageInput] = useState('');
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const { config } = useConfig();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00:00');
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);

  const handleUpdateSchedule = async () => {
    if (!scheduleDate) return;
    setIsUpdatingSchedule(true);
    try {
      await apiRequest(`/bookings/${activeConversationId}/schedule`, {
        method: 'PATCH',
        body: JSON.stringify({ scheduled_at: `${scheduleDate} ${scheduleTime}` })
      });
      setShowScheduleModal(false);
      alert('Schedule updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update schedule.');
    } finally {
      setIsUpdatingSchedule(false);
    }
  };

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await apiRequest('/auth/bookings');
        const list = res.data?.data || res.data || [];
        const isWorker = currentUser?.role === 'worker';
        const targetBookingId = location.state?.bookingId ? Number(location.state.bookingId) : null;

        const deduplicate = (listToDedupe) => {
          const seen = new Set();
          return listToDedupe.filter((item) => {
            const counterpartId = isWorker ? item.customerId : item.workerId;
            if (targetBookingId && item.id === targetBookingId) {
              seen.add(counterpartId);
              return true;
            }
            if (seen.has(counterpartId)) {
              return false;
            }
            seen.add(counterpartId);
            return true;
          });
        };

        const mapped = deduplicate(list.map((b) => {
          const counterpartName = isWorker ? (b.customer?.name || 'Customer') : (b.worker?.name || 'Worker Pro');
          return {
            id: b.id,
            workerId: b.worker_id,
            customerId: b.customer_id,
            name: counterpartName,
            role: b.service_package?.category?.name || 'Verified Pro',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(counterpartName)}&background=006D44&color=fff`,
            lastMessage: `Booking status: ${b.status}`,
            time: new Date(b.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            unread: false,
            online: true,
            starred: false,
            status: b.status,
            phone: isWorker ? b.customer?.phone : b.worker?.phone,
          };
        }));
        setConversations(mapped);

        // Auto select active conversation
        if (targetBookingId) {
          setActiveConversationId(targetBookingId);
        } else if (location.state?.workerId) {
          const workerIdNum = Number(location.state.workerId);
          const existing = mapped.find((c) => c.workerId === workerIdNum);
          if (existing) {
            setActiveConversationId(existing.id);
          } else {
            // No booking exists with this worker. Create one on-the-fly!
            let servicePackageId = location.state?.servicePackageId;
            if (!servicePackageId) {
              try {
                const servicesRes = await apiRequest(`/services?worker_id=${workerIdNum}`);
                const packages = servicesRes.data?.data || servicesRes.data || [];
                if (packages.length > 0) {
                  servicePackageId = packages[0].id;
                }
              } catch (e) {
                console.error(e);
              }
            }

            if (servicePackageId) {
              try {
                const bookingRes = await apiRequest('/auth/bookings', {
                  method: 'POST',
                  body: JSON.stringify({
                    service_package_id: servicePackageId,
                    scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
                    address: 'Inquiry Address',
                    notes: 'Initial Chat Inquiry',
                    payment_option: 'after',
                  }),
                });
                const newBooking = bookingRes.data || bookingRes;
                if (newBooking && newBooking.id) {
                  // Reload conversations to select the newly created booking conversation
                  const reloadRes = await apiRequest('/auth/bookings');
                  const reloadList = reloadRes.data?.data || reloadRes.data || [];
                  const reloadMapped = deduplicate(reloadList.map((b) => {
                    const counterpartName = isWorker ? (b.customer?.name || 'Customer') : (b.worker?.name || 'Worker Pro');
                    return {
                      id: b.id,
                      workerId: b.worker_id,
                      customerId: b.customer_id,
                      name: counterpartName,
                      role: b.service_package?.category?.name || 'Verified Pro',
                      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(counterpartName)}&background=006D44&color=fff`,
                      lastMessage: `Booking status: ${b.status}`,
                      time: new Date(b.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                      unread: false,
                      online: true,
                      starred: false,
                      status: b.status,
                      phone: isWorker ? b.customer?.phone : b.worker?.phone,
                    };
                  }));
                  setConversations(reloadMapped);
                  setActiveConversationId(newBooking.id);
                }
              } catch (err) {
                console.error("Failed to create inquiry booking:", err);
                if (mapped.length > 0) {
                  setActiveConversationId(mapped[0].id);
                }
              }
            } else {
              if (mapped.length > 0) {
                setActiveConversationId(mapped[0].id);
              }
            }
          }
        } else if (mapped.length > 0) {
          setActiveConversationId(mapped[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (currentUser) {
      loadConversations();
    }
  }, [location.state]);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id == activeConversationId
      ) || null,
    [conversations, activeConversationId]
  );

  const fetchMessages = async (bookingId) => {
    try {
      const res = await apiRequest(`/auth/bookings/${bookingId}/messages`);
      const msgList = res.data || [];
      setConversationMessages((prev) => ({
        ...prev,
        [bookingId]: msgList.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === currentUser?.id ? 'customer' : 'worker',
          text: msg.body,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!activeConversationId) return;
    fetchMessages(activeConversationId);
    const interval = setInterval(() => {
      fetchMessages(activeConversationId);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeConversationId]);

  const filteredConversations = useMemo(() => {
    if (activeFilter === 'Unread') {
      return conversations.filter((conversation) => conversation.unread);
    }

    if (activeFilter === 'Starring') {
      return conversations.filter((conversation) => conversation.starred);
    }

    return conversations;
  }, [conversations, activeFilter]);

  const activeMessages = useMemo(
    () => (activeConversationId ? conversationMessages[activeConversationId] || [] : []),
    [conversationMessages, activeConversationId]
  );

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setMobileListOpen(false);
  };

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !activeConversationId) return;

    try {
      const res = await apiRequest(`/auth/bookings/${activeConversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body: text }),
      });
      const newMsg = res.data;
      if (newMsg) {
        const mapped = {
          id: newMsg.id,
          sender: 'customer',
          text: newMsg.body,
          time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setConversationMessages((prev) => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), mapped],
        }));
        setMessageInput('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (config?.chat === false) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <CustomerNavbar activePage="" />
        <main className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">Chat Disabled</h2>
            <p className="mt-2 text-slate-500">The chat feature is currently disabled by the administrator.</p>
          </div>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="" />

      {/* Chat viewport area */}
      <main className="flex h-[calc(100vh-80px)] overflow-hidden border-b border-slate-200 bg-slate-50">
        {/* Sidebar / Profiles Area */}
        <aside
          className={`fixed inset-y-0 left-0 z-[60] w-[330px] border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:w-[360px] lg:translate-x-0 ${
            mobileListOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 border-b border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Messages
                </h1>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 lg:flex"
                    aria-label="New message"
                  >
                    <SquarePen size={23} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileListOpen(false)}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 lg:hidden"
                    aria-label="Close conversations"
                  >
                    <X size={23} />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {filters.map((filter) => {
                  const isActive = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-700'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profiles area scrolls only when content overflows */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No messages yet.
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    active={conversation.id == activeConversationId}
                    onClick={() => handleSelectConversation(conversation.id)}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {mobileListOpen && (
          <button
            type="button"
            onClick={() => setMobileListOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
            aria-label="Close overlay"
          />
        )}

        {/* Chat Area */}
        {conversations.length === 0 ? (
          <section className="flex min-w-0 flex-1 flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageSquare size={38} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">Your Inbox is Empty</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Choose a professional from the search or home page and click 'Chat' to start a conversation.
            </p>
          </section>
        ) : !activeConversation ? (
          <section className="flex min-w-0 flex-1 flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageSquare size={38} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">Select a Conversation</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Select a chat from the sidebar to view the conversation history and start messaging.
            </p>
          </section>
        ) : (
          <section className="flex min-w-0 flex-1 flex-col bg-slate-50">
            {/* Chat Header */}
            <header className="flex min-h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileListOpen(true)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
                  aria-label="Open conversations"
                >
                  <Menu size={22} />
                </button>

                <ConversationAvatar conversation={activeConversation} />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-bold text-slate-900">
                      {activeConversation.name}
                    </h2>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm text-slate-500">
                      {activeConversation.role}
                    </span>
                  </div>

                  <p className="mt-0.5 flex items-center gap-2 text-sm text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    Online now
                  </p>
                </div>
              </div>

              {/* Action buttons removed as requested */}
            </header>

            {activeConversation.status === 'pending' ? (
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm">
                <div className="flex min-w-0 items-center gap-3 text-orange-700">
                  <Info size={18} className="shrink-0" />
                  <p className="truncate">
                    Worker’s phone number will be shared after booking is confirmed.
                  </p>
                </div>

                <div className="flex shrink-0 gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="cursor-pointer font-bold text-amber-700 hover:text-amber-800"
                  >
                    Update Schedule
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Book now
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-sm">
                <div className="flex min-w-0 items-center gap-3 text-emerald-800">
                  <Info size={18} className="shrink-0 text-emerald-700" />
                  <p className="truncate font-semibold">
                    Booking Confirmed! Worker Contact: <span className="font-bold text-emerald-900">{activeConversation.phone || '077 123 4567'}</span>
                  </p>
                </div>

                {activeConversation.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(true)}
                    className="shrink-0 cursor-pointer font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    Update Schedule
                  </button>
                )}
              </div>
            )}

            {showScheduleModal && (
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="h-9 rounded-md border border-slate-300 px-3 py-1 outline-none focus:border-emerald-500"
                  />
                  <select
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="h-9 rounded-md border border-slate-300 px-3 py-1 outline-none focus:border-emerald-500"
                  >
                    <option value="09:00:00">Morning (08:00 AM - 12:00 PM)</option>
                    <option value="13:00:00">Afternoon (12:00 PM - 04:00 PM)</option>
                    <option value="17:00:00">Evening (04:00 PM - 08:00 PM)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateSchedule}
                    disabled={!scheduleDate || isUpdatingSchedule}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdatingSchedule ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Messages area scrolls */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-16">
              <div className="flex flex-col gap-7">
                {activeMessages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    workerAvatar={activeConversation.avatar}
                    workerName={activeConversation.name}
                  />
                ))}
              </div>
            </div>

            {/* Message typing box */}
            <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-16">
              <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2">
                <button
                  type="button"
                  className="cursor-pointer text-slate-500 transition hover:text-emerald-700"
                  aria-label="Attach file"
                >
                  <Paperclip size={22} />
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Write a message..."
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  className="cursor-pointer text-slate-500 transition hover:text-emerald-700"
                  aria-label="Emoji"
                >
                  <Smile size={22} />
                </button>

                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
                  aria-label="Send message"
                >
                  <Send size={24} fill="currentColor" />
                </button>
              </div>
            </footer>
          </section>
        )}
      </main>

      <CustomerFooter />
    </div>
  );
}