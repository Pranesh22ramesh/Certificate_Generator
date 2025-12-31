import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { adminAPI } from '../services/api';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { authStart, authSuccess, authFailure } = useAppContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    authStart();

    try {
      const response = await adminAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response && response.success) {
        authSuccess({
          token: response.token,
          userType: 'admin',
          admin: response.admin
        });
        navigate('/admin/dashboard');
      } else {
        const errorMessage = response?.message || 'Invalid credentials';
        setError(errorMessage);
        authFailure(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Connection failed.';
      setError(errorMessage);
      authFailure(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans overflow-hidden items-stretch">

      {/* LEFT PANEL: Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-800 items-center justify-center overflow-hidden border-r border-slate-700/50">
        {/* Abstract Blobs */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 text-center px-16 max-w-2xl">
          <div className="mb-10 inline-flex p-6 rounded-3xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-2xl shadow-2xl shadow-black/20 animate-float">
            {/* Shield Icon */}
            <svg className="h-20 w-20 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">Control Center</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Secure gateway for managing intern records, verifying certificates, and overseeing system operations.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12 relative bg-slate-900">

        {/* Mobile Background Ambience */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[60px]"></div>
        </div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-white">System Login</h2>
            <p className="mt-2 text-slate-400 text-lg">Authenticate to access dashboard.</p>
          </div>

          {/* Form Container */}
          <div className="bg-slate-800/30 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none p-8 rounded-3xl border border-slate-700/50 lg:border-none lg:p-0 lg:shadow-none shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 flex items-start gap-3 animate-pulse">
                  <svg className="h-5 w-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Admin Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-500 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border border-slate-700 bg-slate-800/50 py-4 pl-11 text-white shadow-sm ring-0 placeholder:text-slate-600 focus:border-sky-500 focus:bg-slate-800 focus:ring-1 focus:ring-sky-500 sm:text-sm font-medium transition-all"
                      placeholder="admin@company.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-sky-500 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full rounded-xl border border-slate-700 bg-slate-800/50 py-4 pl-11 pr-12 text-white shadow-sm ring-0 placeholder:text-slate-600 focus:border-sky-500 focus:bg-slate-800 focus:ring-1 focus:ring-sky-500 sm:text-sm font-medium transition-all"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="h-4 w-4 text-sky-500 focus:ring-sky-500 border-slate-700 bg-slate-800 rounded transition-all cursor-pointer" />
                  <span className="ml-2 text-sm text-slate-500 group-hover:text-slate-400 font-medium">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors">Forgot Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:scale-[1.02] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-base">
                    Sign In to Dashboard
                    <svg className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                )}
              </button>

              <div className="pt-6 border-t border-slate-700/50 text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
                  <p className="text-slate-500 text-xs font-medium">Not an Admin?</p>
                  <Link to="/user/login" className="text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 group">
                    Intern Portal Login
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginForm;