import React, { useEffect, useState } from 'react';
import { feedbackAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await feedbackAPI.getAll();
      if (res.success) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch feedbacks');
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
        // Remove from local state
        setFeedbacks(prev => prev.filter(f => f._id !== id));
      }
    } catch (err) {
      alert("Failed to delete feedback: " + err.message);
    }
  };

  const filteredFeedbacks = feedbacks.filter(f =>
    (f.intern?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feedback Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage intern feedback ({feedbacks.length} total)</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 w-full md:w-64"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No feedbacks found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFeedbacks.map((f) => (
              <motion.div
                key={f._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="bg-white border boundary-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                      {f.intern?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{f.intern?.name || 'Unknown Intern'}</h3>
                      <p className="text-xs text-slate-500">{f.intern?.internId}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-amber-50 px-2 py-1 rounded text-amber-700 text-xs font-bold gap-1 border border-amber-100">
                    <span>{f.rating}</span>
                    <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  </div>
                </div>

                <div className="flex-1 mb-4">
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">"{f.message}"</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{new Date(f.createdAt).toLocaleDateString()}</span>

                  <button
                    onClick={() => handleDelete(f._id)}
                    className="text-white bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm shadow-rose-200 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;
