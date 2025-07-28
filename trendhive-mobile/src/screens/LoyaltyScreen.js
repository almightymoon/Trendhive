import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Card, Button, ProgressBar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';

export default function LoyaltyScreen({ navigation }) {
  const { colors } = useTheme();
  const [userPoints, setUserPoints] = useState(1250);
  const [userTier, setUserTier] = useState('Gold');
  const [nextTier, setNextTier] = useState('Platinum');
  const [pointsToNextTier, setPointsToNextTier] = useState(750);
  const [totalPointsEarned, setTotalPointsEarned] = useState(2500);
  const [totalPointsRedeemed, setTotalPointsRedeemed] = useState(1250);
  const [recentActivities, setRecentActivities] = useState([]);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [showRewards, setShowRewards] = useState(false);

  const progressAnimation = new Animated.Value(0);

  useEffect(() => {
    loadLoyaltyData();
    animateProgress();
  }, []);

  const loadLoyaltyData = () => {
    // Simulate loading loyalty data
    setRecentActivities([
      {
        id: 1,
        type: 'purchase',
        title: 'Order #12345',
        points: 150,
        date: '2024-01-15',
        description: 'Earned points for your purchase',
      },
      {
        id: 2,
        type: 'review',
        title: 'Product Review',
        points: 50,
        date: '2024-01-14',
        description: 'Earned points for leaving a review',
      },
      {
        id: 3,
        type: 'referral',
        title: 'Friend Referral',
        points: 200,
        date: '2024-01-12',
        description: 'Earned points for referring a friend',
      },
      {
        id: 4,
        type: 'birthday',
        title: 'Birthday Bonus',
        points: 100,
        date: '2024-01-10',
        description: 'Happy Birthday! Here are your bonus points',
      },
    ]);

    setAvailableRewards([
      {
        id: 1,
        name: '$10 Off Coupon',
        points: 500,
        description: 'Get $10 off your next purchase',
        type: 'discount',
        icon: 'pricetag',
        color: '#10B981',
      },
      {
        id: 2,
        name: 'Free Shipping',
        points: 300,
        description: 'Free shipping on your next order',
        type: 'shipping',
        icon: 'car',
        color: '#3B82F6',
      },
      {
        id: 3,
        name: 'Premium Support',
        points: 1000,
        description: 'Priority customer support for 30 days',
        type: 'support',
        icon: 'headset',
        color: '#8B5CF6',
      },
      {
        id: 4,
        name: 'Early Access',
        points: 800,
        description: 'Early access to new products and sales',
        type: 'access',
        icon: 'star',
        color: '#F59E0B',
      },
      {
        id: 5,
        name: 'Double Points',
        points: 1500,
        description: 'Earn double points on your next purchase',
        type: 'bonus',
        icon: 'trending-up',
        color: '#EF4444',
      },
      {
        id: 6,
        name: 'Gift Card',
        points: 2000,
        description: '$25 gift card to use anytime',
        type: 'gift',
        icon: 'gift',
        color: '#EC4899',
      },
    ]);
  };

  const animateProgress = () => {
    const progress = userPoints / (userPoints + pointsToNextTier);
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const getTierInfo = (tier) => {
    const tiers = {
      Bronze: {
        color: '#CD7F32',
        gradient: ['#CD7F32', '#B8860B'],
        minPoints: 0,
        benefits: ['5% points on purchases', 'Standard shipping'],
      },
      Silver: {
        color: '#C0C0C0',
        gradient: ['#C0C0C0', '#A8A8A8'],
        minPoints: 500,
        benefits: ['7% points on purchases', 'Free shipping on orders over $50'],
      },
      Gold: {
        color: '#FFD700',
        gradient: ['#FFD700', '#FFA500'],
        minPoints: 1000,
        benefits: ['10% points on purchases', 'Free shipping on all orders', 'Priority support'],
      },
      Platinum: {
        color: '#E5E4E2',
        gradient: ['#E5E4E2', '#B8B8B8'],
        minPoints: 2000,
        benefits: ['15% points on purchases', 'Free express shipping', 'VIP support', 'Early access'],
      },
      Diamond: {
        color: '#B9F2FF',
        gradient: ['#B9F2FF', '#87CEEB'],
        minPoints: 5000,
        benefits: ['20% points on purchases', 'Free same-day delivery', 'Personal concierge', 'Exclusive events'],
      },
    };
    return tiers[tier] || tiers.Bronze;
  };

  const handleRedeemReward = (reward) => {
    if (userPoints >= reward.points) {
      setUserPoints(prev => prev - reward.points);
      Alert.alert(
        'Reward Redeemed!',
        `You've successfully redeemed "${reward.name}" for ${reward.points} points.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.points - userPoints} more points to redeem this reward.`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderTierCard = () => {
    const currentTierInfo = getTierInfo(userTier);
    const nextTierInfo = getTierInfo(nextTier);

    return (
      <Card style={[styles.tierCard, { backgroundColor: colors.card }]}>
        <LinearGradient
          colors={currentTierInfo.gradient}
          style={styles.tierGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content>
            <View style={styles.tierHeader}>
              <View style={styles.tierInfo}>
                <Text style={styles.tierTitle}>{userTier} Member</Text>
                <Text style={styles.tierSubtitle}>{userPoints} Points</Text>
              </View>
              <View style={styles.tierIcon}>
                <Ionicons name="trophy" size={32} color="white" />
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>Progress to {nextTier}</Text>
                <Text style={styles.progressPoints}>{pointsToNextTier} points needed</Text>
              </View>
              <ProgressBar
                progress={userPoints / (userPoints + pointsToNextTier)}
                color="white"
                style={styles.progressBar}
              />
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Your Benefits:</Text>
              {currentTierInfo.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={16} color="white" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    );
  };

  const renderStatsCard = () => (
    <Card style={[styles.statsCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.statsTitle, { color: colors.text }]}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalPointsEarned}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>{totalPointsRedeemed}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Redeemed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.info }]}>{userPoints}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Available</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRewardsSection = () => (
    <Card style={[styles.rewardsCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.rewardsHeader}>
          <Text style={[styles.rewardsTitle, { color: colors.text }]}>Available Rewards</Text>
          <TouchableOpacity onPress={() => setShowRewards(!showRewards)}>
            <Ionicons
              name={showRewards ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {showRewards && (
          <View style={styles.rewardsGrid}>
            {availableRewards.map((reward) => (
              <TouchableOpacity
                key={reward.id}
                style={[
                  styles.rewardItem,
                  { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
                  userPoints >= reward.points && { borderColor: reward.color },
                ]}
                onPress={() => handleRedeemReward(reward)}
              >
                <View style={[styles.rewardIcon, { backgroundColor: `${reward.color}20` }]}>
                  <Ionicons name={reward.icon} size={24} color={reward.color} />
                </View>
                <Text style={[styles.rewardName, { color: colors.text }]}>{reward.name}</Text>
                <Text style={[styles.rewardDescription, { color: colors.textSecondary }]}>
                  {reward.description}
                </Text>
                <View style={styles.rewardPoints}>
                  <Text style={[styles.pointsText, { color: reward.color }]}>
                    {reward.points} pts
                  </Text>
                  {userPoints >= reward.points && (
                    <Chip
                      mode="outlined"
                      textStyle={{ color: reward.color, fontSize: 12 }}
                      style={{ borderColor: reward.color }}
                    >
                      Redeem
                    </Chip>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderActivitySection = () => (
    <Card style={[styles.activityCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.activityTitle, { color: colors.text }]}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons
                  name={
                    activity.type === 'purchase' ? 'cart' :
                    activity.type === 'review' ? 'star' :
                    activity.type === 'referral' ? 'people' :
                    'gift'
                  }
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityName, { color: colors.text }]}>
                  {activity.title}
                </Text>
                <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                  {activity.description}
                </Text>
                <Text style={[styles.activityDate, { color: colors.textTertiary }]}>
                  {activity.date}
                </Text>
              </View>
              <View style={styles.activityPoints}>
                <Text style={[styles.pointsEarned, { color: colors.success }]}>
                  +{activity.points}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderHowToEarn = () => (
    <Card style={[styles.howToEarnCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.howToEarnTitle, { color: colors.text }]}>How to Earn Points</Text>
        <View style={styles.earningMethods}>
          {[
            { method: 'Make Purchases', points: '1 point per $1 spent', icon: 'cart' },
            { method: 'Leave Reviews', points: '50 points per review', icon: 'star' },
            { method: 'Refer Friends', points: '200 points per referral', icon: 'people' },
            { method: 'Birthday Bonus', points: '100 points annually', icon: 'gift' },
            { method: 'Social Sharing', points: '25 points per share', icon: 'share' },
            { method: 'Complete Profile', points: '100 points one-time', icon: 'person' },
          ].map((item, index) => (
            <View key={index} style={styles.earningMethod}>
              <View style={[styles.earningIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.earningContent}>
                <Text style={[styles.earningMethodName, { color: colors.text }]}>
                  {item.method}
                </Text>
                <Text style={[styles.earningPoints, { color: colors.textSecondary }]}>
                  {item.points}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Loyalty Program"
        subtitle="Earn points, unlock rewards, and climb the tiers"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderTierCard()}
          {renderStatsCard()}
          {renderRewardsSection()}
          {renderActivitySection()}
          {renderHowToEarn()}
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
  tierCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  tierGradient: {
    padding: 20,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tierInfo: {
    flex: 1,
  },
  tierTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  tierSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tierIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  progressPoints: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  benefitsSection: {
    marginTop: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  statsCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  rewardsCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  rewardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rewardItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  rewardPoints: {
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 10,
  },
  activityPoints: {
    alignItems: 'flex-end',
  },
  pointsEarned: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  howToEarnCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  howToEarnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  earningMethods: {
    gap: 12,
  },
  earningMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  earningContent: {
    flex: 1,
  },
  earningMethodName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  earningPoints: {
    fontSize: 12,
  },
}); 