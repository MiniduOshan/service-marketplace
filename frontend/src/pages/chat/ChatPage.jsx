import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Info,
  Menu,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
  X,
  SquarePen,
} from 'lucide-react';

import CustomerNavbar from '../../components/layout/CustomerNavbar';
import CustomerFooter from '../../components/layout/CustomerFooter';

const conversations = [
  {
    id: 1,
    name: 'Kasun Silva',
    role: 'Painter',
    avatar:
      'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=300',
    lastMessage: "I'll be there at 9 AM. My number is...",
    time: '10:25 AM',
    unread: true,
    online: true,
    starred: false,
  },
  {
    id: 2,
    name: 'Sunil Perera',
    role: 'Electrician',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    lastMessage: 'The wiring fix is completed. Thank you!',
    time: 'Yesterday',
    unread: false,
    online: false,
    starred: false,
  },
  {
    id: 3,
    name: 'Amali de Silva',
    role: 'Interior Designer',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    lastMessage: 'I’ve sent the updated floor plan for the...',
    time: '25 Apr',
    unread: false,
    online: false,
    starred: true,
  },
  {
    id: 4,
    name: 'Nuwan Perera',
    role: 'Plumber',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    lastMessage: 'I can visit tomorrow morning.',
    time: '24 Apr',
    unread: false,
    online: false,
    starred: false,
  },
  {
    id: 5,
    name: 'Saman Fernando',
    role: 'AC Technician',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    lastMessage: 'Sorry, I am unavailable for that time slot.',
    time: '22 Apr',
    unread: false,
    online: false,
    starred: false,
  },
];

const messages = [
  {
    id: 1,
    type: 'system',
    text: 'Booking #BK-1041 created · 28 April 2025',
  },
  {
    id: 2,
    sender: 'worker',
    text: 'Hello! I saw your room painting request. Could you share more details about the room size?',
    time: '10:22 AM',
  },
  {
    id: 3,
    sender: 'customer',
    text: 'Hi Kasun! It’s a 12×14 ft bedroom. Currently light yellow walls.',
    time: '10:24 AM',
  },
  {
    id: 4,
    sender: 'worker',
    text: 'Perfect. I can do it for LKR 5,000 including primer and 2 coats. Are you OK with 28th April?',
    time: '10:25 AM',
  },
  {
    id: 5,
    sender: 'customer',
    text: 'Yes that works! Please confirm the booking.',
    time: '10:26 AM',
  },
  {
    id: 6,
    type: 'confirmation',
    text: 'Booking confirmed · Worker contact shared',
  },
  {
    id: 7,
    sender: 'worker',
    text: "Great! I'll be there at 9 AM. My number is 077-XXXXXXX",
    time: 'Just now',
  },
];

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

function ChatBubble({ message, workerAvatar }) {
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
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All Chats');
  const [messageInput, setMessageInput] = useState('');
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId
      ) || conversations[0],
    [activeConversationId]
  );

  const filteredConversations = useMemo(() => {
    if (activeFilter === 'Unread') {
      return conversations.filter((conversation) => conversation.unread);
    }

    if (activeFilter === 'Starring') {
      return conversations.filter((conversation) => conversation.starred);
    }

    return conversations;
  }, [activeFilter]);

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setMobileListOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CustomerNavbar activePage="" />

      {/* Chat viewport area. The footer is below this area and can be reached by scrolling down. */}
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
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === activeConversationId}
                  onClick={() => handleSelectConversation(conversation.id)}
                />
              ))}
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

            <div className="flex shrink-0 items-center gap-3 text-slate-600">
              {/* <button
                type="button"
                className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-slate-100 hover:text-emerald-700 sm:flex"
                aria-label="Call"
              >
                <Phone size={22} />
              </button>

              <button
                type="button"
                className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-slate-100 hover:text-emerald-700 sm:flex"
                aria-label="Video call"
              >
                <Video size={22} />
              </button> */}

              <button
                type="button"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition hover:bg-slate-100 hover:text-emerald-700"
                aria-label="More"
              >
                <MoreVertical size={22} />
              </button>
            </div>
          </header>

          {/* Alert */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm">
            <div className="flex min-w-0 items-center gap-3 text-orange-700">
              <Info size={18} className="shrink-0" />
              <p className="truncate">
                Worker’s phone number will be shared after booking is confirmed.
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 cursor-pointer font-bold text-emerald-700 hover:text-emerald-800"
            >
              Book now
            </button>
          </div>

          {/* Messages area scrolls while the message typing box stays at the viewport bottom */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-16">
            <div className="mx-auto flex max-w-5xl flex-col gap-7">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  workerAvatar={activeConversation.avatar}
                />
              ))}
            </div>
          </div>

          {/* Message typing box */}
          <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-xl bg-slate-100 px-4 py-2">
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
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
                aria-label="Send message"
              >
                <Send size={24} fill="currentColor" />
              </button>
            </div>
          </footer>
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}