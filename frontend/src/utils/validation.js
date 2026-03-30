// Validation utilities
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.length >= 10;
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

export const validatePasswordStrength = (password) => {
  const strength = {
    score: 0,
    feedback: [],
  };

  if (password.length >= 6) strength.score++;
  else strength.feedback.push('At least 6 characters');

  if (password.length >= 12) strength.score++;
  else strength.feedback.push('At least 12 characters for stronger password');

  if (/[A-Z]/.test(password)) strength.score++;
  else strength.feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) strength.score++;
  else strength.feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) strength.score++;
  else strength.feedback.push('Include special characters');

  return strength;
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
    } else if (rule.type === 'email' && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (rule.type === 'phone' && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
    } else if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be at most ${rule.maxLength} characters`;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${field} is invalid`;
    }
  });

  return errors;
};

// Sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim();
};

// Number validation
export const isvalidAge = (age) => {
  const ageNum = parseInt(age);
  return ageNum > 0 && ageNum < 150;
};

export const validateConsultationFee = (fee) => {
  const feeNum = parseFloat(fee);
  return feeNum > 0;
};

// Date validation
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const isValidAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return appointmentDate >= today;
};
