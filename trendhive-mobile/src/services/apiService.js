import axios from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG } from '../config/api';
import cacheService from './cacheService';

class ApiService {
  constructor() {
    console.log('API Service: Initializing with base URL:', API_CONFIG.BASE_URL);
    console.log('API Service: Development mode:', __DEV__);
    console.log('API Service: Platform:', Platform.OS);
    console.log('API Service: Full config:', API_CONFIG);
    
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    // Add request interceptor to include auth token and logging
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.params);
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors and logging
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url, response.data);
        return response.data;
      },
      (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data, error.message);
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: error.config
        });
        
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.authToken = null;
        }
        
        // Return the error data if available, otherwise return the error message
        const errorData = error.response?.data || error.message || 'Network error';
        return Promise.reject(errorData);
      }
    );
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  // Test API connectivity
  async testConnection() {
    try {
      console.log('API Service: Testing connection to:', API_CONFIG.BASE_URL);
      console.log('API Service: Development mode:', __DEV__);
      console.log('API Service: Platform:', Platform.OS);
      
      const response = await this.api.get('/health');
      console.log('API Service: Connection test successful:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('API Service: Connection test failed:', error);
      console.error('API Service: Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
        code: error.code,
        errno: error.errno
      });
      
      // Additional debugging for network issues
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        console.error('API Service: Network error detected - possible firewall or DNS issue');
      }
      
      return { success: false, error };
    }
  }

  // Authentication
  async signIn(email, password) {
    console.log('API Service: signIn called with:', { email, password: password ? '[HIDDEN]' : 'MISSING' });
    console.log('API Service: Making POST request to:', `${API_CONFIG.BASE_URL}/auth/signin`);
    
    try {
      const response = await this.api.post('/auth/signin', { email, password });
      console.log('API Service: signIn response:', response);
      return response;
    } catch (error) {
      console.error('API Service: signIn error:', error);
      console.error('API Service: signIn error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  async signUp(userData) {
    return this.api.post('/auth/signup', userData);
  }

  // Products - using public route for better accessibility
  async getProducts(params = {}) {
    console.log('API Service: Calling /products endpoint with params:', params);
    
    // Create cache key based on params
    const cacheKey = `products_${JSON.stringify(params)}`;
    
    // Try to get from cache first
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log('API Service: Returning cached products data');
      return cachedData;
    }
    
    // If not in cache, fetch from API
    const data = await this.api.get('/products', { params });
    
    // Cache the result for 15 minutes
    await cacheService.set(cacheKey, data, 15 * 60 * 1000);
    
    return data;
  }

  async getProduct(id) {
    console.log('API Service: Calling /products endpoint for product ID:', id);
    
    // Try to get from cache first
    const cacheKey = `product_${id}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log('API Service: Returning cached product data');
      return cachedData;
    }
    
    // If not in cache, fetch from API
    const data = await this.api.get(`/products?id=${id}`);
    
    // Cache the result for 30 minutes
    await cacheService.set(cacheKey, data, 30 * 60 * 1000);
    
    return data;
  }

  async getFeaturedProducts() {
    console.log('API Service: Calling /products endpoint for featured products');
    
    // Try to get from cache first
    const cacheKey = 'featured_products';
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log('API Service: Returning cached featured products data');
      return cachedData;
    }
    
    // If not in cache, fetch from API
    const data = await this.api.get('/products', { params: { featured: true } });
    
    // Cache the result for 20 minutes
    await cacheService.set(cacheKey, data, 20 * 60 * 1000);
    
    return data;
  }

  // Cart
  async getCart() {
    return this.api.get('/cart');
  }

  async addToCart(productId, quantity) {
    return this.api.post('/cart', { productId, quantity });
  }

  async updateCartItem(productId, quantity) {
    return this.api.put(`/cart/${productId}`, { quantity });
  }

  async removeFromCart(productId) {
    return this.api.delete(`/cart/${productId}`);
  }

  // Orders
  async createOrder(orderData) {
    return this.api.post('/orders', orderData);
  }

  async getOrders(userId) {
    return this.api.get('/orders', { params: { userId } });
  }

  async deleteOrder(orderId, userId) {
    return this.api.post('/orders', { action: 'delete', orderId, userId });
  }

  async getOrder(id) {
    return this.api.get(`/orders/${id}`);
  }

  async confirmOrder(orderId) {
    return this.api.post(`/orders/confirm/${orderId}`);
  }

  // Profile
  async getProfile() {
    return this.api.get('/profile');
  }

  async updateProfile(profileData) {
    return this.api.put('/profile', profileData);
  }

  async changePassword(passwordData) {
    return this.api.patch('/profile', passwordData);
  }

  // Addresses
  async getAddresses(userId) {
    return this.api.get('/addresses');
  }

  async addAddress(addressData) {
    return this.api.post('/addresses', addressData);
  }

  async updateAddress(addressId, addressData) {
    return this.api.put('/addresses', { addressId, ...addressData });
  }

  async deleteAddress(addressId, userId) {
    return this.api.delete('/addresses', { data: { addressId, userId } });
  }

  // Notifications
  async getNotificationSettings(userId) {
    return this.api.get('/notifications/settings', { params: { userId } });
  }

  async updateNotificationSettings(settings) {
    return this.api.put('/notifications/settings', settings);
  }

  // Checkout
  async createStripePaymentIntent(amount) {
    return this.api.post('/checkout/stripe', { amount });
  }

  async createPayPalOrder(orderData) {
    return this.api.post('/paypal/create_order', orderData);
  }

  // Admin (if user is admin)
  async getAdminStats() {
    return this.api.get('/admin/stats');
  }

  async getAdminOrders() {
    return this.api.get('/admin/orders');
  }

  async getAdminProducts() {
    return this.api.get('/admin/products');
  }

  async getAdminUsers() {
    return this.api.get('/admin/users');
  }

  // Reviews
  async submitReview(reviewData) {
    console.log('API Service - submitReview called with:', reviewData);
    console.log('API Service - Current auth token:', this.authToken ? 'Present' : 'Missing');
    console.log('API Service - Base URL:', API_CONFIG.BASE_URL);
    console.log('API Service - Is editing review:', !!reviewData.reviewId);
    
    try {
      const response = await this.api.post('/reviews', reviewData);
      console.log('API Service - submitReview response:', response);
      return response;
    } catch (error) {
      console.error('API Service - submitReview error:', error);
      console.error('API Service - Error type:', typeof error);
      console.error('API Service - Error keys:', Object.keys(error || {}));
      console.error('API Service - Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  async getProductReviews(productId) {
    return this.api.get('/reviews', { params: { productId } });
  }

  async getUserReviews(userId) {
    console.log('API Service - getUserReviews called with userId:', userId);
    console.log('API Service - Current auth token:', this.authToken ? 'Present' : 'Missing');
    console.log('API Service - Base URL:', API_CONFIG.BASE_URL);
    try {
      const response = await this.api.get('/reviews', { params: { userId } });
      console.log('API Service - getUserReviews response:', response);
      return response;
    } catch (error) {
      console.error('API Service - getUserReviews error:', error);
      console.error('API Service - Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  async deleteReview(reviewId) {
    console.log('API Service - deleteReview called with reviewId:', reviewId);
    console.log('API Service - Current auth token:', this.authToken ? 'Present' : 'Missing');
    console.log('API Service - Base URL:', API_CONFIG.BASE_URL);
    try {
      // Try using POST with delete action as fallback
      const response = await this.api.post('/reviews', { 
        action: 'delete', 
        reviewId: reviewId 
      });
      console.log('API Service - deleteReview response:', response);
      return response;
    } catch (error) {
      console.error('API Service - deleteReview error:', error);
      console.error('API Service - Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  async savePendingReviews(userId, products, orderId) {
    return this.api.post('/reviews/pending', { userId, products, orderId });
  }

  async getPendingReviews(userId) {
    console.log('API Service - getPendingReviews called with userId:', userId);
    console.log('API Service - Current auth token:', this.authToken ? 'Present' : 'Missing');
    console.log('API Service - Base URL:', API_CONFIG.BASE_URL);
    try {
      const response = await this.api.get('/reviews/pending', { params: { userId } });
      console.log('API Service - getPendingReviews response:', response);
      return response;
    } catch (error) {
      console.error('API Service - getPendingReviews error:', error);
      console.error('API Service - Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  async removePendingReview(userId, productId) {
    console.log('API Service - removePendingReview called with userId:', userId, 'productId:', productId);
    console.log('API Service - Current auth token:', this.authToken ? 'Present' : 'Missing');
    console.log('API Service - Base URL:', API_CONFIG.BASE_URL);
    try {
      const response = await this.api.delete('/reviews/pending', { 
        params: { userId, productId } 
      });
      console.log('API Service - removePendingReview response:', response);
      return response;
    } catch (error) {
      console.error('API Service - removePendingReview error:', error);
      console.error('API Service - Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }
  }

  // Utility methods
  async uploadImage(imageData) {
    const formData = new FormData();
    formData.append('image', imageData);
    
    return this.api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Cache management methods
  async clearProductCache() {
    console.log('API Service: Clearing product cache');
    const keys = await cacheService.getCacheSize();
    console.log(`API Service: Current cache size: ${keys} items`);
    
    // Clear specific product-related cache
    await cacheService.remove('products');
    await cacheService.remove('featured_products');
    
    // Clear individual product caches (this is a simplified approach)
    // In a production app, you might want to track specific product IDs
    return true;
  }

  async clearAllCache() {
    console.log('API Service: Clearing all cache');
    return await cacheService.clear();
  }

  async getCacheInfo() {
    const size = await cacheService.getCacheSize();
    return { size };
  }

  // Commented out Google Sign-In for now
  // signInWithGoogle: async (accessToken) => {
  //   try {
  //     console.log('API Service: Calling Google sign-in endpoint');
  //     const response = await this.api.post('/auth/google', { accessToken });
  //     console.log('API Response: Google sign-in successful', response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('API Response Error: Google sign-in failed', error.response?.status, error.response?.data);
  //     throw error;
  //   }
  // },
}

export const apiService = new ApiService();