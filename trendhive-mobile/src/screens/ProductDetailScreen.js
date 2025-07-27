import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CoolHeader from '../components/CoolHeader';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, getCartItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const flatListRef = useRef(null);

  // Create images array with mainImage first, then additional images
  const allImages = [
    product.mainImage || product.image,
    ...(product.images || [])
  ].filter(Boolean); // Remove any null/undefined values

  // Handle different ID formats
  const productId = product._id || product.id || product.productId;
  const cartItem = getCartItem(productId);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert('Success', 'Product added to cart!');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const renderImageGallery = () => (
    <View style={styles.imageContainer}>
      <FlatList
        ref={flatListRef}
        data={allImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.imageSlide}>
            <Image
              source={{ uri: item }}
        style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      
      {/* Image Indicators */}
      {allImages.length > 1 && (
        <View style={styles.imageIndicators}>
          {allImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}

      {/* Navigation Arrows */}
      {allImages.length > 1 && (
        <>
        <TouchableOpacity
            style={[styles.navArrow, styles.leftArrow]}
            onPress={() => {
              const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
              setCurrentImageIndex(newIndex);
              flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
            }}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navArrow, styles.rightArrow]}
            onPress={() => {
              const newIndex = currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
              setCurrentImageIndex(newIndex);
              flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
        </>
      )}

      {/* Removed old header overlay since we're using CoolHeader now */}
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <View style={styles.productHeader}>
        <Text style={styles.productTitle}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price?.toFixed(2) || '0.00'}</Text>
      </View>

      <View style={styles.productMeta}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.ratingText}>4.5 (120 reviews)</Text>
        </View>
      </View>

      <Text style={styles.productDescription}>
        {product.description || product.shortDescription}
      </Text>

      {product.brand && (
        <View style={styles.brandContainer}>
          <Text style={styles.brandLabel}>Brand:</Text>
          <Text style={styles.brandValue}>{product.brand}</Text>
          </View>
        )}
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Quantity</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
          onPress={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Ionicons
            name="remove"
            size={20}
            color={quantity <= 1 ? '#d1d5db' : '#10B981'}
          />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(quantity + 1)}
        >
          <Ionicons name="add" size={20} color="#10B981" />
        </TouchableOpacity>
      </View>
      {currentQuantity > 0 && (
        <View style={styles.cartQuantityContainer}>
          <Ionicons name="cart" size={16} color="#10B981" />
        <Text style={styles.cartQuantity}>
          {currentQuantity} in cart
        </Text>
        </View>
      )}
    </View>
  );

  const handleWishlistToggle = () => {
    console.log('Wishlist toggle - product:', product.name, 'ID:', product._id || product.id || product.productId);
    if (isInWishlist(product)) {
      removeFromWishlist(product);
      Alert.alert('Removed', 'Product removed from wishlist!');
    } else {
      const result = addToWishlist(product);
      if (result) {
        Alert.alert('Added', 'Product added to wishlist!');
      } else {
        Alert.alert('Already in wishlist', 'This product is already in your wishlist!');
      }
    }
  };

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.wishlistButton, isInWishlist(product) && styles.wishlistButtonActive]}
        onPress={handleWishlistToggle}
      >
        <Ionicons 
          name={isInWishlist(product) ? "heart" : "heart-outline"} 
          size={20} 
          color={isInWishlist(product) ? "white" : "#10B981"} 
        />
        <Text style={[styles.wishlistText, isInWishlist(product) && styles.wishlistTextActive]}>
          {isInWishlist(product) ? 'Wishlisted' : 'Wishlist'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Ionicons name="cart-outline" size={20} color="white" />
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CoolHeader
        title="Product Details"
        onBack={() => navigation.goBack()}
        rightIcon="heart-outline"
        onRightPress={handleWishlistToggle}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        <View style={styles.content}>
          {renderProductInfo()}
          {renderQuantitySelector()}
          {renderActionButtons()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.45,
  },
  imageSlide: {
    width: width,
    height: height * 0.45,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftArrow: {
    left: 20,
  },
  rightArrow: {
    right: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  productInfo: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: -30, // INCREASED OVERLAP TO REMOVE WHITE SPACE
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productHeader: {
    marginBottom: 15,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTag: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  categoryText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 15,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  brandLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginRight: 8,
  },
  brandValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  quantityContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  cartQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cartQuantity: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '500',
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  wishlistButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  wishlistText: {
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 16,
  },
  wishlistTextActive: {
    color: 'white',
  },
  wishlistButtonActive: {
    backgroundColor: '#10B981',
  },
  addToCartButton: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 16,
  },
}); 