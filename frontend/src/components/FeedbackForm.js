import React, { useState } from 'react';

import { feedbackAPI } from '../services/api';

const FeedbackForm = ({ onFeedbackSubmitted }) => {

  const [form, setForm] = useState({
    message: '',
    rating: 0
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    if (error) setError(null);
  };

  const handleRatingChange = (newRating) => {
    setForm(s => ({ ...s, rating: newRating }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!form.message.trim()) {
      setError("Please enter a message.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await feedbackAPI.submit({
        message: form.message,
        rating: Number(form.rating)
      });

      setSuccess(true);
      setForm({ message: '', rating: 0 });

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">We Value Your Voice</h2>
          <p className="text-slate-400 text-lg">Help us create a better experience for everyone.</p>
        </div>

        {success && (
          <div className="mb-6 rounded-xl bg-emerald-500/10 p-4 text-sm font-bold text-emerald-400 border border-emerald-500/20 text-center animate-bounce">
            Feedback Submitted Successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-rose-500/10 p-4 text-sm font-bold text-rose-400 border border-rose-500/20 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Interactive Rating */}
          <div className="flex flex-col items-center">
            <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">Rate Experience</label>
            <div className="flex gap-2 sm:gap-4 p-4 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoveredRating || form.rating);

                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingChange(star)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 transform group relative focus:outline-none ${isActive ? 'scale-110' : 'scale-100 hover:scale-110'
                      }`}
                  >
                    <svg
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${isActive ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-slate-700'
                        }`}
                      fill={isActive ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                );
              })}
            </div>
            <p className="h-6 mt-2 text-sm font-medium text-amber-400 transition-opacity duration-200">
              {hoveredRating ? (
                hoveredRating === 1 ? "Disappointed" :
                  hoveredRating === 2 ? "Could be better" :
                    hoveredRating === 3 ? "It was okay" :
                      hoveredRating === 4 ? "Good experience" : "Absolutely loved it!"
              ) : (form.rating > 0 ? (
                form.rating === 1 ? "Disappointed" :
                  form.rating === 2 ? "Could be better" :
                    form.rating === 3 ? "It was okay" :
                      form.rating === 4 ? "Good experience" : "Absolutely loved it!"
              ) : "")}
            </p>
          </div>

          {/* Message Area */}
          <div>
            <label htmlFor="message" className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide ml-1">Your Voice</label>
            <textarea
              name="message"
              id="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="block w-full rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-lg leading-relaxed shadow-inner"
              placeholder="Share your thoughts, suggestions, or appreciation..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-base font-black text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Sending...' : 'Send Feedback'}
                {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
