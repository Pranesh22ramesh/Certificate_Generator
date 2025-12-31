import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthSelector } from '../context/AppContext';

const RedirectHandler = () => {
  const { isAuthenticated, userType, authLoading } = useAuthSelector();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't do anything while auth state is loading
    if (authLoading) {
      return;
    }

    const from = location.state?.from?.pathname || (userType === 'admin' ? '/admin/dashboard' : '/user/certificate');

    // If user is authenticated, handle redirects
    if (isAuthenticated) {
      // If on a public page like home or a login page, redirect to their dashboard
      if (['/', '/admin/login', '/user/login'].includes(location.pathname)) {
        console.log(`🔄 Authenticated user on public page, redirecting to: ${from}`);
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, userType, authLoading, navigate, location]);

  // This component does not render anything
  return null;
};

export default RedirectHandler;
