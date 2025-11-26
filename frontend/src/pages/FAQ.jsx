import React from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "You can place your order directly on our <strong>website</strong>, or simply DM us on <strong>Instagram</strong> or <strong>WhatsApp</strong> with your chosen print + size. Once payment is done, we'll craft and ship your order within <strong>4–6 business days</strong> ✨<br><br>Thank you for supporting our small, growing brand! 🌸"
    },
    {
      id: 2,
      question: "What sizes do you offer?",
      answer: "We offer S, M, L, XL — but we're also size inclusive 🤍. We'd be more than happy to customise your fit at no extra charge. Every body is unique, and we'll make sure your Corporate Pehnawa fits you just right 🧵✨ Can't wait to see you make it your own!"
    },
    {
      id: 3,
      question: "How can I pay?",
      answer: "Since we're small and growing, we currently accept payments only via UPI (GPay/Paytm/PhonePe). We'll share our UPI ID once your order is confirmed. Quick, safe, and hassle-free ✨"
    },
    {
      id: 4,
      question: "Where do you ship?",
      answer: "We currently ship across India at zero cost! Shipping timelines may vary a little based on your location, but we'll share tracking details once your order is on its way."
    },
    {
      id: 5,
      question: "Can I return/exchange?",
      answer: "Since every piece is made to order, we don't accept returns or cancellations. But if you receive a wrong or a damaged piece, we'll make it right with an exchange (just keep an unboxing video handy 🪄)."
    }
  ];

  return (
    <div className="faq-page">
      <div className="container">
        {/* Header Section */}
        <div className="faq-header">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Got questions? We've got answers! Find everything you need to know about ordering, 
            sizing, payments, and shipping.
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-container">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <div className="faq-question">
                <span className="faq-number">{faq.id}</span>
                <h3>{faq.question}</h3>
              </div>
              <p className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="faq-contact">
          <h2 className="faq-contact-title">Still have questions?</h2>
          <p className="faq-contact-text">
            We're here to help! Feel free to reach out to us via WhatsApp or our contact page, 
            and we'll get back to you as soon as possible.
          </p>
          <div className="faq-contact-buttons">
            <a 
              href="https://wa.me/919876543210?text=Hi%20Corporate%20Pehnawa%2C%20I%20have%20a%20question%20regarding..." 
              target="_blank" 
              rel="noopener noreferrer"
              className="faq-contact-btn contact"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Whatsapp us
            </a>
            <Link 
              to="/contact"
              className="faq-contact-btn contact"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;