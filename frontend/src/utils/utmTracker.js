// File: ./frontend/src/utils/utmTracker.js  (NEW)
// Reads UTM params from the URL and stores them in sessionStorage.
// Called once on app load in App.jsx.
// The checkout service reads these and sends them with the order.

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'cp_utm';

// Call this on every page load — captures UTM if present, preserves existing if not
export const captureUTM = () => {
  const params = new URLSearchParams(window.location.search);
  const hasUTM = UTM_PARAMS.some(p => params.has(p));

  if (hasUTM) {
    const utm = {};
    UTM_PARAMS.forEach(p => {
      if (params.has(p)) utm[p.replace('utm_', '')] = params.get(p);
    });
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  }
};

// Returns stored UTM object or null
export const getStoredUTM = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Clear after order is placed
export const clearUTM = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};