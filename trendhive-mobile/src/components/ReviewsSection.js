import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ReviewsSection({ productId, productName }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);


  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await apiService.getProductReviews(productId);
      
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



  const renderReviewItem = (review) => (
    <View key={review._id} style={[styles.reviewItem, { borderBottomColor: colors.border }]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
          </View>
          <View>
            <Text style={[styles.reviewerName, { color: colors.text }]}>
              {review.userName || 'Anonymous'}
            </Text>
            <View style={styles.starsContainer}>
              {renderStars(review.rating)}
            </View>
          </View>
        </View>
        <Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
          {new Date(review.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      {review.comment && (
        <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
          {review.comment}
        </Text>
      )}
    </View>
  );

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