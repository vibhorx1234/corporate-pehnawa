// File: ./frontend/src/App.jsx  (MODIFIED)
// Changes from previous version:
//   1. captureUTM() called on mount via useEffect
//   2. Admin routes added under /admin/* — all protected + adminOnly
//   3. AdminLayout wraps all admin pages
//   4. All previous routes unchanged

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { captureUTM } from './utils/utmTracker';

// Styles
import './styles/variables.css';
import './styles/theme.css';
import './styles/global.css';
import './App.css';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Pages — original
import Home from './pages/Home';
import Collections from './pages/Collections';
import CollectionProducts from './pages/CollectionProducts';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderPage from './pages/OrderPage';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Pages — auth + account + cart + checkout
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

// Pages — admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAbandonedCarts from './pages/admin/AdminAbandonedCarts';
import AdminRevenueAnalytics from './pages/admin/AdminRevenueAnalytics';
import AdminCustomerAnalytics from './pages/admin/AdminCustomerAnalytics';

import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

// UTM capture runs once on mount
const UTMCapture = () => {
  useEffect(() => { captureUTM(); }, []);
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <UTMCapture />
            <Routes>

              {/* ── Admin routes — own layout, no Navbar/Footer ── */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="abandoned-carts" element={<AdminAbandonedCarts />} />
                        <Route path="analytics/revenue" element={<AdminRevenueAnalytics />} />
                        <Route path="analytics/customers" element={<AdminCustomerAnalytics />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* ── Public + customer routes — with Navbar/Footer ── */}
              <Route
                path="*"
                element={
                  <div className="app">
                    <Navbar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/collections/:collectionSlug" element={<CollectionProducts />} />
                        <Route path="/product/:productSlug" element={<ProductDetailPage />} />
                        <Route path="/order/:productId" element={<OrderPage />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:blogSlug" element={<BlogPostPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />

                        {/* Auth */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

                        {/* Protected customer */}
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/account" element={
                          <ProtectedRoute><AccountPage /></ProtectedRoute>
                        } />
                        <Route path="/checkout" element={
                          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;