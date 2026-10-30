import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AuthProvider } from './context/AuthContext';
import { EnquiryAuthProvider } from './context/EnquiryAuthContext';
import { TopBar } from './components/layout/TopBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FranchiseEnquiryModal } from './components/modals/FranchiseEnquiryModal';
import { FloatingWhatsAppWidget } from './components/layout/FloatingWhatsAppWidget';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CareerPage } from './pages/CareerPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { ContactPage } from './pages/ContactPage';

// Customer Auth & Profile Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { UserProfilePage } from './pages/auth/UserProfilePage';

// Admin Portal Redirect to Dedicated Enterprise Portal
const ADMIN_PORTAL_URL = import.meta.env.VITE_ADMIN_PORTAL_URL || 'https://admin.zealpharmacure.com';

const AdminPortalRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = ADMIN_PORTAL_URL;
  }, []);
  return null;
};

import './App.css';

// Public Website Layout wrapper
const PublicLayout: React.FC = () => {
  return (
    <div className="app-wrapper">
      <TopBar />
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
      <FranchiseEnquiryModal />
      <FloatingWhatsAppWidget />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <EnquiryAuthProvider>
            <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:slug" element={<ProductDetailPage />} />
              <Route path="career" element={<CareerPage />} />
              <Route path="career/:slug" element={<JobDetailPage />} />
              <Route path="contact" element={<ContactPage />} />

              {/* Customer Authentication & Profile */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            {/* Admin Portal Redirects */}
            <Route path="/admin" element={<AdminPortalRedirect />} />
            <Route path="/admin/*" element={<AdminPortalRedirect />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </EnquiryAuthProvider>
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  );
};

export default App;
