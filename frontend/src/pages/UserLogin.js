import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { authAPI } from '../services/api';

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { authSuccess, authFailure, authStart } = useAppContext();

  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.loginId.trim() || !formData.password.trim()) {
      setError('Please provide Login ID and Password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      authStart();

      const response = await authAPI.login({
        loginId: formData.loginId,
        password: formData.password
      });

      if (response.success) {
        authSuccess({
          token: response.token,
          userType: response.userType,
          intern: response.userType === 'user' ? response.user : null,
          admin: response.userType === 'admin' ? response.user : null
        });

        if (response.userType === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/certificate');
        }
      } else {
        const msg = response.message || 'Login failed';
        setError(msg);
        authFailure(msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      authFailure(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#05161A] text-slate-100 font-sans overflow-hidden">

      {/* LEFT PANEL: Corporate Branding (60% width) */}
      <div className="hidden lg:flex w-[60%] relative bg-[#071E26] border-r border-[#00C2FF]/10 items-center justify-center p-16">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#05161A]/80 via-transparent to-[#00C2FF]/5 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 max-w-xl animate-fade-in-right delay-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-7 h-7 bg-white rounded-[2px] shadow-sm z-10"></div>
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#00C2FF] rounded-[2px] shadow-[0_0_15px_rgba(0,194,255,0.6)]"></div>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">Twincord</span>
          </div>

          <h1 className="text-6xl font-black tracking-tight leading-[1.1] mb-8 text-white">
            Engineering <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-white">Excellence.</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-[#00C2FF] pl-6">
            Welcome to the Twincord Professional Portal. Secure access for employees, interns, and administrators to manage certifications and project workflows.
          </p>

          <div className="mt-12 flex gap-4 text-xs font-bold uppercase tracking-widest text-[#00C2FF]">
            <span>Secure</span> • <span>Encrypted</span> • <span>Verified</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login Form (40% width) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-6 bg-[#05161A] relative">
        <div className="w-full max-w-md animate-fade-in-up">

          <div className="text-center mb-10 lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400 text-sm">Access your Twincord account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-scale-in">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="delay-100 animate-fade-in-up">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Login ID</label>
                <input
                  type="text"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a252c] border border-[#1a3d48] text-white rounded-xl px-4 py-3.5 focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] outline-none transition-all placeholder-slate-600 font-medium hover:bg-[#0c2d36]"
                  placeholder="Email or Intern ID"
                />
              </div>

              <div className="delay-200 animate-fade-in-up">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-[#0a252c] border border-[#1a3d48] text-white rounded-xl px-4 py-3.5 focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] outline-none transition-all placeholder-slate-600 font-medium pr-10 hover:bg-[#0c2d36]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C2FF] hover:brightness-110 text-[#05161A] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,194,255,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 mt-4 delay-300 animate-fade-in-up"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
            </button>

            <div className="text-center mt-8 delay-400 animate-fade-in-up">
              <button type="button" className="text-sm text-slate-500 hover:text-[#00C2FF] transition-colors bg-transparent border-none cursor-pointer underline">Issues logging in? Contact Support</button>
            </div>
          </form>
        </div>

        <div className="absolute bottom-6 text-center text-[10px] text-slate-600 uppercase tracking-widest w-full">
          © 2024 Twincord Technologies.
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;