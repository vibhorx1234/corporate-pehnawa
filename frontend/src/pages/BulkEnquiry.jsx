// // File: ./frontend/src/pages/BulkEnquiry.jsx

// import React, { useEffect } from 'react';
// import BulkEnquiryForm from '../components/bulk/BulkEnquiryForm';
// import { scrollToTop } from '../utils/helpers';
// import './BulkEnquiry.css';

// const BulkEnquiry = () => {
//   useEffect(() => {
//     scrollToTop();
//   }, []);

//   return (
//     <div className="bulk-enquiry-page">
//       <div className="container">
//         {/* Page Header */}
//         <div className="bulk-header">
//           <h1 className="bulk-title">Bulk Order Enquiry</h1>
//           <p className="bulk-subtitle">
//             Get custom quotes for corporate orders and bulk purchases. We offer competitive pricing, 
//             flexible customization options, and dedicated support for your business needs.
//           </p>
//         </div>

//         {/* Benefits Section */}
//         <div className="bulk-benefits">
//           <div className="benefit-card">
//             <svg className="benefit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <h3>Competitive Pricing</h3>
//             <p>Get special bulk discounts and custom pricing for large orders</p>
//           </div>

//           <div className="benefit-card">
//             <svg className="benefit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
//             </svg>
//             <h3>Custom Branding</h3>
//             <p>Add your company logo and custom designs to your orders</p>
//           </div>

//           <div className="benefit-card">
//             <svg className="benefit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <h3>Fast Turnaround</h3>
//             <p>Quick processing and reliable delivery for your bulk orders</p>
//           </div>

//           <div className="benefit-card">
//             <svg className="benefit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//             </svg>
//             <h3>Dedicated Support</h3>
//             <p>Personal account manager for all your bulk order needs</p>
//           </div>
//         </div>

//         {/* Form Section */}
//         <div className="bulk-form-section">
//           <BulkEnquiryForm />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BulkEnquiry;