// File: ./frontend/src/utils/validation.js

// Validate order form
export const validateOrderForm = (formData) => {
  const errors = {};

  // Customer Name
  if (!formData.customerName || formData.customerName.trim().length < 2) {
    errors.customerName = 'Name must be at least 2 characters long';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }

  // Address
  if (!formData.address?.street || formData.address.street.trim().length < 5) {
    errors.street = 'Please enter a valid street address';
  }
  if (!formData.address?.city || formData.address.city.trim().length < 2) {
    errors.city = 'Please enter a valid city';
  }
  if (!formData.address?.state || formData.address.state.trim().length < 2) {
    errors.state = 'Please enter a valid state';
  }
  
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!formData.address?.pincode || !pincodeRegex.test(formData.address.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit pincode';
  }

  // Product and Quantity
  if (!formData.product) {
    errors.product = 'Please select a product';
  }
  if (!formData.quantity || formData.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1';
  }

  // Size validation
  if (formData.sizeType === 'standard') {
    if (!formData.standardSize) {
      errors.standardSize = 'Please select a size';
    }
  } else if (formData.sizeType === 'custom') {
    if (!formData.customMeasurements?.bust || formData.customMeasurements.bust < 20) {
      errors.chest = 'Please enter valid bust measurement';
    }
    if (!formData.customMeasurements?.length || formData.customMeasurements.length < 20) {
      errors.length = 'Please enter valid length measurement';
    }
    if (!formData.customMeasurements?.waist || formData.customMeasurements.waist < 20) {
      errors.waist = 'Please enter valid waist measurement';
    }
    if (!formData.customMeasurements?.shoulder || formData.customMeasurements.shoulder < 10) {
      errors.shoulder = 'Please enter valid shoulder measurement';
    }
  }

  // Payment screenshot
  if (!formData.paymentScreenshot) {
    errors.paymentScreenshot = 'Please upload payment screenshot';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate bulk enquiry form
// export const validateBulkEnquiryForm = (formData) => {
//   const errors = {};

//   // Company Name
//   if (!formData.companyName || formData.companyName.trim().length < 2) {
//     errors.companyName = 'Company name must be at least 2 characters long';
//   }

//   // Contact Person
//   if (!formData.contactPerson || formData.contactPerson.trim().length < 2) {
//     errors.contactPerson = 'Contact person name must be at least 2 characters long';
//   }

//   // Email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!formData.email || !emailRegex.test(formData.email)) {
//     errors.email = 'Please enter a valid email address';
//   }

//   // Phone
//   const phoneRegex = /^[6-9]\d{9}$/;
//   if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
//     errors.phone = 'Please enter a valid 10-digit phone number';
//   }

//   // Products
//   if (!formData.products || formData.products.length === 0) {
//     errors.products = 'Please select at least one product';
//   } else {
//     formData.products.forEach((product, index) => {
//       if (!product.quantity || product.quantity < 1) {
//         errors[`product_${index}_quantity`] = 'Quantity must be at least 1';
//       }
//     });
//   }

//   return {
//     isValid: Object.keys(errors).length === 0,
//     errors
//   };
// };

// Validate contact form
export const validateContactForm = (formData) => {
  const errors = {};

  // Name
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Subject
  if (!formData.subject || formData.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters long';
  }

  // Message
  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};