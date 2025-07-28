import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Title, Card, List, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function NotificationsScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    priceDrops: true,
    shippingUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    setLoading(true);
    try {
      if (!user || (!user._id && !user.id)) {
        console.error('No user ID available for notification settings');
        return;
      }
      const userId = user._id || user.id;
      console.log('Loading notification settings for user:', userId);
      const response = await apiService.getNotificationSettings(userId);
      
      // Handle both old and new response formats
      if (response.success && response.settings) {
        // Old format: response has success and settings properties
        setNotificationSettings(response.settings);
      } else if (response && typeof response === 'object') {
        // New format: response is directly the settings object
        setNotificationSettings(response);
      } else {
        // Fallback to default settings
        console.log('Using default notification settings');
      }
    } catch (error) {
      console.error('Load notification settings error:', error);
      // Don't show error to user, just use default settings
      console.log('Using default notification settings due to API error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSetting = async (setting, value) => {
    const newSettings = { ...notificationSettings, [setting]: value };
    setNotificationSettings(newSettings);

    try {
      if (!user || (!user._id && !user.id)) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      const userId = user._id || user.id;
      const settingsData = { ...newSettings, userId };
      
      const response = await apiService.updateNotificationSettings(settingsData);
      
      // Handle both old and new response formats
      if (response.success || response.message) {
        // Success - settings are already updated in state
        console.log('Notification settings updated successfully');
      } else {
        // Failed - revert changes
        setNotificationSettings(notificationSettings);
        Alert.alert('Error', 'Failed to update notification settings');
      }
    } catch (error) {
      console.error('Update notification settings error:', error);
      // Revert if failed
      setNotificationSettings(notificationSettings);
      // Don't show error to user for now since the API might not be available
      console.log('Notification settings update failed, but continuing with local changes');
    }
  };

  const handleTestNotification = () => {
    Alert.alert(
      'Test Notification',
      'This is a test notification to verify your settings are working correctly.',
      [{ text: 'OK' }]
    );
  };

  const notificationCategories = [
    {
      title: 'Order Notifications',
      description: 'Updates about your orders and deliveries',
      icon: 'bag',
      settings: [
        {
          key: 'orderUpdates',
          title: 'Order Status Updates',
          description: 'Get notified when your order status changes',
        },
        {
          key: 'shippingUpdates',
          title: 'Shipping Updates',
          description: 'Track your package delivery progress',
        },
      ],
    },
    {
      title: 'Product Notifications',
      description: 'Stay updated on new products and deals',
      icon: 'trending-up',
      settings: [
        {
          key: 'newProducts',
          title: 'New Products',
          description: 'Be the first to know about new arrivals',
        },
        {
          key: 'priceDrops',
          title: 'Price Drops',
          description: 'Get notified when items in your wishlist go on sale',
        },
      ],
    },
    {
      title: 'Promotional Notifications',
      description: 'Special offers and promotional content',
      icon: 'gift',
      settings: [
        {
          key: 'promotions',
          title: 'Special Offers',
          description: 'Receive exclusive deals and discounts',
        },
        {
          key: 'marketingEmails',
          title: 'Marketing Emails',
          description: 'Newsletters and promotional emails',
        },
      ],
    },
    {
      title: 'Security Notifications',
      description: 'Important security and account updates',
      icon: 'shield',
      settings: [
        {
          key: 'securityAlerts',
          title: 'Security Alerts',
          description: 'Important account security notifications',
        },
      ],
    },
    {
      title: 'Notification Channels',
      description: 'Choose how you want to receive notifications',
      icon: 'settings',
      settings: [
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
        },
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive notifications via email',
        },
        {
          key: 'smsNotifications',
          title: 'SMS Notifications',
          description: 'Receive notifications via text message',
        },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={[styles.title, { color: colors.text }]}>Notification Settings</Title>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize how and when you receive notifications
        </Text>
      </View>

      {/* Test Notification */}
      <Card style={[styles.testCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Test Your Settings</Title>
          <Text style={[styles.testDescription, { color: colors.textSecondary }]}>
            Send a test notification to verify your settings are working correctly.
          </Text>
          <View style={[styles.testButton, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="notifications" size={20} color={colors.primary} />
            <Text style={[styles.testButtonText, { color: colors.primary }]} onPress={handleTestNotification}>
              Send Test Notification
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Notification Categories */}
      {notificationCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} style={[styles.categoryCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.categoryHeader}>
              <Ionicons name={category.icon} size={24} color={colors.primary} />
              <View style={styles.categoryInfo}>
                <Title style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Title>
                <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>{category.description}</Text>
              </View>
            </View>

            {category.settings.map((setting, settingIndex) => (
              <View key={setting.key}>
                <List.Item
                  title={setting.title}
                  description={setting.description}
                  titleStyle={{ color: colors.text }}
                  descriptionStyle={{ color: colors.textSecondary }}
                  left={() => (
                    <View style={[styles.settingIcon, { backgroundColor: colors.surfaceVariant }]}>
                      <Ionicons 
                        name={notificationSettings[setting.key] ? "notifications" : "notifications-off"} 
                        size={20} 
                        color={notificationSettings[setting.key] ? colors.primary : colors.textTertiary} 
                      />
                    </View>
                  )}
                  right={() => (
                    <Switch
                      value={notificationSettings[setting.key]}
                      onValueChange={(value) => handleToggleSetting(setting.key, value)}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor={notificationSettings[setting.key] ? '#ffffff' : colors.surfaceVariant}
                    />
                  )}
                  style={styles.settingItem}
                />
                {settingIndex < category.settings.length - 1 && (
                  <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      ))}

      {/* Notification Tips */}
      <Card style={[styles.tipsCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Notification Tips</Title>
          
          <View style={styles.tip}>
            <Ionicons name="bulb" size={20} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Enable order updates to track your purchases in real-time
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Ionicons name="bulb" size={20} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Turn on price drops to never miss a great deal
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Ionicons name="bulb" size={20} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Keep security alerts enabled for account protection
            </Text>
          </View>
          
          <View style={styles.tip}>
            <Ionicons name="bulb" size={20} color={colors.primary} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              You can change these settings anytime
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Some notifications are required for account security and cannot be disabled.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  testCard: {
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  testDescription: {
    fontSize: 14,
    marginBottom: 15,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  testButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
  },
  settingItem: {
    paddingVertical: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  divider: {
    marginLeft: 50,
  },
  tipsCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 