import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';

export default function ReviewModal({ visible, onClose, productId, productName, onReviewSubmitted, existingReview }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  console.log('ReviewModal - Props received:', {
    visible,
    productId,
    productName,
    existingReview: existingReview ? {
      _id: existingReview._id,
      rating: existingReview.rating,
      comment: existingReview.comment,
      productId: existingReview.productId
    } : null
  });
  
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarPress = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating);
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a review comment');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please sign in to submit a review');
      return;
    }

    console.log('ReviewModal - User authentication check:', {
      user: user ? 'User logged in' : 'No user',
      userId: user?._id || user?.id,
      userEmail: user?.email
    });

    console.log('ReviewModal - Submitting review with data:', {
      productId,
      rating,
      comment: comment.trim(),
      user: user ? 'User logged in' : 'No user',
      isEditing: !!existingReview
    });

    // Validate productId
    if (!productId) {
      Alert.alert('Error', 'Product ID is missing');
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        productId: productId.toString(), // Ensure it's a string
        rating: parseInt(rating), // Ensure it's a number
        comment: comment.trim(),
      };

      // If editing existing review, include the review ID
      if (existingReview) {
        reviewData.reviewId = existingReview._id;
      }

      console.log('ReviewModal - Calling apiService.submitReview with:', reviewData);
      const response = await apiService.submitReview(reviewData);
      console.log('ReviewModal - API response:', response);
      
      if (response.success) {
        Alert.alert('Success', existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
        setRating(0);
        setComment('');
        onReviewSubmitted();
        onClose();
      } else {
        console.error('ReviewModal - API returned error:', response.error);
        Alert.alert('Error', response.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('ReviewModal - Error submitting review:', error);
      console.error('ReviewModal - Error details:', {
        message: error.message,
        response: error.response,
        status: error.status,
        errorType: typeof error,
        errorKeys: Object.keys(error || {}),
        fullError: JSON.stringify(error, null, 2)
      });
      
      // Handle different error formats
      let errorMessage = 'Failed to submit review';
      if (error && typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.message) {
        errorMessage = error.message;
      } else if (error && error.error) {
        errorMessage = error.error;
      } else if (error && error.details) {
        errorMessage = error.details;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = hoveredRating || rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          onPressIn={() => handleStarHover(i)}
          onPressOut={() => setHoveredRating(0)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= currentRating ? "star" : "star-outline"}
            size={32}
            color={i <= currentRating ? "#FFD700" : "#D1D5DB"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const getRatingText = () => {
    if (rating === 0) return 'Select Rating';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return '';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Title style={[styles.modalTitle, { color: colors.text }]}>
              {existingReview ? 'Edit Review' : 'Write a Review'}
            </Title>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.productName, { color: colors.textSecondary }]}>
              {productName}
            </Text>

            <View style={styles.ratingSection}>
              <Text style={[styles.ratingLabel, { color: colors.text }]}>Your Rating</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
              {rating > 0 && (
                <Text style={[styles.ratingText, { color: colors.primary }]}>
                  {getRatingText()}
                </Text>
              )}
            </View>

            <View style={styles.commentSection}>
              <Text style={[styles.commentLabel, { color: colors.text }]}>Your Review</Text>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={6}
                placeholder="Share your experience with this product..."
                value={comment}
                onChangeText={setComment}
                style={styles.commentInput}
                theme={{
                  colors: {
                    primary: colors.primary,
                    text: colors.text,
                    placeholder: colors.textSecondary,
                    background: colors.surface,
                    onSurface: colors.text,
                    surface: colors.surface,
                    outline: colors.border,
                    onSurfaceVariant: colors.primary,
                    primaryContainer: colors.primary,
                    onPrimaryContainer: '#ffffff',
                    secondary: colors.primary,
                    secondaryContainer: colors.primary,
                    onSecondaryContainer: '#ffffff',
                  }
                }}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={[styles.cancelButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Cancel
            </Button>
                                    <Button
                          mode="contained"
                          onPress={handleSubmitReview}
                          loading={loading}
                          disabled={loading || rating === 0 || !comment.trim()}
                          style={styles.submitButton}
                          buttonColor={colors.primary}
                        >
                          {existingReview ? 'Update Review' : 'Submit Review'}
                        </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentSection: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: 'transparent',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
  },
  submitButton: {
    flex: 2,
    borderRadius: 8,
  },
}); 