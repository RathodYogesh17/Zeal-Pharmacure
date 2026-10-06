import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminLayout } from './pages/AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminAddProductPage } from './pages/AdminAddProductPage';
import { AdminProductDetailPage } from './pages/AdminProductDetailPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminEnquiriesPage } from './pages/AdminEnquiriesPage';
import { AdminCareersPage } from './pages/AdminCareersPage';
import { AdminCmsPage } from './pages/AdminCmsPage';
import { AdminGalleryPage } from './pages/AdminGalleryPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Login Routes */}
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Portal Protected Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminAddProductPage />} />
              <Route path="products/edit/:id" element={<AdminAddProductPage />} />
              <Route path="products/:id" element={<AdminProductDetailPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage pageMode="all" />} />
              <Route path="product-enquiries" element={<AdminEnquiriesPage pageMode="product" />} />
              <Route path="stockist-enquiries" element={<AdminEnquiriesPage pageMode="franchise" />} />
              <Route path="career-enquiries" element={<AdminEnquiriesPage pageMode="career" />} />
              <Route path="careers" element={<AdminCareersPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="cms" element={<AdminCmsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Direct convenience routes (e.g. /products -> /admin/products) */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/products" element={<Navigate to="/admin/products" replace />} />
            <Route path="/categories" element={<Navigate to="/admin/categories" replace />} />
            <Route path="/enquiries" element={<Navigate to="/admin/enquiries" replace />} />
            <Route path="/product-enquiries" element={<Navigate to="/admin/product-enquiries" replace />} />
            <Route path="/stockist-enquiries" element={<Navigate to="/admin/stockist-enquiries" replace />} />
            <Route path="/career-enquiries" element={<Navigate to="/admin/career-enquiries" replace />} />
            <Route path="/careers" element={<Navigate to="/admin/careers" replace />} />
            <Route path="/gallery" element={<Navigate to="/admin/gallery" replace />} />
            <Route path="/users" element={<Navigate to="/admin/users" replace />} />
            <Route path="/cms" element={<Navigate to="/admin/cms" replace />} />
            <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

            {/* Root redirect to /admin */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </SiteSettingsProvider>
    </AuthProvider>
  );
};

export default App;
