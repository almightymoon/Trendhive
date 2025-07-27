// API Configuration - Development vs Production
const isDevelopment = __DEV__;

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'http://192.168.1.3:4001/api'  // Local development backend
    : 'https://trendhive-backend.onrender.com/api', // Production cloud backend
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