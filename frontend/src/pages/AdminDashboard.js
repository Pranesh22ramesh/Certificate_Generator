import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { internAPI } from '../services/api';

// Neat SVG Icons - Updated colors for Dark Mode
const Icons = {
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Active: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      setLoading(true);
      const response = await internAPI.getAll();
      if (response && response.success && response.data) {
        setInterns(response.data.interns || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch interns data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this intern record permanently?')) {
      try {
        await internAPI.delete(id);
        setInterns(interns.filter(i => i._id !== id));
      } catch (err) {
        alert('Failed to delete: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  // Logic: Stats
  const stats = {
    total: interns.length,
    active: interns.filter(i => i.status === 'Active').length,
    completed: interns.filter(i => i.status === 'Completed').length,
  };

  // Logic: Filter
  const filteredInterns = interns.filter(intern => {
    const matchesStatus = statusFilter === 'all' || intern.status === statusFilter;
    const matchesSearch = (intern.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (intern.internId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (intern.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return (
    <div className="page-container flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in-down">
          <div>
            <h1 className="heading-xl">Admin Dashboard</h1>
            <p className="text-muted mt-1 text-lg">
              Manage intern records, certificates, and status.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/add-intern')}
            className="btn-primary shadow-[0_0_20px_rgba(14,165,233,0.3)] animate-float hover:scale-105 transition-transform"
          >
            <Icons.Plus />
            <span>Add New Intern</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm font-bold text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="animate-fade-in-up delay-100">
            <StatCard title="Total Interns" value={stats.total} icon={<Icons.Users />} color="blue" />
          </div>
          <div className="animate-fade-in-up delay-200">
            <StatCard title="Active Now" value={stats.active} icon={<Icons.Active />} color="emerald" />
          </div>
          <div className="animate-fade-in-up delay-300">
            <StatCard title="Certificates Issued" value={stats.completed} icon={<Icons.Check />} color="purple" />
          </div>
        </div>

        {/* Filters & Search */}
        <div className="card p-4 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center animate-fade-in-up delay-300">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Icons.Search />
            </div>
            <input
              type="text"
              className="input-field pl-10 transition-all focus:scale-[1.01]"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-700">
            {['all', 'Active', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${statusFilter === status
                  ? 'bg-slate-700 text-white shadow-lg scale-105'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Main Table */}
        <div className="card overflow-hidden animate-fade-in-up delay-400">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Intern Profile</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Department</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400">Joined Date</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredInterns.length > 0 ? (
                  filteredInterns.map((intern) => (
                    <tr key={intern._id} className="hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center text-sky-400 font-bold text-sm shadow-inner">
                            {(intern.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-sky-400 transition-colors">{intern.name}</p>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">{intern.internId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-md border border-slate-700 shadow-sm inline-block">
                          {intern.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={intern.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-400">
                          {intern.startDate ? new Date(intern.startDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEdit(intern._id)}
                            className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Icons.Edit />
                          </button>
                          <button
                            onClick={() => handleDelete(intern._id)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <Icons.Search />
                        <p>No interns found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// Utils
const StatCard = ({ title, value, color, icon }) => {
  const styles = {
    blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/10'
  };
  const activeStyle = styles[color] || styles.blue;

  return (
    <div className={`card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 border-l-4 ${color === 'blue' ? 'border-l-sky-500' : color === 'emerald' ? 'border-l-emerald-500' : 'border-l-purple-500'}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${activeStyle}`}>
        {icon}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    Completed: 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(14,165,233,0.2)]',
    Terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
      {status === 'Active' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>}
      {status}
    </span>
  );
};

export default AdminDashboard;