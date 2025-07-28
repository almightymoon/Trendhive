import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';
import ThemeToggle from '../components/ThemeToggle';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { getWishlistCount } = useWishlist();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const menuItems = [
    {
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to view your orders.');
          return;
        }
        navigation.navigate('Orders');
      }
    },
    {
      title: 'My Reviews',
      icon: 'star-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to view your reviews.');
          return;
        }
        navigation.navigate('Reviews');
      }
    },
    {
      title: 'My Wishlist',
      icon: 'heart-outline',
      badge: getWishlistCount(),
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to view your wishlist.');
          return;
        }
        navigation.navigate('Wishlist');
      }
    },
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to edit your profile.');
          return;
        }
        navigation.navigate('EditProfile');
      }
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to access privacy settings.');
          return;
        }
        navigation.navigate('Security');
      }
    },
    {
      title: 'Shipping Addresses',
      icon: 'location-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to manage shipping addresses.');
          return;
        }
        navigation.navigate('ShippingAddresses');
      }
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('HelpSupport')
    },
    {
      title: 'Theme Settings',
      icon: 'color-palette-outline',
      onPress: () => navigation.navigate('ThemeSettings')
    },
    {
      title: 'Advanced Search',
      icon: 'search-outline',
      onPress: () => navigation.navigate('AdvancedSearch')
    },
    {
      title: 'Loyalty Program',
      icon: 'trophy-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to access the loyalty program.');
          return;
        }
        navigation.navigate('Loyalty');
      }
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to manage notifications.');
          return;
        }
        navigation.navigate('Notifications');
      }
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('About')
    },
    {
      title: 'Cache Management',
      icon: 'hardware-chip-outline',
      onPress: () => navigation.navigate('CacheManager')
    },
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <Ionicons name={item.icon} size={24} color={colors.textSecondary} />
          <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
        </View>
        <View style={styles.menuItemRight}>
          {item.badge > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Profile"
        subtitle={user ? "Manage your account" : "Sign in to access your account"}
        rightIcon="color-palette"
        onRightPress={() => navigation.navigate('ThemeSettings')}
      />
      
      <ScrollView style={styles.scrollView}>
        <Card style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            {user ? (
              <View style={styles.userInfo}>
                <Avatar.Text 
                  size={60} 
                  label={user.name ? user.name.charAt(0).toUpperCase() : 'U'} 
                  style={styles.avatar}
                />
                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <Title style={[styles.userName, { color: colors.text }]}>{user.name || 'User'}</Title>
                    <ThemeToggle />
                  </View>
                  <Paragraph style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Paragraph>
                  {user.admin === 1 && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminText}>Admin</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.guestInfo}>
                <Avatar.Icon 
                  size={60} 
                  icon="account" 
                  style={styles.guestAvatar}
                />
                <View style={styles.guestDetails}>
                  <Title style={[styles.guestTitle, { color: colors.text }]}>Guest User</Title>
                  <Paragraph style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
                    Sign in to access your account and make purchases
                  </Paragraph>
                  <View style={styles.authButtons}>
                    <Button
                      mode="contained"
                      onPress={handleSignIn}
                      style={styles.signInButton}
                      buttonColor={colors.primary}
                    >
                      Sign In
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={handleSignUp}
                      style={styles.signUpButton}
                      textColor={colors.primary}
                    >
                      Sign Up
                    </Button>
                  </View>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderMenuItem(item, index)}
                {index < menuItems.length - 1 && <Divider style={[styles.divider, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {user && (
          <Card style={[styles.signOutCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Button
                mode="outlined"
                onPress={handleSignOut}
                style={styles.signOutButton}
                textColor={colors.error}
                icon="logout"
              >
                Sign Out
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#10B981',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 5,
  },
  adminBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  adminText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  guestInfo: {
    alignItems: 'center',
  },
  guestAvatar: {
    backgroundColor: '#e5e7eb',
    marginBottom: 15,
  },
  guestDetails: {
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guestSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  signInButton: {
    borderRadius: 8,
  },
  signUpButton: {
    borderRadius: 8,
  },
  menuCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 15,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  signOutCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutButton: {
    borderColor: '#ef4444',
  },
}); 