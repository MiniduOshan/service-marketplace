import React, { useMemo, useState } from 'react';
import {
  MoreVertical,
  Paperclip,
  PenSquare,
  Phone,
  Search,
  SendHorizontal,
  Smile,
  Video,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

const conversations = [
  {
    id: 1,
    name: 'Kasun Silva',
    avatar: 'https://i.pravatar.cc/120?img=12',
    status: 'Online now',
    online: true,
    lastMessage: "I'll be there at 9 AM. My number is...",
    time: '10:25 AM',
    unread: true,
    starred: false,
  },
  {
    id: 2,
    name: 'Sunil Perera',
    avatar: 'https://i.pravatar.cc/120?img=52',
    status: 'Last seen yesterday',
    online: false,
    lastMessage: 'The wiring fix is completed. Thank you!',
    time: 'Yesterday',
    unread: false,
    starred: false,
  },
  {
    id: 3,
    name: 'Amali de Silva',
    avatar: 'https://i.pravatar.cc/120?img=32',
    status: 'Last seen 25 Apr',
    online: false,
    lastMessage: "I've sent the updated floor plan for the...",
    time: '25 Apr',
    unread: false,
    starred: true,
  },
  {
    id: 4,
    name: 'Nimal Karunaratne',
    avatar: 'https://i.pravatar.cc/120?img=14',
    status: 'Online now',
    online: true,
    lastMessage: 'Can you confirm the final paint color?',
    time: '24 Apr',
    unread: true,
    starred: false,
  },
  {
    id: 5,
    name: 'Sherumi Perera',
    avatar: 'https://i.pravatar.cc/120?img=49',
    status: 'Last seen 23 Apr',
    online: false,
    lastMessage: 'The kitchen sink is still leaking slightly.',
    time: '23 Apr',
    unread: false,
    starred: true,
  },
  {
    id: 6,
    name: 'Janaka Silva',
    avatar: 'https://i.pravatar.cc/120?img=59',
    status: 'Offline',
    online: false,
    lastMessage: 'AC servicing was completed successfully.',
    time: '22 Apr',
    unread: false,
    starred: false,
  },
  {
    id: 7,
    name: 'Ayesha Fernando',
    avatar: 'https://i.pravatar.cc/120?img=47',
    status: 'Last seen 21 Apr',
    online: false,
    lastMessage: 'Thank you for completing the installation.',
    time: '21 Apr',
    unread: false,
    starred: false,
  },
  {
    id: 8,
    name: 'Ruwan Jayasinghe',
    avatar: 'https://i.pravatar.cc/120?img=33',
    status: 'Last seen 20 Apr',
    online: false,
    lastMessage: 'Can we reschedule the booking?',
    time: '20 Apr',
    unread: true,
    starred: false,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: 'customer',
    text: 'Hello! I saw your room painting request. Could you share more details about the size?',
    time: '10:22 AM',
  },
  {
    id: 2,
    sender: 'worker',
    text: "Hi Kasun! It’s a 12×14 ft bedroom. Currently light yellow walls.",
    time: '10:24 AM',
  },
  {
    id: 3,
    sender: 'customer',
    text: 'Perfect. I can do it for LKR 5,000 including primer and 2 coats. Are you OK with 28 April?',
    time: '10:25 AM',
  },
  {
    id: 4,
    sender: 'worker',
    text: 'Yes that works! Please confirm the booking.',
    time: '10:26 AM',
  },
  {
    id: 5,
    sender: 'system',
    text: 'Booking confirmed ✓ · Worker contact shared',
  },
  {
    id: 6,
    sender: 'customer',
    text: "Great! I'll be there at 9 AM. My number is 077-XXXXXXX",
    time: 'Just now',
  },
];

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
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const selectedConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId
    ) || conversations[0];

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
  }, [activeFilter, searchTerm]);

  function handleSendMessage(event) {
    event.preventDefault();

    const cleanMessage = messageText.trim();
    if (!cleanMessage) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: 'worker',
        text: cleanMessage,
        time: 'Just now',
      },
    ]);

    setMessageText('');
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
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === activeConversationId}
                onClick={() => setActiveConversationId(conversation.id)}
              />
            ))}
          </div>
        </section>

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

              <div className="flex items-center gap-4 text-slate-600">
                <button
                  type="button"
                  className="transition hover:text-emerald-700"
                  aria-label="Call"
                >
                  <Phone size={20} />
                </button>

                <button
                  type="button"
                  className="transition hover:text-emerald-700"
                  aria-label="Video call"
                >
                  <Video size={20} />
                </button>

                <button
                  type="button"
                  className="transition hover:text-emerald-700"
                  aria-label="More"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            <div className="border-t border-amber-100 bg-amber-50 px-5 py-3 text-center text-sm font-medium text-amber-700 sm:px-7">
              Worker’s phone number will be shared after booking is confirmed.
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
            <div className="mx-auto max-w-5xl space-y-7">
              <div className="flex justify-center">
                <span className="rounded-full bg-slate-200/60 px-5 py-2 text-xs font-medium text-slate-600">
                  Booking #BK-1041 created · 28 Apr 2025
                </span>
              </div>

              {messages.map((message) => (
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
      </div>
    </WorkerLayout>
  );
}