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
import CoolHeader from '../components/CoolHeader';

export default function OrderDetailScreen({ route, navigation }) {
  const { order } = route.params;
  const [loading, setLoading] = useState(false);

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
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
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
      case 'shipped':
        return 'car-outline';
      case 'delivered':
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
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been successfully delivered.';
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

  const handleReorder = () => {
    Alert.alert('Reorder', 'Reorder feature coming soon!');
  };

  const renderOrderHeader = () => (
    <Card style={styles.headerCard}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View>
            <Title style={styles.orderNumber}>
              Order #{order.orderNumber || order.orderId || order._id}
            </Title>
            <Text style={styles.orderDate}>
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
        
        <Text style={styles.statusDescription}>
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
    
    if (items.length === 0) {
      return (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Order Items</Title>
            <Text style={styles.noItemsText}>
              No items found in this order. This might be due to a data issue during order creation.
            </Text>
            <Text style={styles.noItemsText}>
              Order Total: ${(order.total || order.amount || order.price || 0).toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Order Items</Title>
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
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name || item.title}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price || 0).toFixed(2)}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Quantity: {item.quantity || 1}
                  </Text>
                </View>
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalText}>
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
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Shipping Information</Title>
            <Text style={styles.noItemsText}>
              No shipping information available for this order.
            </Text>
            <Text style={styles.noItemsText}>
              Order was created without shipping details.
            </Text>
          </Card.Content>
        </Card>
      );
    }
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Shipping Information</Title>
          <View style={styles.shippingInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                {shippingData.fullName || shippingData.name || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                {shippingData.email || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                {shippingData.phone || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                {shippingData.address || 'N/A'}
              </Text>
            </View>
            {(shippingData.city || shippingData.state || shippingData.zipCode) && (
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={20} color="#6b7280" />
                <Text style={styles.infoText}>
                  {shippingData.city && shippingData.state && shippingData.zipCode
                    ? `${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`
                    : [shippingData.city, shippingData.state, shippingData.zipCode].filter(Boolean).join(', ') || 'N/A'
                  }
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Ionicons name="flag-outline" size={20} color="#6b7280" />
              <Text style={styles.infoText}>
                {shippingData.country || 'N/A'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderPaymentInfo = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Payment Information</Title>
        <View style={styles.paymentInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color="#6b7280" />
            <Text style={styles.infoText}>
              Payment Method: {order.paymentMethod || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
            <Text style={styles.infoText}>
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
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Order Summary</Title>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order Number:</Text>
              <Text style={styles.summaryValue}>
                {order.orderNumber || order.orderId || order._id}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {new Date(order.date || order.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status:</Text>
              <Text style={[styles.summaryValue, styles.statusText]}>
                {order.status || 'Pending'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method:</Text>
              <Text style={styles.summaryValue}>
                {order.paymentMethod || 'Unknown'}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${orderTotal.toFixed(2)}</Text>
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
        textColor="#000000"
      >
        Track Order
      </Button>
      <Button
        mode="outlined"
        style={styles.actionButton}
        onPress={handleContactSupport}
        icon="help-circle-outline"
        textColor="#000000"
      >
        Contact Support
      </Button>
      <Button
        mode="contained"
        style={[styles.actionButton, styles.reorderButton]}
        onPress={handleReorder}
        icon="refresh"
        buttonColor="#10B981"
        textColor="white"
      >
        Reorder
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <CoolHeader
        title="Order Details"
        subtitle={`Order #${order.orderNumber || order.orderId || order._id}`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView}>
        {renderOrderHeader()}
        {renderOrderItems()}
        {renderShippingInfo()}
        {renderPaymentInfo()}
        {renderOrderSummary()}
        {renderActionButtons()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: 20,
    marginBottom: 10,
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
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
    color: '#6b7280',
    lineHeight: 20,
  },
  sectionCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    color: '#1f2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
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
    color: '#374151',
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
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
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
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 10,
  },
}); 