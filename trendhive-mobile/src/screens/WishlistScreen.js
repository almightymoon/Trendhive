import React from 'react';
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
import CoolHeader from '../components/CoolHeader';

export default function WishlistScreen({ navigation }) {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading, loadWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Refresh wishlist when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWishlist();
    });

    return unsubscribe;
  }, [navigation, loadWishlist]);

  const handleRemoveFromWishlist = (product) => {
    Alert.alert(
      'Remove from Wishlist',
      `Remove "${product.name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromWishlist(product) }
      ]
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearWishlist }
      ]
    );
  };

  // Debug function to clear AsyncStorage
  const handleDebugClear = async () => {
    try {
      const userId = user?.id || user?._id;
      const storageKey = userId ? `wishlist_${userId}` : 'wishlist_guest';
      await AsyncStorage.removeItem(storageKey);
      Alert.alert('Debug', `AsyncStorage cleared for key: ${storageKey}. Please restart the app.`);
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const renderWishlistItem = (product, index) => (
    <Card key={`${product._id || product.id || product.productId}-${index}`} style={styles.productCard}>
      <Card.Content>
        <View style={styles.productRow}>
          <Image
            source={{ uri: product.mainImage || product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Title style={styles.productName} numberOfLines={2}>
              {product.name}
            </Title>
            <Paragraph style={styles.productPrice}>
              ${product.price?.toFixed(2) || '0.00'}
            </Paragraph>
            <Paragraph style={styles.productDescription} numberOfLines={2}>
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
          >
            Add to Cart
          </Button>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromWishlist(product)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#d1d5db" />
      <Title style={styles.emptyTitle}>Your Wishlist is Empty</Title>
      <Paragraph style={styles.emptyText}>
        Start adding products to your wishlist to save them for later!
      </Paragraph>
      <Button
        mode="contained"
        style={styles.browseButton}
        onPress={() => navigation.navigate('Products')}
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

  console.log('WishlistScreen render - items:', wishlistItems.length, wishlistItems);
  console.log('WishlistScreen render - user:', user?.id || user?._id, 'loading:', loading);

  return (
    <View style={styles.container}>
      <CoolHeader
        title="My Wishlist"
        subtitle={`${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        {/* Debug Info */}
        <View style={{ padding: 10, backgroundColor: '#f0f0f0', margin: 10 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Debug: User ID: {user?.id || user?._id || 'No user'}{'\n'}
            Loading: {loading ? 'Yes' : 'No'}{'\n'}
            Items: {wishlistItems.length}{'\n'}
            Items &gt; 0: {wishlistItems.length > 0 ? 'Yes' : 'No'}
          </Text>
        </View>

        {wishlistItems.length > 0 ? (
          <>
            <View style={styles.productsContainer}>
              <Text style={{ color: 'red', fontSize: 16, marginBottom: 10 }}>
                Debug: Found {wishlistItems.length} items to render
              </Text>
              {wishlistItems.map((item, index) => {
                console.log('Rendering wishlist item:', item.name, 'at index:', index);
                return renderWishlistItem(item, index);
              })}
            </View>
            
            <Card style={styles.clearCard}>
              <Card.Content>
                <Button
                  mode="outlined"
                  style={styles.clearButton}
                  onPress={handleClearWishlist}
                  icon="delete-sweep"
                  textColor="#ef4444"
                >
                  Clear All Items
                </Button>
                <Button
                  mode="outlined"
                  style={[styles.clearButton, { marginTop: 10 }]}
                  onPress={handleDebugClear}
                  icon="bug"
                  textColor="#6b7280"
                >
                  Debug: Clear Storage
                </Button>
              </Card.Content>
            </Card>
          </>
        ) : (
          renderEmptyWishlist()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#f8fafc', // Added background color
    minHeight: 200, // Added minimum height
  },
  productCard: {
    marginBottom: 15,
    backgroundColor: 'white',
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