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

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCmsPage } from './pages/admin/AdminCmsPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminAddProductPage } from './pages/admin/AdminAddProductPage';
import { AdminProductDetailPage } from './pages/admin/AdminProductDetailPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminCareersPage } from './pages/admin/AdminCareersPage';

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

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Portal Protected Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="cms" element={<AdminCmsPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminAddProductPage />} />
              <Route path="products/:id" element={<AdminProductDetailPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="careers" element={<AdminCareersPage />} />
            </Route>

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
