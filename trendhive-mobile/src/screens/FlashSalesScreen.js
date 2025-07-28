import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Button, Chip, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';

const { width } = Dimensions.get('window');

export default function FlashSalesScreen({ navigation }) {
  const { colors } = useTheme();
  const [currentSale, setCurrentSale] = useState(null);
  const [upcomingSales, setUpcomingSales] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [soldPercentage, setSoldPercentage] = useState(0);
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    loadFlashSales();
    startCountdown();
    startPulseAnimation();
  }, []);

  const loadFlashSales = () => {
    // Simulate current flash sale
    setCurrentSale({
      id: 1,
      title: '⚡ Mega Electronics Sale',
      description: 'Up to 70% off on premium electronics',
      originalPrice: 999,
      salePrice: 299,
      discount: 70,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      totalItems: 100,
      soldItems: 67,
      image: 'https://example.com/electronics.jpg',
      category: 'Electronics',
      urgency: 'high',
    });

    // Simulate upcoming sales
    setUpcomingSales([
      {
        id: 2,
        title: '🎨 Fashion Flash',
        description: 'Designer clothes at unbeatable prices',
        startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        duration: 60, // 60 minutes
        category: 'Fashion',
        preview: true,
      },
      {
        id: 3,
        title: '🏠 Home & Living',
        description: 'Furniture and decor essentials',
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        duration: 90, // 90 minutes
        category: 'Home',
        preview: true,
      },
      {
        id: 4,
        title: '📚 Book Bonanza',
        description: 'Best-selling books at rock-bottom prices',
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        duration: 45, // 45 minutes
        category: 'Books',
        preview: true,
      },
    ]);
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      if (currentSale) {
        const now = new Date().getTime();
        const endTime = new Date(currentSale.endTime).getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ hours, minutes, seconds });
          setSoldPercentage((currentSale.soldItems / currentSale.totalItems) * 100);
        } else {
          // Sale ended
          clearInterval(timer);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#EF4444';
    }
  };

  const handleBuyNow = (sale) => {
    // Navigate to product with flash sale pricing
    navigation.navigate('ProductDetail', {
      productId: sale.id,
      flashSale: true,
      salePrice: sale.salePrice,
    });
  };

  const handleSetReminder = (sale) => {
    // Set reminder for upcoming sale
    Alert.alert(
      'Reminder Set!',
      `You'll be notified 15 minutes before "${sale.title}" starts.`,
      [{ text: 'OK' }]
    );
  };

  const renderCurrentSale = () => {
    if (!currentSale) return null;

    const urgencyColor = getUrgencyColor(currentSale.urgency);

    return (
      <Card style={[styles.currentSaleCard, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.saleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content>
            <View style={styles.saleHeader}>
              <View style={styles.saleInfo}>
                <Text style={styles.saleTitle}>{currentSale.title}</Text>
                <Text style={styles.saleDescription}>{currentSale.description}</Text>
                <Chip
                  mode="outlined"
                  textStyle={{ color: 'white', fontWeight: 'bold' }}
                  style={{ borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {currentSale.discount}% OFF
                </Chip>
              </View>
              <Animated.View
                style={[
                  styles.urgencyIcon,
                  { transform: [{ scale: pulseAnimation }] },
                ]}
              >
                <Ionicons name="flash" size={32} color="white" />
              </Animated.View>
            </View>

            <View style={styles.priceSection}>
              <View style={styles.priceInfo}>
                <Text style={styles.originalPrice}>${currentSale.originalPrice}</Text>
                <Text style={styles.salePrice}>${currentSale.salePrice}</Text>
                <Text style={styles.savings}>
                  Save ${currentSale.originalPrice - currentSale.salePrice}
                </Text>
              </View>
            </View>

            <View style={styles.countdownSection}>
              <Text style={styles.countdownTitle}>Sale Ends In:</Text>
              <View style={styles.countdownTimer}>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeValue}>{formatTime(timeLeft.hours)}</Text>
                  <Text style={styles.timeLabel}>Hours</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeValue}>{formatTime(timeLeft.minutes)}</Text>
                  <Text style={styles.timeLabel}>Minutes</Text>
                </View>
                <Text style={styles.timeSeparator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeValue}>{formatTime(timeLeft.seconds)}</Text>
                  <Text style={styles.timeLabel}>Seconds</Text>
                </View>
              </View>
            </View>

            <View style={styles.stockSection}>
              <View style={styles.stockInfo}>
                <Text style={styles.stockText}>
                  {currentSale.totalItems - currentSale.soldItems} items left
                </Text>
                <Text style={styles.stockPercentage}>
                  {Math.round(soldPercentage)}% sold
                </Text>
              </View>
              <ProgressBar
                progress={soldPercentage / 100}
                color="white"
                style={styles.stockProgress}
              />
            </View>

            <Button
              mode="contained"
              onPress={() => handleBuyNow(currentSale)}
              style={styles.buyNowButton}
              buttonColor="white"
              textColor="#FF6B6B"
              labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            >
              BUY NOW - ${currentSale.salePrice}
            </Button>
          </Card.Content>
        </LinearGradient>
      </Card>
    );
  };

  const renderUpcomingSales = () => (
    <Card style={[styles.upcomingCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.upcomingTitle, { color: colors.text }]}>
          Upcoming Flash Sales
        </Text>
        <View style={styles.upcomingList}>
          {upcomingSales.map((sale) => {
            const timeUntilStart = new Date(sale.startTime) - new Date();
            const hoursUntilStart = Math.floor(timeUntilStart / (1000 * 60 * 60));
            const minutesUntilStart = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));

            return (
              <View
                key={sale.id}
                style={[
                  styles.upcomingItem,
                  { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
                ]}
              >
                <View style={styles.upcomingItemHeader}>
                  <View style={styles.upcomingItemInfo}>
                    <Text style={[styles.upcomingItemTitle, { color: colors.text }]}>
                      {sale.title}
                    </Text>
                    <Text style={[styles.upcomingItemDescription, { color: colors.textSecondary }]}>
                      {sale.description}
                    </Text>
                    <View style={styles.upcomingItemMeta}>
                      <Chip
                        mode="outlined"
                        textStyle={{ fontSize: 12 }}
                        style={{ borderColor: colors.primary }}
                      >
                        {sale.category}
                      </Chip>
                      <Text style={[styles.upcomingItemTime, { color: colors.textSecondary }]}>
                        {hoursUntilStart}h {minutesUntilStart}m until start
                      </Text>
                    </View>
                  </View>
                  <View style={styles.upcomingItemActions}>
                    <Button
                      mode="outlined"
                      onPress={() => handleSetReminder(sale)}
                      style={[styles.reminderButton, { borderColor: colors.primary }]}
                      textColor={colors.primary}
                      compact
                    >
                      Set Reminder
                    </Button>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );

  const renderFlashSaleTips = () => (
    <Card style={[styles.tipsCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>
          Flash Sale Tips
        </Text>
        <View style={styles.tipsList}>
          {[
            'Set reminders for upcoming sales',
            'Be ready to checkout quickly',
            'Check your payment methods',
            'Have your shipping address ready',
            'Don\'t wait - items sell out fast!',
          ].map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Flash Sales"
        subtitle="Limited-time deals that won't last long!"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderCurrentSale()}
          {renderUpcomingSales()}
          {renderFlashSaleTips()}
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
  currentSaleCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  saleGradient: {
    padding: 20,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  saleInfo: {
    flex: 1,
  },
  saleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  saleDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  urgencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSection: {
    marginBottom: 20,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  savings: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  countdownSection: {
    marginBottom: 20,
  },
  countdownTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 12,
  },
  countdownTimer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  timeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 8,
  },
  stockSection: {
    marginBottom: 20,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  stockPercentage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stockProgress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buyNowButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  upcomingCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  upcomingList: {
    gap: 12,
  },
  upcomingItem: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  upcomingItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  upcomingItemInfo: {
    flex: 1,
  },
  upcomingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingItemDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  upcomingItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingItemTime: {
    fontSize: 12,
  },
  upcomingItemActions: {
    marginLeft: 12,
  },
  reminderButton: {
    borderRadius: 8,
  },
  tipsCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    marginLeft: 8,
  },
}); 