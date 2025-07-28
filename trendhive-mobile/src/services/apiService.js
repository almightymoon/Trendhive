import axios from 'axios';
import { API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    console.log('API Service: Initializing with base URL:', API_CONFIG.BASE_URL);
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

  // Authentication
  async signIn(email, password) {
    return this.api.post('/auth/signin', { email, password });
  }

  async signUp(userData) {
    return this.api.post('/auth/signup', userData);
  }

  // Products - using public route for better accessibility
  async getProducts(params = {}) {
    console.log('API Service: Calling /products endpoint with params:', params);
    return this.api.get('/products', { params });
  }

  async getProduct(id) {
    console.log('API Service: Calling /products endpoint for product ID:', id);
    return this.api.get(`/products?id=${id}`);
  }

  async getFeaturedProducts() {
    console.log('API Service: Calling /products endpoint for featured products');
    return this.api.get('/products', { params: { featured: true } });
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
    
    try {
      const response = await this.api.post('/reviews', reviewData);
      console.log('API Service - submitReview response:', response);
      return response;
    } catch (error) {
      console.error('API Service - submitReview error:', error);
      console.error('API Service - Error type:', typeof error);
      console.error('API Service - Error keys:', Object.keys(error || {}));
      throw error;
    }
  }

  async getProductReviews(productId) {
    return this.api.get('/reviews', { params: { productId } });
  }

  async getUserReviews(userId) {
    return this.api.get('/reviews', { params: { userId } });
  }

  async deleteReview(reviewId) {
    return this.api.delete(`/reviews/${reviewId}`);
  }

  async savePendingReviews(userId, products, orderId) {
    return this.api.post('/reviews/pending', { userId, products, orderId });
  }

  async getPendingReviews(userId) {
    return this.api.get('/reviews/pending', { params: { userId } });
  }

  async removePendingReview(userId, productId) {
    return this.api.delete(`/reviews/pending/${productId}`, { params: { userId } });
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