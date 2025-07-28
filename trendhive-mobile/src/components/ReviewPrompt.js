import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Title, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ReviewModal from './ReviewModal';
import apiService from '../services/apiService';

export default function ReviewPrompt({ visible, onClose, products, orderId }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user reviews and filter products
  useEffect(() => {
    const loadUserReviewsAndFilterProducts = async () => {
      if (!visible || !user || !products) return;
      
      setLoading(true);
      try {
        // Load user's existing reviews
        const reviews = await apiService.getUserReviews(user._id);
        setUserReviews(reviews || []);
        
        // Filter out products that user has already reviewed
        const productsNeedingReviews = products.filter(product => {
          const productId = product._id || product.id;
          const hasReviewed = reviews.some(review => 
            String(review.productId) === String(productId)
          );
          return !hasReviewed;
        });
        
        console.log('ReviewPrompt - Original products:', products.length);
        console.log('ReviewPrompt - User reviews:', reviews.length);
        console.log('ReviewPrompt - Products needing reviews:', productsNeedingReviews.length);
        
        setFilteredProducts(productsNeedingReviews);
      } catch (error) {
        console.error('Error loading user reviews:', error);
        // If error, show all products
        setFilteredProducts(products);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserReviewsAndFilterProducts();
  }, [visible, user, products]);

  const handleReviewProduct = (product) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to write a review');
      return;
    }
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    // Optionally close the prompt after review
    onClose();
  };

  const handleSkip = async () => {
    // Save only products that haven't been reviewed to pending reviews
    if (user && filteredProducts && filteredProducts.length > 0) {
      try {
        console.log('ReviewPrompt - Saving pending reviews for products:', filteredProducts.length);
        await apiService.savePendingReviews(user._id, filteredProducts, orderId);
      } catch (error) {
        console.error('Error saving pending reviews:', error);
      }
    } else {
      console.log('ReviewPrompt - No products to save to pending reviews');
    }
    onClose();
  };

  if (!visible || !products || products.length === 0) {
    return null;
  }

  // If all products have been reviewed, don't show the prompt
  if (filteredProducts.length === 0 && !loading) {
    console.log('ReviewPrompt - All products already reviewed, closing prompt');
    onClose();
    return null;
  }

  return (
    <>
      <View style={styles.overlay}>
        <Card style={[styles.promptCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.header}>
              <Ionicons name="star" size={32} color="#FFD700" />
              <Title style={[styles.title, { color: colors.text }]}>
                How was your experience?
              </Title>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Share your thoughts about the products you purchased
              </Text>
            </View>

            <View style={styles.productsList}>
              {loading ? (
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading products...
                </Text>
              ) : (
                filteredProducts.map((product, index) => (
                  <TouchableOpacity
                    key={product._id || product.id || index}
                    style={[styles.productItem, { borderColor: colors.border }]}
                    onPress={() => handleReviewProduct(product)}
                  >
                    <View style={styles.productInfo}>
                      <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                        {product.name || product.title}
                      </Text>
                      <Text style={[styles.productPrice, { color: colors.primary }]}>
                        ${(product.price || 0).toFixed(2)}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={handleSkip}
                style={[styles.skipButton, { borderColor: colors.border }]}
                textColor={colors.textSecondary}
              >
                Maybe Later
              </Button>
              <Button
                mode="contained"
                onPress={() => handleReviewProduct(filteredProducts[0])}
                style={styles.reviewButton}
                buttonColor={colors.primary}
                icon="star-outline"
                disabled={filteredProducts.length === 0}
              >
                Write Review
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={selectedProduct?._id || selectedProduct?.id}
        productName={selectedProduct?.name || selectedProduct?.title}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  promptCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  productsList: {
    marginBottom: 24,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    borderRadius: 8,
  },
  reviewButton: {
    flex: 2,
    borderRadius: 8,
  },
}); 