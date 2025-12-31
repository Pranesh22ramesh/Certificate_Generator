import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthSelector, useAuthActions } from '../context/AppContext';

const Navbar = () => {
  const { isAuthenticated, user, userType } = useAuthSelector();
  const { logout } = useAuthActions();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Defined Navigation Links based on User Role
  const navLinks = userType === 'admin'
    ? [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Interns', path: '/admin/interns' },
      { name: 'Feedbacks', path: '/admin/feedbacks' },
    ]
    : isAuthenticated
      ? [
        { name: 'My Certificate', path: '/user/certificate' },
        { name: 'Give Feedback', path: '/user/feedback' }
      ]
      : [];

  const isActive = (path) => location.pathname === path;

  // Dynamic Styles based on Role - UPDATED FOR TEAL THEME
  const getNavStyles = () => {
    const base = "fixed top-0 left-0 right-0 z-50 transition-all duration-300";

    // Scrolled State
    if (isScrolled) {
      if (userType === 'admin') return `${base} bg-[#05161A]/95 backdrop-blur-xl border-b border-[#00C2FF]/30 py-3 shadow-lg shadow-[#00C2FF]/5`;
      if (userType === 'user') return `${base} bg-[#05161A]/95 backdrop-blur-xl border-b border-[#00C2FF]/30 py-3 shadow-lg shadow-[#00C2FF]/5`;
      return `${base} bg-[#05161A]/90 backdrop-blur-md border-b border-[#00C2FF]/10 py-3`;
    }

    // Default Top State
    if (isAuthenticated) {
      return `${base} bg-[#05161A]/50 backdrop-blur-sm border-b border-[#00C2FF]/10 py-4`;
    }

    // Public Home (Login Page)
    return `${base} bg-transparent py-5`;
  };

  return (
    <nav className={getNavStyles()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Custom Image-Inspired Logo: Overlapping Squares */}
              <div className="relative w-8 h-8">
                <div className="absolute top-0 left-0 w-5 h-5 bg-white rounded-[2px] shadow-sm z-10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#00C2FF] rounded-[2px] shadow-[0_0_15px_rgba(0,194,255,0.6)] transition-transform duration-300 group-hover:translate-y-0.5 group-hover:translate-x-0.5"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00C2FF] transition-colors">Twincord</span>

              {/* Role Badge */}
              {isAuthenticated && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ml-1 border text-[#00C2FF] border-[#00C2FF]/30 bg-[#00C2FF]/10">
                  {userType} Portal
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${isActive(link.path)
                      ? 'text-[#05161A] bg-[#00C2FF] shadow-[0_0_15px_rgba(0,194,255,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-sm font-bold text-white truncate max-w-[150px]">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-bold text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all duration-200 border border-rose-500/20 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-900/20"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;