// API Configuration - Development vs Production
const isDevelopment = __DEV__;
export const API_CONFIG = {
  BASE_URL: 'http://217.196.51.104:4000/api',  // Use the web app's backend
  TIMEOUT: 15000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Helper function to get the full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 