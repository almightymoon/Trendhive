import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';
import ReviewModal from '../components/ReviewModal';

export default function OrderDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { order } = route.params;
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();

  // Add debugging
  console.log('OrderDetailScreen - Received order:', order);
  console.log('OrderDetailScreen - Route params:', route.params);

  // Check if order exists
  if (!order) {
    console.error('OrderDetailScreen - No order data received');
    return (
      <View style={styles.container}>
        <CoolHeader
          title="Order Details"
          subtitle="Error"
          onBack={() => navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#ef4444', textAlign: 'center' }}>
            No order data received. Please go back and try again.
          </Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'transit':
        return '#8b5cf6';
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'settings-outline';
      case 'transit':
        return 'car-outline';
      case 'shipped':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getStatusDescription = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Your order has been placed and is awaiting confirmation.';
      case 'processing':
        return 'Your order is being prepared for shipment.';
      case 'transit':
        return 'Your order is in transit and on its way to you.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been successfully delivered.';
      case 'completed':
        return 'Your order has been completed.';
      case 'cancelled':
        return 'Your order has been cancelled.';
      default:
        return 'Order status is being updated.';
    }
  };

  const handleTrackOrder = () => {
    Alert.alert('Track Order', 'Order tracking feature coming soon!');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Support contact feature coming soon!');
  };

  const handleReorder = async () => {
    // Navigate to the dedicated reorder screen
    navigation.navigate('Reorder', { order });
  };

  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
    // Optionally refresh the order data or show success message
  };

  const renderOrderHeader = () => (
    <Card style={[styles.headerCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View>
            <Title style={[styles.orderNumber, { color: colors.text }]}>
              Order #{order.orderNumber || order.orderId || order._id}
            </Title>
            <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) + '20' }]}
            textStyle={[styles.statusText, { color: getStatusColor(order.status) }]}
          >
            <Ionicons
              name={getStatusIcon(order.status)}
              size={16}
              color={getStatusColor(order.status)}
              style={{ marginRight: 5 }}
            />
            {order.status}
          </Chip>
        </View>
        
        <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
          {getStatusDescription(order.status)}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderOrderItems = () => {
    console.log('OrderDetailScreen - Rendering order items:', order.items);
    console.log('OrderDetailScreen - Order structure:', JSON.stringify(order, null, 2));
    
    // Handle different possible data structures
    const items = order.items || order.products || [];
    const isCompleted = order.status === 'completed' || order.status === 'delivered';
    
    if (items.length === 0) {
          return (
      <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Title>
          <Text style={[styles.noItemsText, { color: colors.textSecondary }]}>
            No items found in this order. This might be due to a data issue during order creation.
          </Text>
          <Text style={[styles.noItemsText, { color: colors.textSecondary }]}>
            Order Total: ${(order.total || order.amount || order.price || 0).toFixed(2)}
          </Text>
        </Card.Content>
      </Card>
    );
    }

    return (
      <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Order Items</Title>
          {items.map((item, index) => {
            console.log('Rendering item:', item);
            return (
              <View key={index} style={styles.orderItem}>
                <Image
                  source={{ uri: item.mainImage || item.image || item.images?.[0] }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                    {item.name || item.title}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    ${(item.price || 0).toFixed(2)}
                  </Text>
                  <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
                    Quantity: {item.quantity || 1}
                  </Text>
                  {isCompleted && (
                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => handleWriteReview(item)}
                    >
                      <Ionicons name="star-outline" size={16} color="#10B981" />
                      <Text style={styles.reviewButtonText}>Write Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.itemTotal}>
                  <Text style={[styles.itemTotalText, { color: colors.text }]}>
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card.Content>
      </Card>
    );
  };

  const renderShippingInfo = () => {
    console.log('OrderDetailScreen - Shipping info:', order.shippingInfo);
    console.log('OrderDetailScreen - User info:', order.user);
    console.log('OrderDetailScreen - Full order data:', JSON.stringify(order, null, 2));
    
    // Get shipping info from multiple possible sources
    const shippingData = order.shippingInfo || order.user || {};
    
    // Check if we have any meaningful shipping data
    const hasShippingData = shippingData.fullName || shippingData.name || 
                           shippingData.email || shippingData.address ||
                           shippingData.phone || shippingData.city;
    
    if (!hasShippingData) {
          return (
      <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Shipping Information</Title>
          <Text style={[styles.noItemsText, { color: colors.textSecondary }]}>
            No shipping information available for this order.
          </Text>
          <Text style={[styles.noItemsText, { color: colors.textSecondary }]}>
            Order was created without shipping details.
          </Text>
        </Card.Content>
      </Card>
    );
    }
    
    return (
      <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Shipping Information</Title>
                      <View style={styles.shippingInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {shippingData.fullName || shippingData.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {shippingData.email || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {shippingData.phone || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                {shippingData.address || 'N/A'}
              </Text>
            </View>
            {(shippingData.city || shippingData.state || shippingData.zipCode) && (
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {shippingData.city && shippingData.state && shippingData.zipCode
                    ? `${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`
                    : [shippingData.city, shippingData.state, shippingData.zipCode].filter(Boolean).join(', ') || 'N/A'
                  }
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Ionicons name="flag-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {shippingData.country || 'N/A'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderPaymentInfo = () => (
    <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
                  <Title style={[styles.sectionTitle, { color: colors.text }]}>Payment Information</Title>
          <View style={styles.paymentInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Payment Method: {order.paymentMethod || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Payment Status: Paid
              </Text>
            </View>
          </View>
      </Card.Content>
    </Card>
  );

  const renderOrderSummary = () => {
    const orderTotal = order.total || order.amount || order.price || 0;
    
    return (
      <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Title>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Order Number:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {order.orderNumber || order.orderId || order._id}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Date:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {new Date(order.date || order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Status:</Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>
                {order.status || 'Pending'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Payment Method:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {order.paymentMethod || 'Unknown'}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>${orderTotal.toFixed(2)}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        style={styles.actionButton}
        onPress={handleTrackOrder}
        icon="map-outline"
        textColor={colors.text}
      >
        Track Order
      </Button>
      <Button
        mode="outlined"
        style={styles.actionButton}
        onPress={handleContactSupport}
        icon="help-circle-outline"
        textColor={colors.text}
      >
        Contact Support
      </Button>
      <Button
        mode="contained"
        style={[styles.actionButton, styles.reorderButton]}
        onPress={handleReorder}
        icon="refresh"
        buttonColor={colors.primary}
        textColor="white"
      >
        Reorder
      </Button>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Order Details"
        subtitle={`Order #${order.orderNumber || order.orderId || order._id}`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
        {renderOrderHeader()}
        {renderOrderItems()}
        {renderShippingInfo()}
        {renderPaymentInfo()}
        {renderOrderSummary()}
        {renderActionButtons()}
      </ScrollView>
      
      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productId={selectedProduct?._id || selectedProduct?.id}
        productName={selectedProduct?.name || selectedProduct?.title}
        onReviewSubmitted={handleReviewSubmitted}
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
  headerCard: {
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
  },
  statusChip: {
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    marginBottom: 4,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  reviewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shippingInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  paymentInfo: {
    gap: 10,
  },
  summaryContainer: {
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    margin: 20,
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    marginBottom: 10,
    borderRadius: 12,
    paddingVertical: 8,
  },
  reorderButton: {
    backgroundColor: '#10B981',
  },
  noItemsText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
}); 