import React, { useState, useEffect } from 'react';
import FeedbackForm from '../components/FeedbackForm';
import { feedbackAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';

const UserFeedback = () => {
  const { user, userType } = useAppContext();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      // Use getAll() which is now PUBLIC (authenticated) list
      const response = await feedbackAPI.getAll();
      if (response.success) {
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error("Failed to load feedbacks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const res = await feedbackAPI.delete(id);
      if (res.success) {
        fetchFeedbacks(); // Refresh list
      }
    } catch (error) {
      alert(error.message || "Failed to delete feedback");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden pt-24 pb-12 font-sans">
      {/* Background Blobs (Premium Dark Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[80%] w-[300px] h-[300px] bg-sky-600/20 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Feedback</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Join the conversation. Share your experience and see what others are saying about our program.
          </p>
        </div>

        {/* Input Form */}
        <div className="mb-16">
          <FeedbackForm onFeedbackSubmitted={fetchFeedbacks} />
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-sky-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.5)]"></span>
            Recent Reviews
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-white/5">
              <p className="text-slate-400">No feedback yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {feedbacks.map((item) => (
                <div key={item._id} className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg`}>
                        {item.intern?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm tracking-wide">
                          {item.intern?.name || 'Unknown User'}
                          {user?._id === item.intern?._id && <span className="ml-2 text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-white/10">YOU</span>}
                        </h3>
                        <p className="text-xs text-sky-400/80 font-medium uppercase tracking-wider">{item.intern?.department || 'Intern'}</p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500 font-mono mt-1 text-right">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="mb-4 pl-1">
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= item.rating ? 'text-amber-400 fill-current drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]' : 'text-slate-700'}`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={star <= item.rating ? 0 : 2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{item.message}</p>
                  </div>

                  {/* Delete Action (Condition: Own Feedback OR Admin) */}
                  {(userType === 'admin' || (user?._id === item.intern?._id) || (user?.internId === item.intern?.internId)) && (
                    <div className="flex justify-end pt-4 border-t border-white/5 mt-4">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/80 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 group-hover:opacity-100 opacity-60 bg-rose-500/10 border border-rose-500/20"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
