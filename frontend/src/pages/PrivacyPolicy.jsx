// File: ./frontend/src/pages/PrivacyPolicy.jsx

import React, { useEffect } from 'react';
import { scrollToTop } from '../utils/helpers';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="privacy-policy-page">
      <div className="container">
        <div className="policy-container">
          {/* Header */}
          <header className="policy-header">
            <h1 className="policy-title">Privacy Policy</h1>
            <p className="policy-subtitle">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
            <p className="last-updated">Last Updated: November 2024</p>
          </header>

          {/* Introduction */}
          <section className="policy-section">
            <p className="policy-intro">
              Thank you for visiting <strong>Corporatepehnawa.com</strong>. We value your trust and are committed to protecting your privacy and personal data. This Privacy Policy outlines how we collect, use, share, and protect the personal information you provide when interacting with Corporate Pehnawa. By using our website, you agree to the terms outlined below.
            </p>
          </section>

          {/* Contact Information */}
          <section className="policy-section contact-box">
            <h2 className="section-title">Contact Information</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please reach out to us:</p>
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

          {/* Section 1 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">1</span>
              What Information Do We Collect?
            </h2>
            <p>
              When you make a purchase from Corporate Pehnawa, we collect personal details necessary to complete your transaction, such as your name, address, email, and phone number. Additionally, when you browse our website, we automatically receive information like your device's IP address, which helps us improve your browsing experience.
            </p>
            <p>
              We may also collect information to send marketing emails, including product updates and promotional offers, with your consent.
            </p>
          </section>

          {/* Section 2 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">2</span>
              Consent
            </h2>
            
            <h3 className="subsection-title">How Do You Give Consent?</h3>
            <p>
              When you provide personal details to complete a transaction or contact us, you consent to the collection and use of your information for specific purposes, such as processing orders and providing customer support.
            </p>
            <p>
              We may also seek your consent for marketing communications. You can choose to opt out of receiving promotional messages at any time.
            </p>
            
            <h3 className="subsection-title">How Can You Withdraw Consent?</h3>
            <p>If you wish to withdraw your consent after opting in, you can do so by:</p>
            <ul className="policy-list">
              <li>Emailing us at <a href="mailto:corporatepehnawa@gmail.com" className="inline-link">corporatepehnawa@gmail.com</a></li>
              <li>Using the unsubscribe link in our marketing emails</li>
              <li>Contacting us via phone at +91 91662 13263</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">3</span>
              Information Disclosure
            </h2>
            <p>
              We value your privacy and do not sell or trade your personal information. However, we may share your data in the following situations:
            </p>
            
            <div className="disclosure-grid">
              <div className="disclosure-item">
                <h4 className="disclosure-title">Legal Requirements</h4>
                <p>If required by law or to protect Corporate Pehnawa's legal rights.</p>
              </div>
              
              <div className="disclosure-item">
                <h4 className="disclosure-title">Business Transfers</h4>
                <p>In the event of a business merger or sale, your information may be transferred to the new entity.</p>
              </div>
              
              <div className="disclosure-item">
                <h4 className="disclosure-title">Third-Party Service Providers</h4>
                <p>We collaborate with trusted service providers for payment processing, order fulfillment, and marketing support. These providers are bound by confidentiality agreements.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">4</span>
              Payment Security
            </h2>
            <p>
              Our payments are processed securely through trusted payment gateways. We do not store your financial information on our servers. All payment transactions are encrypted and handled by PCI-DSS compliant payment processors.
            </p>
          </section>

          {/* Section 5 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">5</span>
              Third-Party Services
            </h2>
            <p>
              Third-party service providers used by us only access your personal information as required to perform their services. These providers may have their own privacy policies regarding the information we share with them. We ensure all third-party providers maintain adequate security measures.
            </p>
          </section>

          {/* Section 6 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">6</span>
              Security Measures
            </h2>
            <p>
              To protect your data, we implement industry-standard security protocols to prevent unauthorized access, misuse, or alteration of your information. Our security measures include:
            </p>
            <ul className="policy-list">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication measures</li>
            </ul>
            <p className="highlight-text">
              In case of any data breach or security concern, please contact us at <a href="mailto:corporatepehnawa@gmail.com" className="inline-link">corporatepehnawa@gmail.com</a> immediately.
            </p>
          </section>

          {/* Section 7 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">7</span>
              Cookies
            </h2>
            <p>
              Cookies help us enhance your browsing experience by storing session data and preferences. You have the option to disable cookies through your browser settings, but this may impact website functionality and your user experience.
            </p>
          </section>

          {/* Section 8 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">8</span>
              Age Restriction
            </h2>
            <p>
              By using our website, you confirm that you are of legal age in your region or have received consent from a legal guardian to use our services. We do not knowingly collect information from individuals under the age of 18 without parental consent.
            </p>
          </section>

          {/* Section 9 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">9</span>
              Communications
            </h2>
            <p>
              You consent to receive communications from us by way of emails, phone calls, and SMS with respect to your transactions on our website. Users will be required to register their valid phone numbers and email addresses to facilitate such communication.
            </p>
            <p>
              We may also use your email address to send you updates, newsletters, changes to features of the service, and other information to provide you with better services. You can opt out of promotional communications at any time.
            </p>
          </section>

          {/* Section 10 */}
          <section className="policy-section">
            <h2 className="section-title">
              <span className="section-number">10</span>
              Changes to This Privacy Policy
            </h2>
            <p>
              Corporate Pehnawa reserves the right to modify this Privacy Policy at any time. Updates will be posted on this page, with the revised date mentioned at the top. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
            <p>
              Your continued use of our website after any changes to this policy constitutes your acceptance of the updated terms.
            </p>
          </section>

          {/* Footer */}
          {/* <footer className="policy-footer">
            <p>
              By using Corporate Pehnawa's services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
            <div className="footer-links">
              <a href="/contact" className="footer-link">Contact Us</a>
              <span className="separator">•</span>
              <a href="/terms" className="footer-link">Terms of Service</a>
            </div>
          </footer> */}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;