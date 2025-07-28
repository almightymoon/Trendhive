import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Title, Chip, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';
import CoolHeader from '../components/CoolHeader';
import ReviewModal from '../components/ReviewModal';

export default function ReviewsScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'

  useEffect(() => {
    console.log('ReviewsScreen - useEffect triggered');
    console.log('ReviewsScreen - User from context:', user);
    console.log('ReviewsScreen - User ID from context:', user?._id || user?.id);
    
    if (user && (user._id || user.id)) {
      console.log('ReviewsScreen - User authenticated, loading data');
      loadData();
    } else {
      console.log('ReviewsScreen - No user or user ID, not loading data');
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadOrders(),
        loadUserReviews(),
        loadPendingReviews()
      ]);
    } catch (error) {
      console.error('Error loading reviews data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const userId = user?._id || user?.id;
      console.log('ReviewsScreen - Loading orders for user:', userId);
      const response = await apiService.getOrders(userId);
      console.log('ReviewsScreen - Orders response:', response);
      if (response.success || Array.isArray(response)) {
        const ordersData = Array.isArray(response) ? response : response.orders || [];
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
    }
  };

  const loadUserReviews = async () => {
    try {
      console.log('ReviewsScreen - loadUserReviews called');
      console.log('ReviewsScreen - User object:', user);
      const userId = user?._id || user?.id;
      console.log('ReviewsScreen - User ID:', userId);
      console.log('ReviewsScreen - User ID type:', typeof userId);
      
      if (!user || !userId) {
        console.error('ReviewsScreen - No user or user ID available');
        setUserReviews([]);
        return;
      }
      
      console.log('Loading user reviews for user:', userId);
      const response = await apiService.getUserReviews(userId);
      console.log('User reviews response:', response);
      if (response.success || Array.isArray(response)) {
        const reviewsData = Array.isArray(response) ? response : response.reviews || [];
        setUserReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error loading user reviews:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      setUserReviews([]);
    }
  };

  const loadPendingReviews = async () => {
    try {
      const userId = user?._id || user?.id;
      console.log('Loading pending reviews for user:', userId);
      console.log('API Service auth token:', apiService.authToken ? 'Present' : 'Missing');
      const response = await apiService.getPendingReviews(userId);
      console.log('Pending reviews response:', response);
      if (Array.isArray(response)) {
        setPendingReviews(response);
      }
    } catch (error) {
      console.error('Error loading pending reviews:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      // Set empty array as fallback to prevent errors
      setPendingReviews([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleReviewSubmitted = async () => {
    const currentProduct = selectedProduct; // Store reference before clearing
    console.log('ReviewsScreen - Review submitted for product:', currentProduct);
    
    setShowReviewModal(false);
    setSelectedProduct(null);
    
    // Remove the product from pending reviews if it was there
    if (currentProduct && currentProduct._id) {
      try {
        const userId = user?._id || user?.id;
        // Check if this product is in pending reviews
        const isPendingReview = pendingReviews.some(pending => 
          String(pending.productId) === String(currentProduct._id)
        );
        
        if (isPendingReview) {
          console.log('ReviewsScreen - Removing pending review for product:', currentProduct._id);
          await apiService.removePendingReview(userId, currentProduct._id);
        } else {
          console.log('ReviewsScreen - Product not in pending reviews, no need to remove');
        }
      } catch (error) {
        console.error('Error removing pending review:', error);
      }
    }
    
    // Force refresh all data to ensure reviews move to completed section
    console.log('ReviewsScreen - Refreshing data after review submission');
    await loadData();
  };

  const handleEditReview = (review) => {
    setSelectedProduct({
      _id: review.productId,
      name: review.productName,
      existingReview: review
    });
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (review) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.deleteReview(review._id);
              if (response.success) {
                Alert.alert('Success', 'Review deleted successfully');
                loadData(); // Refresh the data
              } else {
                Alert.alert('Error', response.error || 'Failed to delete review');
              }
            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Failed to delete review. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const getProductsNeedingReviews = () => {
    const productsNeedingReviews = [];
    
    console.log('Getting products needing reviews...');
    console.log('Pending reviews count:', pendingReviews.length);
    console.log('Orders count:', orders.length);
    console.log('User reviews count:', userReviews.length);
    
    // Add products from pending reviews
    pendingReviews.forEach(pendingReview => {
      productsNeedingReviews.push({
        _id: pendingReview.productId,
        name: pendingReview.productName,
        mainImage: pendingReview.productImage,
        price: pendingReview.productPrice,
        orderId: pendingReview.orderId,
        orderDate: pendingReview.createdAt,
        orderNumber: pendingReview.orderNumber,
        isPendingReview: true
      });
    });
    
    // Add products from orders that don't have reviews yet
    orders.forEach(order => {
      console.log('Processing order:', order.orderNumber, 'Status:', order.status);
      // Allow reviews for any order status (pending, completed, delivered, etc.)
      const items = order.items || order.products || [];
      console.log('Order items count:', items.length);
      items.forEach(item => {
        const productId = item._id || item.id || item.productId;
        
        // Check if user has already reviewed this product (more robust comparison)
        const existingReview = userReviews.find(review => {
          const reviewProductId = review.productId || review.productId;
          return String(reviewProductId) === String(productId) || 
                 String(reviewProductId) === String(item._id) ||
                 String(reviewProductId) === String(item.id);
        });
        
        // Check if product is already in pending reviews
        const existingPendingReview = pendingReviews.find(pending => {
          const pendingProductId = pending.productId || pending.productId;
          return String(pendingProductId) === String(productId) || 
                 String(pendingProductId) === String(item._id) ||
                 String(pendingProductId) === String(item.id);
        });
        
        if (!existingReview && !existingPendingReview) {
          console.log('Adding product for review:', item.name || item.title, 'Product ID:', productId);
          productsNeedingReviews.push({
            ...item,
            orderId: order._id,
            orderDate: order.createdAt,
            orderNumber: order.orderNumber
          });
        } else {
          console.log('Product already reviewed or pending:', item.name || item.title, 'Product ID:', productId);
          if (existingReview) {
            console.log('  - Already reviewed on:', new Date(existingReview.createdAt).toLocaleDateString());
          }
          if (existingPendingReview) {
            console.log('  - Already in pending reviews');
          }
        }
      });
    });

    console.log('Total products needing reviews:', productsNeedingReviews.length);
    return productsNeedingReviews;
  };

  const getReviewedProducts = () => {
    console.log('Getting reviewed products, userReviews count:', userReviews.length);
    const reviewedProducts = userReviews.map(review => {
      console.log('Processing review:', {
        reviewId: review._id,
        productId: review.productId,
        productName: review.productName,
        productImage: review.productImage,
        rating: review.rating
      });
      return {
        _id: review.productId,
        name: review.productName || 'Unknown Product',
        mainImage: review.productImage,
        review: review,
        reviewedAt: review.createdAt
      };
    });
    console.log('Reviewed products:', reviewedProducts.map(p => ({ id: p._id, name: p.name, hasImage: !!p.mainImage })));
    return reviewedProducts;
  };

  const renderProductCard = (product, isReviewed = false, uniqueKey) => {
    const review = isReviewed ? product.review : null;
    
    return (
      <Card key={uniqueKey} style={[styles.productCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.productRow}>
            {(product.mainImage || product.image || product.images?.[0]) ? (
              <Image
                source={{ 
                  uri: product.mainImage || product.image || product.images?.[0]
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.productImage, { backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="image-outline" size={24} color={colors.textTertiary} />
              </View>
            )}
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                {product.name || product.title}
              </Text>
              
              {isReviewed ? (
                <View style={styles.reviewInfo}>
                  <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"}
                        size={16}
                        color={star <= review.rating ? "#FFD700" : colors.textTertiary}
                      />
                    ))}
                    <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                      {review.rating}/5
                    </Text>
                  </View>
                  {review.comment && (
                    <Text style={[styles.reviewComment, { color: colors.textSecondary }]} numberOfLines={2}>
                      "{review.comment}"
                    </Text>
                  )}
                  <Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ) : (
                <View style={styles.orderInfo}>
                  <Text style={[styles.orderNumber, { color: colors.textSecondary }]}>
                    Order #{product.orderNumber}
                  </Text>
                  <Text style={[styles.orderDate, { color: colors.textTertiary }]}>
                    Purchased on {new Date(product.orderDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.actionRow}>
            {isReviewed ? (
              <View style={styles.reviewActions}>
                <Button
                  mode="outlined"
                  onPress={() => handleEditReview(review)}
                  style={[styles.editButton, { borderColor: colors.border }]}
                  textColor={colors.text}
                >
                  Edit
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleDeleteReview(review)}
                  style={[styles.deleteButton, { borderColor: colors.error }]}
                  textColor={colors.error}
                >
                  Delete
                </Button>
              </View>
            ) : (
              <Button
                mode="contained"
                onPress={() => handleWriteReview(product)}
                style={styles.reviewButton}
                buttonColor={colors.primary}
                icon="star-outline"
              >
                Write Review
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = (type) => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={type === 'pending' ? "star-outline" : "star"} 
        size={64} 
        color={colors.textTertiary} 
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {type === 'pending' ? 'No Products Pending Review' : 'No Reviews Yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {type === 'pending' 
          ? 'Products you\'ve purchased will appear here for review'
          : 'Your reviews will appear here once you write them'
        }
      </Text>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CoolHeader
          title="My Reviews"
          subtitle="Review Management"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sign In Required</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Please sign in to view and manage your reviews
          </Text>
        </View>
      </View>
    );
  }

  const pendingProducts = getProductsNeedingReviews();
  const reviewedProducts = getReviewedProducts();

  // Debug: Check for duplicate product IDs
  const pendingIds = pendingProducts.map(p => p._id);
  const reviewedIds = reviewedProducts.map(p => p._id);
  const duplicateIds = pendingIds.filter(id => reviewedIds.includes(id));
  
  if (duplicateIds.length > 0) {
    console.log('Found duplicate product IDs:', duplicateIds);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="My Reviews"
        subtitle={`${pendingProducts.length} pending, ${reviewedProducts.length} completed`}
        onBack={() => navigation.goBack()}
      />
      
      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'pending' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <Ionicons 
            name="star-outline" 
            size={20} 
            color={activeTab === 'pending' ? 'white' : colors.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'pending' ? 'white' : colors.text }
          ]}>
            Pending ({pendingProducts.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Ionicons 
            name="star" 
            size={20} 
            color={activeTab === 'completed' ? 'white' : colors.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'completed' ? 'white' : colors.text }
          ]}>
            Completed ({reviewedProducts.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading your reviews...
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            {activeTab === 'pending' ? (
              pendingProducts.length > 0 ? (
                pendingProducts.map((product, index) => renderProductCard(product, false, `pending-${product._id}-${index}`))
              ) : (
                renderEmptyState('pending')
              )
            ) : (
              reviewedProducts.length > 0 ? (
                reviewedProducts.map((product, index) => renderProductCard(product, true, `completed-${product._id}-${index}`))
              ) : (
                renderEmptyState('completed')
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={selectedProduct?._id || selectedProduct?.id}
        productName={selectedProduct?.name || selectedProduct?.title}
        onReviewSubmitted={handleReviewSubmitted}
        existingReview={selectedProduct?.existingReview}
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
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
  },
  actionRow: {
    alignItems: 'flex-end',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewButton: {
    borderRadius: 8,
  },
  editButton: {
    borderRadius: 8,
    flex: 1,
  },
  deleteButton: {
    borderRadius: 8,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
  },
}); 