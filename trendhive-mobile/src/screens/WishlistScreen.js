import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';
import WishlistShareModal from '../components/WishlistShareModal';

export default function WishlistScreen({ navigation }) {
  const { colors } = useTheme();
  const { wishlistItems, removeFromWishlist, clearWishlist, loading, loadWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [showShareModal, setShowShareModal] = useState(false);

  // Refresh wishlist when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWishlist();
    });

    return unsubscribe;
  }, [navigation, loadWishlist]);

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product);
    showSuccess(`${product.name} has been removed from your wishlist!`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showSuccess(`${product.name} has been added to your cart!`);
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            clearWishlist();
            showSuccess('Your wishlist has been cleared!');
          }
        }
      ]
    );
  };

  const handleShareWishlist = () => {
    if (wishlistItems.length === 0) {
      Alert.alert('Empty Wishlist', 'Add some items to your wishlist before sharing!');
      return;
    }
    setShowShareModal(true);
  };

  const renderWishlistItem = (product, index) => (
    <Card key={`${product._id || product.id || product.productId}-${index}`} style={[styles.productCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.productRow}>
          <Image
            source={{ uri: product.mainImage || product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Title style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
              {product.name}
            </Title>
            <Paragraph style={[styles.productPrice, { color: colors.primary }]}>
              ${product.price?.toFixed(2) || '0.00'}
            </Paragraph>
            <Paragraph style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
              {product.shortDescription || product.description}
            </Paragraph>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            style={styles.actionButton}
            onPress={() => handleAddToCart(product)}
            icon="cart-plus"
            textColor={colors.primary}
          >
            Add to Cart
          </Button>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromWishlist(product)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.textTertiary} />
      <Title style={[styles.emptyTitle, { color: colors.text }]}>Your Wishlist is Empty</Title>
      <Paragraph style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start adding products to your wishlist to save them for later!
      </Paragraph>
      <Button
        mode="contained"
        style={styles.browseButton}
        buttonColor={colors.primary}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
        icon="shopping"
      >
        Browse Products
      </Button>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <CoolHeader
          title="My Wishlist"
          subtitle="Loading..."
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="My Wishlist"
        subtitle={`${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        {wishlistItems.length > 0 ? (
          <>
            <View style={styles.productsContainer}>
              {wishlistItems.map((item, index) => {
                return renderWishlistItem(item, index);
              })}
            </View>
            
            <Card style={[styles.clearCard, { backgroundColor: colors.card }]}>
              <Card.Content>
                <View style={styles.actionRow}>
                  <Button
                    mode="outlined"
                    style={[styles.clearButton, { flex: 1, marginRight: 8 }]}
                    onPress={handleClearWishlist}
                    icon="delete-sweep"
                    textColor={colors.error}
                  >
                    Clear All
                  </Button>
                  <Button
                    mode="contained"
                    style={[styles.shareButton, { flex: 1, marginLeft: 8 }]}
                    onPress={handleShareWishlist}
                    icon="share"
                    buttonColor={colors.primary}
                  >
                    Share
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          renderEmptyWishlist()
        )}
      </ScrollView>
      
      <WishlistShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        wishlistItems={wishlistItems}
        wishlistName="My Wishlist"
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  productsContainer: {
    padding: 20,
    paddingTop: 0,
    minHeight: 200, // Added minimum height
  },
  productCard: {
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#10B981',
  },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  clearCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearButton: {
    borderColor: '#ef4444',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
}); 