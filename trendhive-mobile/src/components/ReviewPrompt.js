import React, { useState } from 'react';
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

export default function ReviewPrompt({ visible, onClose, products, orderId }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleSkip = () => {
    // Just close the prompt, don't mark reviews as completed
    // Products will still appear in pending reviews
    onClose();
  };

  if (!visible || !products || products.length === 0) {
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
              {products.map((product, index) => (
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
              ))}
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
                onPress={() => handleReviewProduct(products[0])}
                style={styles.reviewButton}
                buttonColor={colors.primary}
                icon="star-outline"
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