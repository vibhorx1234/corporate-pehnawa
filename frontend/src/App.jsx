// File: ./frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Styles
import './styles/variables.css';
import './styles/theme.css';
import './styles/global.css';
import './App.css';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Collections from './pages/Collections';
import CollectionProducts from './pages/CollectionProducts';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderPage from './pages/OrderPage';
// import BulkEnquiry from './pages/BulkEnquiry';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:collectionSlug" element={<CollectionProducts />} />
              <Route path="/product/:productSlug" element={<ProductDetailPage />} />
              <Route path="/order/:productId" element={<OrderPage />} />
              {/* <Route path="/bulk-enquiry" element={<BulkEnquiry />} /> */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:blogSlug" element={<BlogPostPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;