// File: ./frontend/src/pages/TermsOfService.jsx

import React, { useEffect } from 'react';
import { scrollToTop } from '../utils/helpers';
import './TermsOfService.css';

const TermsOfService = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="terms-page">
      <div className="container">
        <div className="terms-container">
          {/* Header */}
          <header className="terms-header">
            <h1 className="terms-title">Terms and Conditions</h1>
            <p className="terms-subtitle">
              Please read these terms carefully before using our services
            </p>
            <p className="last-updated">Last Updated: November 2025</p>
          </header>

          {/* Introduction */}
          <section className="terms-section">
            <p className="terms-intro">
              Welcome to <strong>Corporate Pehnawa</strong>! By using our website, <a href="https://www.corporatepehnawa.com" className="inline-link" target="_blank" rel="noopener noreferrer">www.corporatepehnawa.com</a>, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree with these terms, you should not use this Site.
            </p>
          </section>

          {/* General Information */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              General Information
            </h2>
            <p>
              The Site is operated by Corporate Pehnawa. These Terms of Service govern your use of the Site and all services offered on it. By accessing or using the Site, you confirm that you are at least 18 years old or have obtained parental consent if under 18.
            </p>
            <div className="info-box">
              <p><strong>Important:</strong> Your continued use of our services constitutes acceptance of these terms and any future modifications.</p>
            </div>
          </section>

          {/* Account Creation */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Account & Orders
            </h2>
            <p>
              To make a purchase, you do not need to create an account. However, you agree to provide accurate, complete, and up-to-date information during the ordering process. You are responsible for all activities conducted under your purchase.
            </p>
            <ul className="terms-list">
              <li>Provide truthful and accurate personal information</li>
              <li>Maintain the security of your payment information</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all orders placed</li>
            </ul>
          </section>

          {/* Products and Services */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">👔</span>
              Products and Services
            </h2>
            <p>
              All products are made to order, and availability is subject to fabric stock at the time of order. We strive for accuracy in product descriptions and images, but please note:
            </p>
            <div className="highlight-grid">
              <div className="highlight-item">
                <h4>Product Variations</h4>
                <p>Minor variations may occur due to screen settings, lighting conditions, or fabric batch differences.</p>
              </div>
              <div className="highlight-item">
                <h4>Custom Orders</h4>
                <p>Custom-made products require 7-10 business days for production and cannot be cancelled once production begins.</p>
              </div>
              <div className="highlight-item">
                <h4>Pricing</h4>
                <p>Prices are subject to change without notice. The price at the time of order placement will be honored.</p>
              </div>
            </div>
          </section>

          {/* Returns and Exchanges */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">🔄</span>
              Returns and Exchanges
            </h2>
            <p>
              Please refer to our <a href="/faq" className="inline-link">FAQ page</a> for complete details regarding returns and exchanges. By placing an order, you agree to the terms outlined in our return policy.
            </p>
            <div className="note-box">
              <strong>Note:</strong> Custom-made products and items marked as "Final Sale" are not eligible for returns or exchanges unless defective.
            </div>
          </section>

          {/* Payment and Billing */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">💳</span>
              Payment and Billing
            </h2>
            <p>
              Payments must be made in full at the time of purchase through the payment methods available on the Site. We accept the following payment methods:
            </p>
            <ul className="terms-list">
              <li>UPI (PhonePe, Google Pay, Paytm, etc.)</li>
              {/* <li>Credit/Debit Cards</li>
              <li>Net Banking</li>
              <li>Digital Wallets</li> */}
            </ul>
            <p className="warning-text">
              <strong>Important:</strong> Corporate Pehnawa reserves the right to cancel any order if payment is not completed or verified. Proof of payment (screenshot) must be provided for UPI transactions.
            </p>
          </section>

          {/* Shipping */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">📦</span>
              Shipping and Delivery
            </h2>
            <p>
              Orders will be shipped to the address provided during checkout. Please ensure your shipping address is accurate and complete.
            </p>
            <div className="shipping-info">
              <div className="shipping-item">
                <strong>Standard Delivery:</strong>
                <p>3-5 business days for standard sizes</p>
              </div>
              <div className="shipping-item">
                <strong>Custom Orders:</strong>
                <p>7-10 business days plus shipping time</p>
              </div>
              <div className="shipping-item">
                <strong>Tracking:</strong>
                <p>Provided via email once order is shipped</p>
              </div>
            </div>
            <p className="disclaimer-text">
              Corporate Pehnawa is not responsible for delays, damages, or loss caused during shipping by third-party carriers. Please contact the shipping provider directly for such issues.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">©️</span>
              Intellectual Property
            </h2>
            <p>
              All content on the Site, including images, designs, text, logos, and graphics, is the property of Corporate Pehnawa and is protected by copyright laws.
            </p>
            <div className="warning-box">
              <p><strong>You may not:</strong></p>
              <ul className="terms-list">
                <li>Copy, reproduce, or distribute any content without prior written consent</li>
                <li>Use our brand name, logos, or designs for commercial purposes</li>
                <li>Modify or create derivative works from our content</li>
                <li>Remove or alter any copyright notices</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">⛔</span>
              Prohibited Activities
            </h2>
            <p>When using the Site, you agree not to:</p>
            <ul className="terms-list prohibited-list">
              <li>Violate any applicable laws or regulations</li>
              <li>Use the Site for any fraudulent or unlawful activity</li>
              <li>Interfere with the operation of the Site or attempt to bypass security features</li>
              <li>Transmit any viruses, malware, or harmful code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape, crawl, or harvest data from the Site</li>
              <li>Impersonate any person or entity</li>
              <li>Post false, misleading, or defamatory content</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">⚖️</span>
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Corporate Pehnawa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="terms-list">
              <li>Your use or inability to use the Site or services</li>
              <li>The purchase or use of products</li>
              <li>Unauthorized access to your data</li>
              <li>Errors or omissions in content</li>
              <li>Third-party conduct or content</li>
            </ul>
          </section>

          {/* Changes to Terms */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">🔄</span>
              Changes to the Terms
            </h2>
            <p>
              We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of the Site constitutes your acceptance of the revised terms. We recommend reviewing this page periodically to stay informed of any changes.
            </p>
          </section>

          {/* Governing Law */}
          <section className="terms-section">
            <h2 className="section-title">
              <span className="section-icon">⚖️</span>
              Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Jaipur.
            </p>
          </section>

          {/* Contact */}
          <section className="terms-section contact-section">
            <h2 className="section-title">
              <span className="section-icon">📧</span>
              Contact Information
            </h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href="mailto:corporatepehnawa@gmail.com" className="contact-link">
                  corporatepehnawa@gmail.com
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <a href="tel:+919166213263" className="contact-link">
                  +91 91662 13263
                </a>
              </div>
            </div>
          </section>

          {/* Footer */}
          {/* <footer className="terms-footer">
            <p className="thank-you">
              Thank you for choosing <strong>Corporate Pehnawa</strong>
            </p>
            <div className="footer-links">
              <a href="/contact" className="footer-link">Contact Us</a>
              <span className="separator">•</span>
              <a href="/privacy" className="footer-link">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="/faq" className="footer-link">FAQ</a>
            </div>
          </footer> */}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;