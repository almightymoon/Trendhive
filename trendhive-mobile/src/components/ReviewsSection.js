import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ReviewModal from './ReviewModal';

export default function ReviewsSection({ productId, productName }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Debug user context
  console.log('ReviewsSection - User context:', {
    user: user ? { id: user._id, email: user.email } : null,
    isAuthenticated: !!user
  });


  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      console.log('ReviewsSection - Loading reviews for productId:', productId);
      console.log('ReviewsSection - Current user:', user?._id);
      const reviewsData = await apiService.getProductReviews(productId);
      console.log('ReviewsSection - Loaded reviews:', reviewsData);
      
      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
        setTotalReviews(reviewsData.length);
        
        // Calculate average rating
        if (reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / reviewsData.length);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#FFD700" : "#D1D5DB"}
        />
      );
    }
    return stars;
  };

  const handleEditReview = (review) => {
    console.log('ReviewsSection - Edit review clicked:', review);
    console.log('ReviewsSection - Setting selectedReview:', {
      reviewId: review._id,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment
    });
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (review) => {
    console.log('ReviewsSection - Delete review clicked:', review);
    console.log('ReviewsSection - Review to delete:', {
      reviewId: review._id,
      productId: review.productId,
      userId: review.userId
    });
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
              console.log('ReviewsSection - Calling deleteReview API with reviewId:', review._id);
              const response = await apiService.deleteReview(review._id);
              console.log('ReviewsSection - Delete API response:', response);
              if (response.success) {
                Alert.alert('Success', 'Review deleted successfully');
                loadReviews(); // Refresh reviews
              } else {
                console.error('ReviewsSection - Delete API returned error:', response.error);
                Alert.alert('Error', response.error || 'Failed to delete review');
              }
            } catch (error) {
              console.error('ReviewsSection - Error deleting review:', error);
              console.error('ReviewsSection - Error details:', {
                message: error.message,
                status: error.status,
                response: error.response
              });
              Alert.alert('Error', 'Failed to delete review. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleReviewSubmitted = () => {
    setShowReviewModal(false);
    setSelectedReview(null);
    loadReviews(); // Refresh reviews
  };



  const renderReviewItem = (review) => {
    console.log('ReviewSection - Rendering review:', {
      reviewId: review._id,
      reviewUserId: review.userId,
      currentUserId: user?._id,
      userName: review.userName,
      isUserReview: user && review.userId === user._id
    });
    // More robust user ID comparison
    const isUserReview = user && (
      review.userId === user._id || 
      review.userId === user.id ||
      String(review.userId) === String(user._id) ||
      String(review.userId) === String(user.id)
    );
    
    return (
      <View key={review._id} style={[styles.reviewItem, { borderBottomColor: colors.border }]}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="person" size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.reviewerName, { color: colors.text }]}>
                {review.userName || 'Anonymous'}
                {isUserReview && ' (You)'}
              </Text>
              <View style={styles.starsContainer}>
                {renderStars(review.rating)}
              </View>
            </View>
          </View>
          <View style={styles.reviewActions}>
            <Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
            {/* Temporarily show buttons for all reviews to test */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: colors.border }]}
                onPress={() => handleEditReview(review)}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: colors.error }]}
                onPress={() => handleDeleteReview(review)}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
            {/* Original conditional code (commented out for testing):
            {isUserReview && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: colors.border }]}
                  onPress={() => handleEditReview(review)}
                >
                  <Ionicons name="create-outline" size={16} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: colors.error }]}
                  onPress={() => handleDeleteReview(review)}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            )}
            */}
          </View>
        </View>
        
        {review.comment && (
          <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
            {review.comment}
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <Card style={[styles.container, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.title, { color: colors.text }]}>Reviews</Title>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading reviews...</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      <Card style={[styles.container, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={[styles.title, { color: colors.text }]}>Reviews</Title>
            <View style={styles.ratingSummary}>
              <View style={styles.averageRating}>
                <Text style={[styles.ratingNumber, { color: colors.text }]}>{averageRating.toFixed(1)}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(Math.round(averageRating))}
                </View>
              </View>
              <Text style={[styles.totalReviews, { color: colors.textSecondary }]}>
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="star-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No reviews yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                No reviews yet for this product
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.reviewsList}>
              {reviews.map(renderReviewItem)}
            </ScrollView>
          )}
        </Card.Content>
      </Card>

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={productId}
        productName={productName}
        onReviewSubmitted={handleReviewSubmitted}
        existingReview={selectedReview}
      />
      {/* Debug: Log ReviewModal props */}
      {showReviewModal && (
        <View style={{ display: 'none' }}>
          {console.log('ReviewsSection - ReviewModal props:', {
            visible: showReviewModal,
            productId,
            productName,
            existingReview: selectedReview
          })}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  ratingSummary: {
    alignItems: 'center',
  },
  averageRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  totalReviews: {
    fontSize: 12,
    color: '#6b7280',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  reviewsList: {
    maxHeight: 300,
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewActions: {
    alignItems: 'flex-end',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

}); 