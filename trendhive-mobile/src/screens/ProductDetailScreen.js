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
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';
import ReviewsSection from '../components/ReviewsSection';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
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
    <View style={[styles.productInfo, { backgroundColor: colors.card }]}>
      <View style={styles.productHeader}>
        <Text style={[styles.productTitle, { color: colors.text }]}>{product.name}</Text>
        <Text style={[styles.productPrice, { color: colors.primary }]}>${product.price?.toFixed(2) || '0.00'}</Text>
      </View>

      <View style={styles.productMeta}>
        <View style={[styles.categoryTag, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.categoryText, { color: colors.text }]}>{product.category}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
            {product.averageRating ? product.averageRating.toFixed(1) : '4.5'} ({product.reviewCount || 120} reviews)
          </Text>
        </View>
      </View>

      <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
        {product.description || product.shortDescription}
      </Text>

      {product.brand && (
        <View style={[styles.brandContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.brandLabel, { color: colors.text }]}>Brand:</Text>
          <Text style={[styles.brandValue, { color: colors.textSecondary }]}>{product.brand}</Text>
          </View>
        )}
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={[styles.quantityContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.quantityLabel, { color: colors.text }]}>Quantity</Text>
              <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[
              styles.quantityButton, 
              { 
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border 
              },
              quantity <= 1 && { 
                opacity: 0.5,
                backgroundColor: colors.surface 
              }
            ]}
            onPress={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={20}
              color={quantity <= 1 ? colors.textTertiary : colors.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              { 
                backgroundColor: colors.surfaceVariant,
                borderColor: colors.border 
              }
            ]}
            onPress={() => handleQuantityChange(quantity + 1)}
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      {currentQuantity > 0 && (
        <View style={[styles.cartQuantityContainer, { borderTopColor: colors.border }]}>
          <Ionicons name="cart" size={16} color={colors.primary} />
        <Text style={[styles.cartQuantity, { color: colors.textSecondary }]}>
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
        style={[
          styles.wishlistButton, 
          { 
            backgroundColor: colors.card,
            borderColor: colors.border 
          },
          isInWishlist(product) && { backgroundColor: colors.primary }
        ]}
        onPress={handleWishlistToggle}
      >
        <Ionicons 
          name={isInWishlist(product) ? "heart" : "heart-outline"} 
          size={20} 
          color={isInWishlist(product) ? "white" : colors.primary} 
        />
        <Text style={[
          styles.wishlistText, 
          { color: isInWishlist(product) ? "white" : colors.primary }
        ]}>
          {isInWishlist(product) ? 'Wishlisted' : 'Wishlist'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.addToCartButton, 
          { 
            backgroundColor: colors.primary,
            shadowColor: colors.primary
          }
        ]}
        onPress={handleAddToCart}
      >
        <Ionicons name="cart-outline" size={20} color="white" />
        <Text style={[styles.addToCartText, { color: 'white' }]}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <ReviewsSection productId={productId} productName={product.name} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  brandLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  brandValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistText: {
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
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartText: {
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 16,
  },
}); 