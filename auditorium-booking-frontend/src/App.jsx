import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import HodDashboard from './pages/HodDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';

const AppRoutes = ({ darkMode, toggleDark }) => {
  const { isAuthenticated, user } = useAuth();

  // Root redirect: if logged in, go to their dashboard
  const RootRedirect = () => {
    if (!isAuthenticated) return <LandingPage />;
    const routes = { student: '/dashboard/student', hod: '/dashboard/hod', admin: '/dashboard/admin' };
    return <Navigate to={routes[user?.role] || '/dashboard/student'} replace />;
  };

  return (
    <div className={`flex flex-col min-h-screen`}>
      <Navbar darkMode={darkMode} toggleDark={toggleDark} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/hod"
            element={
              <ProtectedRoute allowedRoles={['hod']}>
                <HodDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
        <AppRoutes darkMode={darkMode} toggleDark={toggleDark} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
