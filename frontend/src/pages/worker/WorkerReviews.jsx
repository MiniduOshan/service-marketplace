import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flag,
  MessageCircle,
  Send,
  Star,
  X,
} from 'lucide-react';
import WorkerLayout from '../../components/layout/WorkerLayout';

const initialReviews = [
  {
    id: 1,
    author: 'Samantha Perera',
    avatar: 'https://i.pravatar.cc/120?img=47',
    category: 'Painter',
    rating: 5,
    date: '2 days ago',
    content:
      'Aruna did an absolutely fantastic job painting our guest bedroom. He was punctual, meticulous about covering the furniture, and the finish is flawless. Highly recommend him for any precise interior work!',
    replied: false,
    reply: null,
  },
  {
    id: 2,
    author: 'David Wilson',
    avatar: 'https://i.pravatar.cc/120?img=12',
    category: 'Wall Repair',
    rating: 5,
    date: '1 week ago',
    content:
      'Very professional and tidy. He fixed several cracks in my plaster walls that I thought were beyond repair. The pricing was transparent and fair.',
    replied: true,
    reply: {
      author: 'Aruna K. (You)',
      date: '5 days ago',
      content:
        'Thank you so much, David! It was a pleasure working on your beautiful home. Let me know if you need anything else.',
    },
  },
  {
    id: 3,
    author: 'Kasun Abeysinghe',
    avatar: 'https://i.pravatar.cc/120?img=33',
    category: 'Exterior Trim',
    rating: 4,
    date: '2 weeks ago',
    content:
      'Good work overall. Arrived slightly later than expected but communicated well about the delay. The quality of work itself is excellent.',
    replied: false,
    reply: null,
  },
  {
    id: 4,
    author: 'Nethmi Fernando',
    avatar: 'https://i.pravatar.cc/120?img=49',
    category: 'Interior Painting',
    rating: 5,
    date: '3 weeks ago',
    content:
      'Excellent service from start to finish. The room looks fresh and clean, and the work was completed on time.',
    replied: false,
    reply: null,
  },
  {
    id: 5,
    author: 'Chamod Silva',
    avatar: 'https://i.pravatar.cc/120?img=15',
    category: 'Wall Repair',
    rating: 3,
    date: '1 month ago',
    content:
      'The repair quality was good, but the arrival time was later than expected. Communication could be improved.',
    replied: false,
    reply: null,
  },
];

const ratingBreakdown = [
  { label: '5 Star', count: 115, percentage: 92 },
  { label: '4 Star', count: 8, percentage: 8 },
  { label: '3 Star', count: 2, percentage: 2 },
  { label: '2 Star', count: 1, percentage: 1 },
  { label: '1 Star', count: 1, percentage: 1 },
];

const feedbackHighlights = [
  'Punctual',
  'Expert',
  'Clean',
  'Polite',
  'Fair Pricing',
  'Detail Oriented',
];

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-emerald-600">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={15}
          className={index < rating ? 'fill-emerald-600' : 'text-slate-200'}
        />
      ))}
    </div>
  );
}

function ReplyModal({ review, value, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Reply to Review</h2>
            <p className="mt-1 text-sm text-slate-500">
              Responding to {review.author}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close reply modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <p className="font-bold text-slate-950">{review.author}</p>
              <span className="text-xs text-slate-400">• {review.date}</span>
            </div>

            <RatingStars rating={review.rating} />

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {review.content}
            </p>
          </div>

          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            placeholder="Write your reply..."
            className="mt-5 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!value.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send size={16} />
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkerReviews() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState(initialReviews);
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filters = ['All', 'Recent', 'Highest Rated', 'Lowest Rated'];
  const reviewsPerPage = 3;

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (activeFilter === 'Highest Rated') {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (activeFilter === 'Lowest Rated') {
      result.sort((a, b) => a.rating - b.rating);
    }

    if (activeFilter === 'Recent') {
      result = [...reviews];
    }

    return result;
  }, [activeFilter, reviews]);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const visibleReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function openReplyModal(review) {
    if (review.replied) return;

    setReplyingReview(review);
    setReplyText('');
  }

  function submitReply() {
    if (!replyText.trim() || !replyingReview) return;

    setReviews((currentReviews) =>
      currentReviews.map((review) =>
        review.id === replyingReview.id
          ? {
              ...review,
              replied: true,
              reply: {
                author: 'Aruna K. (You)',
                date: 'Just now',
                content: replyText.trim(),
              },
            }
          : review
      )
    );

    setReplyingReview(null);
    setReplyText('');
  }

  function handleReport(review) {
    alert(`Report submitted for ${review.author}'s review.`);
  }

  return (
    <WorkerLayout>
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-8 flex items-center gap-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-emerald-700"
            aria-label="Go back"
          >
            <ArrowLeft size={26} />
          </button>

          <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Ratings & Reviews
          </h1>
        </div>

        <section className="mb-8 rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-3 md:divide-x md:divide-slate-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Reviews
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">127</p>
            </div>

            <div className="md:pl-10">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Average Rating
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                4.9{' '}
                <span className="text-base font-medium text-slate-400">/ 5</span>
              </p>
            </div>

            <div className="md:pl-10">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Recommendation Rate
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">98%</p>
            </div>
          </div>
        </section>

        <div className="mb-8 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`rounded-full border px-6 py-2.5 text-sm font-bold transition ${
                  active
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-6">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"
                    />

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-950">{review.author}</h3>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <RatingStars rating={review.rating} />

                        <span className="text-xs font-medium text-slate-400">
                          • {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {review.category}
                  </span>
                </div>

                <p className="text-[15px] leading-relaxed text-slate-600">
                  {review.content}
                </p>

                {review.replied && review.reply && (
                  <div className="mt-5 rounded-lg border-l-4 border-emerald-600 bg-slate-50 p-5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-emerald-700">
                        {review.reply.author} Replied:
                      </p>

                      <span className="text-xs text-slate-400">
                        {review.reply.date}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-600">
                      “{review.reply.content}”
                    </p>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => openReplyModal(review)}
                    disabled={review.replied}
                    className={`inline-flex items-center gap-2 text-sm font-bold transition ${
                      review.replied
                        ? 'cursor-not-allowed text-slate-400'
                        : 'text-emerald-700 hover:text-emerald-800'
                    }`}
                  >
                    <MessageCircle size={16} />
                    {review.replied ? 'Replied' : 'Reply'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReport(review)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-red-500"
                  >
                    <Flag size={16} />
                    Report
                  </button>
                </div>
              </article>
            ))}

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const active = currentPage === page;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-full border text-sm font-bold transition ${
                      active
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </section>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-xl border border-emerald-900/20 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-slate-950">
                Rating Breakdown
              </h2>

              <div className="mt-6 space-y-4">
                {ratingBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[56px_minmax(0,1fr)_34px] items-center gap-4"
                  >
                    <span className="text-sm font-bold text-slate-950">
                      {item.label}
                    </span>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    <span className="text-right text-sm font-medium text-slate-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-slate-200 pt-7">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Positive Feedback Highlights
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {feedbackHighlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {replyingReview && (
        <ReplyModal
          review={replyingReview}
          value={replyText}
          onChange={setReplyText}
          onClose={() => setReplyingReview(null)}
          onSubmit={submitReply}
        />
      )}
    </WorkerLayout>
  );
}