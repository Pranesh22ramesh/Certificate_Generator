import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAuthSelector } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import UserLogin from './pages/UserLogin';
import AdminDashboard from './pages/AdminDashboard';
import InternManagement from './pages/InternManagement';
import AddIntern from './pages/AddIntern';
import EditIntern from './pages/EditIntern';
import UserCertificate from './pages/UserCertificate';
import NotFound from './pages/NotFound';
import RedirectHandler from './components/RedirectHandler';
import Chatbot from './components/Chatbot';
import './index.css';
import UserFeedback from './pages/UserFeedback';
import FeedbackThanks from './pages/FeedbackThanks';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminFeedbacks from './pages/AdminFeedbacks';
import VerifyCertificate from './pages/VerifyCertificate';

const AppRoutes = () => {
  const { isAuthenticated, userType } = useAuthSelector();

  return (
    <Routes>
      {/* Public routes */}
      {/* Make Login the Landing Page */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={userType === 'admin' ? "/admin/dashboard" : "/user/certificate"} />
        ) : (
          <UserLogin />
        )
      } />

      {/* If authenticated, redirect from login pages */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={userType === 'admin' ? "/admin/dashboard" : "/user/certificate"} />
          ) : (
            <UserLogin />
          )
        }
      />
      <Route
        path="/admin/login"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/user/login"
        element={<Navigate to="/login" replace />}
      />

      {/* Admin protected routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/interns"
        element={
          <ProtectedRoute requiredUserType="admin">
            <InternManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedbacks"
        element={
          <ProtectedRoute requiredUserType="admin">
            <AdminFeedbacks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-intern"
        element={
          <ProtectedRoute requiredUserType="admin">
            <AddIntern />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRoute requiredUserType="admin">
            <EditIntern />
          </ProtectedRoute>
        }
      />

      {/* User protected routes */}
      <Route
        path="/user/certificate"
        element={
          <ProtectedRoute requiredUserType="user">
            <UserCertificate />
          </ProtectedRoute>
        }
      />
      <Route path="/user/feedback" element={<UserFeedback />} />
      <Route path="/user/feedback/thanks" element={<FeedbackThanks />} />

      {/* Public pages */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify" element={<VerifyCertificate />} />

      {/* Redirects */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/user" element={<Navigate to="/user/certificate" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <RedirectHandler />
        <div className="min-h-screen bg-slate-900 text-white font-sans">
          <Navbar />
          <AppRoutes />
          <Chatbot />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;