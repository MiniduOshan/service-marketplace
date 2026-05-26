import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MoreVertical,
  Paperclip,
  PenSquare,
  Phone,
  Search,
  SendHorizontal,
  Smile,
  Video,
  MessageSquare,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';
import { apiRequest, getStoredSessionUser } from '../../lib/api';

const filters = [
  { key: 'all', label: 'All Chats' },
  { key: 'unread', label: 'Unread' },
  { key: 'starred', label: 'Starring' },
];

function ConversationItem({ conversation, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-r-4 px-4 py-4 text-left transition ${
        active
          ? 'border-emerald-700 bg-emerald-50'
          : 'border-transparent bg-white hover:bg-slate-50'
      }`}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className="h-12 w-12 rounded-full object-cover"
          />

          {conversation.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate font-bold text-slate-950">
              {conversation.name}
            </h3>

            <span className="shrink-0 text-xs text-slate-400">
              {conversation.time}
            </span>
          </div>

          <p className="mt-1 truncate text-sm text-slate-500">
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ message, selectedConversation }) {
  if (message.sender === 'system') {
    return (
      <div className="flex justify-center">
        <div className="inline-flex rounded-full bg-emerald-100 px-5 py-2 text-xs font-bold text-emerald-700">
          {message.text}
        </div>
      </div>
    );
  }

  const isWorker = message.sender === 'worker';

  return (
    <div className={`flex gap-3 ${isWorker ? 'justify-end' : 'justify-start'}`}>
      {!isWorker && (
        <img
          src={selectedConversation.avatar}
          alt={selectedConversation.name}
          className="mt-auto h-7 w-7 rounded-full object-cover"
        />
      )}

      <div
        className={`max-w-[82%] sm:max-w-[70%] ${
          isWorker ? 'text-right' : ''
        }`}
      >
        {!isWorker && (
          <p className="mb-1 text-left text-xs font-semibold text-slate-500">
            {selectedConversation.name}
          </p>
        )}
        <div
          className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm sm:text-base ${
            isWorker
              ? 'rounded-br-sm bg-emerald-700 text-white'
              : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'
          }`}
        >
          {message.text}
        </div>

        {message.time && (
          <p className="mt-1 px-1 text-[11px] text-slate-400">
            {message.time}
          </p>
        )}
      </div>
    </div>
  );
}

export default function WorkerMessages() {
  const location = useLocation();
  const currentUser = getStoredSessionUser();
  const [conversations, setConversations] = useState([]);
  const [conversationMessages, setConversationMessages] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await apiRequest('/auth/bookings');
        const list = res.data?.data || res.data || [];
        const mapped = list.map((b) => {
          const counterpartName = b.customer?.name || 'Customer';
          return {
            id: b.id,
            workerId: b.worker_id,
            customerId: b.customer_id,
            name: counterpartName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(counterpartName)}&background=006D44&color=fff`,
            status: 'Online now',
            online: true,
            lastMessage: `Booking status: ${b.status}`,
            time: new Date(b.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            unread: false,
            starred: false,
            bookingStatus: b.status,
            phone: b.customer?.phone,
          };
        });
        setConversations(mapped);

        // Auto select active conversation
        if (location.state?.bookingId) {
          setActiveConversationId(Number(location.state.bookingId));
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

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id == activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const fetchMessages = async (bookingId) => {
    try {
      const res = await apiRequest(`/auth/bookings/${bookingId}/messages`);
      const msgList = res.data || [];
      setConversationMessages((prev) => ({
        ...prev,
        [bookingId]: msgList.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === currentUser?.id ? 'worker' : 'customer',
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
    return conversations.filter((conversation) => {
      const matchesSearch = conversation.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'unread' && conversation.unread) ||
        (activeFilter === 'starred' && conversation.starred);

      return matchesSearch && matchesFilter;
    });
  }, [conversations, activeFilter, searchTerm]);

  const activeMessages = useMemo(() => {
    return activeConversationId ? conversationMessages[activeConversationId] || [] : [];
  }, [conversationMessages, activeConversationId]);

  async function handleSendMessage(event) {
    event.preventDefault();

    const cleanMessage = messageText.trim();
    if (!cleanMessage || !activeConversationId) return;

    try {
      const res = await apiRequest(`/auth/bookings/${activeConversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body: cleanMessage }),
      });
      const newMsg = res.data;
      if (newMsg) {
        const mapped = {
          id: newMsg.id,
          sender: 'worker',
          text: newMsg.body,
          time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setConversationMessages((prev) => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), mapped],
        }));
        setMessageText('');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <WorkerLayout noMainPadding>
      <div className="flex h-[calc(100vh-72px)] min-h-[620px] overflow-hidden bg-slate-50">
        <section className="hidden w-[340px] shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col lg:w-[360px] 2xl:w-[400px]">
          <div className="shrink-0 border-b border-slate-100 px-6 py-7">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-950">Messages</h1>

              <button
                type="button"
                className="text-emerald-700 transition hover:text-emerald-800"
                aria-label="New message"
              >
                <PenSquare size={22} />
              </button>
            </div>

            <div className="mt-5 flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4">
              <Search size={20} className="text-slate-400" />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search conversations..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-5 flex gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeFilter === filter.key
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id == activeConversationId}
                  onClick={() => setActiveConversationId(conversation.id)}
                />
              ))
            )}
          </div>
        </section>

        {conversations.length === 0 ? (
          <section className="flex min-w-0 flex-1 flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageSquare size={38} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-950">Your Inbox is Empty</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              When a customer contacts you, their conversation history and inquiries will show up here.
            </p>
          </section>
        ) : !selectedConversation ? (
          <section className="flex min-w-0 flex-1 flex-col items-center justify-center bg-slate-50 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageSquare size={38} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-950">Select a Conversation</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Select a customer chat from the list to view your message history.
            </p>
          </section>
        ) : (
          <section className="flex min-w-0 flex-1 flex-col bg-slate-50">
            <div className="shrink-0 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between px-5 py-3 sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-slate-950">
                      {selectedConversation.name}
                    </h2>

                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {selectedConversation.status}
                    </p>
                  </div>
                </div>

                {/* Action buttons removed as requested */}
              </div>

              {selectedConversation.bookingStatus === 'pending' ? (
                <div className="border-t border-amber-100 bg-amber-50 px-5 py-3 text-center text-sm font-medium text-amber-700 sm:px-7">
                  Customer’s phone number will be shared after booking is confirmed.
                </div>
              ) : (
                <div className="border-t border-emerald-100 bg-emerald-50 px-5 py-3 text-center text-sm font-medium text-emerald-800 sm:px-7">
                  Booking Confirmed! Customer Contact: <span className="font-bold text-emerald-950">{selectedConversation.phone || '077 123 4567'}</span>
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <div className="mx-auto max-w-5xl space-y-7">
                {activeMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    selectedConversation={selectedConversation}
                  />
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSendMessage}
              className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6"
            >
              <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-xl bg-slate-100 px-4 py-3">
                <button
                  type="button"
                  className="text-slate-500 transition hover:text-emerald-700"
                  aria-label="Attach file"
                >
                  <Paperclip size={22} />
                </button>

                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Write a message..."
                  className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  className="text-slate-500 transition hover:text-emerald-700"
                  aria-label="Emoji"
                >
                  <Smile size={22} />
                </button>

                <button
                  type="submit"
                  className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
                  aria-label="Send message"
                >
                  <SendHorizontal size={22} />
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </WorkerLayout>
  );
}