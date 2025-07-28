import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Card, Title, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import NotificationService from '../services/NotificationService';
import CoolHeader from '../components/CoolHeader';

export default function NotificationSettingsScreen({ navigation }) {
  const { colors } = useTheme();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notificationSettings = await NotificationService.getNotificationSettings();
      setSettings(notificationSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      await NotificationService.updateNotificationSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating notification setting:', error);
    }
  };

  const notificationTypes = [
    {
      key: 'priceDrops',
      title: 'Price Drop Alerts',
      description: 'Get notified when items in your wishlist go on sale',
      icon: 'trending-down',
      color: '#10B981',
    },
    {
      key: 'orderUpdates',
      title: 'Order Updates',
      description: 'Track your orders with real-time status updates',
      icon: 'cube',
      color: '#3B82F6',
    },
    {
      key: 'abandonedCart',
      title: 'Cart Reminders',
      description: 'Gentle reminders about items left in your cart',
      icon: 'cart',
      color: '#F59E0B',
    },
    {
      key: 'newProducts',
      title: 'New Products',
      description: 'Be the first to know about new arrivals',
      icon: 'sparkles',
      color: '#8B5CF6',
    },
    {
      key: 'flashSales',
      title: 'Flash Sales',
      description: 'Limited-time deals and exclusive offers',
      icon: 'flash',
      color: '#EF4444',
    },
    {
      key: 'marketing',
      title: 'Marketing & Promotions',
      description: 'Special offers, newsletters, and promotional content',
      icon: 'megaphone',
      color: '#EC4899',
    },
  ];

  const renderNotificationType = (type) => (
    <View
      key={type.key}
      style={[
        styles.notificationType,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.notificationTypeHeader}>
        <View style={styles.notificationTypeInfo}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${type.color}20` },
            ]}
          >
            <Ionicons name={type.icon} size={20} color={type.color} />
          </View>
          <View style={styles.notificationTypeText}>
            <Text style={[styles.notificationTypeTitle, { color: colors.text }]}>
              {type.title}
            </Text>
            <Text style={[styles.notificationTypeDescription, { color: colors.textSecondary }]}>
              {type.description}
            </Text>
          </View>
        </View>
        <Switch
          value={settings[type.key] || false}
          onValueChange={(value) => updateSetting(type.key, value)}
          trackColor={{ false: colors.border, true: type.color }}
          thumbColor={settings[type.key] ? '#ffffff' : colors.textTertiary}
          ios_backgroundColor={colors.border}
        />
      </View>
    </View>
  );

  const renderSettingsSection = (title, children) => (
    <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Title style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Title>
        {children}
      </Card.Content>
    </Card>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity
        style={[
          styles.quickActionButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => {
          // Test notification
          NotificationService.sendLocalNotification(
            'Test Notification',
            'This is a test notification to verify your settings!',
            { type: 'test' }
          );
        }}
      >
        <Ionicons name="notifications" size={20} color={colors.primary} />
        <Text style={[styles.quickActionText, { color: colors.text }]}>
          Test Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.quickActionButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => {
          // Clear all notifications
          NotificationService.cancelAllNotifications();
        }}
      >
        <Ionicons name="trash" size={20} color={colors.error} />
        <Text style={[styles.quickActionText, { color: colors.text }]}>
          Clear All
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CoolHeader title="Notification Settings" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading settings...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Notification Settings"
        subtitle="Customize your notification preferences"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderSettingsSection(
            'Notification Types',
            <View style={styles.notificationTypes}>
              {notificationTypes.map(renderNotificationType)}
            </View>
          )}

          {renderSettingsSection(
            'General Settings',
            <View style={styles.generalSettings}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="volume-high" size={20} color={colors.primary} />
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Sound
                  </Text>
                </View>
                <Switch
                  value={settings.sound || false}
                  onValueChange={(value) => updateSetting('sound', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.sound ? '#ffffff' : colors.textTertiary}
                  ios_backgroundColor={colors.border}
                />
              </View>
              
              <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Ionicons name="phone-portrait" size={20} color={colors.primary} />
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Vibration
                  </Text>
                </View>
                <Switch
                  value={settings.vibration || false}
                  onValueChange={(value) => updateSetting('vibration', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.vibration ? '#ffffff' : colors.textTertiary}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </View>
          )}

          {renderSettingsSection(
            'Quick Actions',
            renderQuickActions()
          )}

          <Card style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color={colors.info} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  About Notifications
                </Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                You can customize which notifications you receive. Some notifications 
                are important for order tracking and will be sent regardless of settings.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  sectionCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationTypes: {
    gap: 12,
  },
  notificationType: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  notificationTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTypeText: {
    flex: 1,
  },
  notificationTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationTypeDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  generalSettings: {
    gap: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  divider: {
    marginVertical: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  infoCard: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 