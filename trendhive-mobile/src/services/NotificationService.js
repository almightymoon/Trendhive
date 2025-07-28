import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notification service
  async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      // Get push token
      if (Device.isDevice) {
        this.expoPushToken = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with your Expo project ID
        });
        console.log('Push token:', this.expoPushToken.data);
      } else {
        console.log('Must use physical device for Push Notifications');
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      return true;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Set up notification listeners
  setupNotificationListeners() {
    // Listen for incoming notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for notification responses (when user taps notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle incoming notifications
  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    
    // You can add custom logic here based on notification type
    switch (data?.type) {
      case 'price_drop':
        this.handlePriceDropNotification(data);
        break;
      case 'order_update':
        this.handleOrderUpdateNotification(data);
        break;
      case 'abandoned_cart':
        this.handleAbandonedCartNotification(data);
        break;
      case 'new_product':
        this.handleNewProductNotification(data);
        break;
      default:
        console.log('Unknown notification type:', data?.type);
    }
  }

  // Handle notification responses
  handleNotificationResponse(response) {
    const { data } = response.notification.request.content;
    
    // Navigate based on notification type
    switch (data?.type) {
      case 'price_drop':
        // Navigate to product detail
        this.navigateToProduct(data.productId);
        break;
      case 'order_update':
        // Navigate to order detail
        this.navigateToOrder(data.orderId);
        break;
      case 'abandoned_cart':
        // Navigate to cart
        this.navigateToCart();
        break;
      case 'new_product':
        // Navigate to products
        this.navigateToProducts();
        break;
    }
  }

  // Send local notification
  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  // Price drop notification
  async sendPriceDropNotification(product) {
    const title = 'Price Drop Alert! 🎉';
    const body = `${product.name} is now ${product.discountPercentage}% off! Don't miss this deal.`;
    
    await this.sendLocalNotification(title, body, {
      type: 'price_drop',
      productId: product._id,
      productName: product.name,
    });
  }

  // Order update notification
  async sendOrderUpdateNotification(order) {
    const title = 'Order Update 📦';
    const body = `Your order #${order.orderNumber} has been ${order.status}.`;
    
    await this.sendLocalNotification(title, body, {
      type: 'order_update',
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
    });
  }

  // Abandoned cart reminder
  async sendAbandonedCartNotification(cartItems) {
    const title = "Don't forget your cart! 🛒";
    const body = `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} waiting in your cart.`;
    
    await this.sendLocalNotification(title, body, {
      type: 'abandoned_cart',
      itemCount: cartItems.length,
    });
  }

  // New product notification
  async sendNewProductNotification(product) {
    const title = 'New Product Alert! ✨';
    const body = `${product.name} is now available in our store!`;
    
    await this.sendLocalNotification(title, body, {
      type: 'new_product',
      productId: product._id,
      productName: product.name,
    });
  }

  // Flash sale notification
  async sendFlashSaleNotification(sale) {
    const title = 'Flash Sale! ⚡';
    const body = `${sale.title} - ${sale.discountPercentage}% off for ${sale.duration}!`;
    
    await this.sendLocalNotification(title, body, {
      type: 'flash_sale',
      saleId: sale._id,
      endTime: sale.endTime,
    });
  }

  // Welcome notification
  async sendWelcomeNotification(userName) {
    const title = 'Welcome to TrendHive! 🎉';
    const body = `Hi ${userName}! Start exploring our amazing products.`;
    
    await this.sendLocalNotification(title, body, {
      type: 'welcome',
      userName,
    });
  }

  // Schedule notification for later
  async scheduleNotification(title, body, trigger, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Schedule abandoned cart reminder
  async scheduleAbandonedCartReminder(cartItems, delayHours = 24) {
    const title = 'Your cart is waiting! 🛒';
    const body = `Complete your purchase and get ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} delivered to your door.`;
    
    await this.scheduleNotification(title, body, {
      seconds: delayHours * 3600, // Convert hours to seconds
    }, {
      type: 'abandoned_cart_reminder',
      itemCount: cartItems.length,
    });
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Get notification settings
  async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Save notification settings
  async saveNotificationSettings(settings) {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Get default notification settings
  getDefaultSettings() {
    return {
      priceDrops: true,
      orderUpdates: true,
      abandonedCart: true,
      newProducts: true,
      flashSales: true,
      marketing: false,
      sound: true,
      vibration: true,
    };
  }

  // Update notification setting
  async updateNotificationSetting(key, value) {
    const settings = await this.getNotificationSettings();
    settings[key] = value;
    await this.saveNotificationSettings(settings);
  }

  // Check if notification type is enabled
  async isNotificationEnabled(type) {
    const settings = await this.getNotificationSettings();
    return settings[type] || false;
  }

  // Navigation helpers (to be implemented with your navigation)
  navigateToProduct(productId) {
    // Implement navigation to product detail
    console.log('Navigate to product:', productId);
  }

  navigateToOrder(orderId) {
    // Implement navigation to order detail
    console.log('Navigate to order:', orderId);
  }

  navigateToCart() {
    // Implement navigation to cart
    console.log('Navigate to cart');
  }

  navigateToProducts() {
    // Implement navigation to products
    console.log('Navigate to products');
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get push token
  getPushToken() {
    return this.expoPushToken?.data;
  }
}

export default new NotificationService(); 