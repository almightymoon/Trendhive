import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';
import ReviewPrompt from '../components/ReviewPrompt';

export default function OrdersScreen({ navigation }) {
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Refresh orders when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAuthenticated) {
        loadOrders();
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('Loading orders for user:', user);
      if (!user || (!user._id && !user.id)) {
        console.error('No user ID available');
        return;
      }
      const userId = user._id || user.id;
      console.log('Using user ID:', userId);
      const userOrders = await apiService.getOrders(userId);
      console.log('Orders loaded:', userOrders);
      console.log('Orders array length:', Array.isArray(userOrders) ? userOrders.length : 'Not an array');
      setOrders(Array.isArray(userOrders) ? userOrders : []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleDeleteOrder = async (order) => {
    console.log('handleDeleteOrder called with order:', order);
    console.log('User ID for deletion:', user._id || user.id);
    
    Alert.alert(
      'Delete Order',
      `Are you sure you want to delete Order #${order.orderNumber || order.orderId || order._id}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              console.log('Starting order deletion...');
              const userId = user._id || user.id;
              console.log('Using user ID:', userId);
              console.log('Order ID to delete:', order._id);
              
              const response = await apiService.deleteOrder(order._id, userId);
              console.log('Delete order response:', response);
              
              Alert.alert('Success', 'Order deleted successfully!');
              loadOrders(); // Reload the orders list
            } catch (error) {
              console.error('Error deleting order:', error);
              console.error('Error details:', JSON.stringify(error, null, 2));
              Alert.alert('Error', `Failed to delete order: ${error.message || error}`);
            }
          }
        }
      ]
    );
  };

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

  const renderOrderItem = (order) => (
    <Card key={order._id} style={[styles.orderCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View>
            <Title style={[styles.orderNumber, { color: colors.text }]}>Order #{order.orderNumber || order.orderId || order._id}</Title>
            <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
              {new Date(order.createdAt).toLocaleDateString()}
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

        <View style={styles.orderItems}>
          {order.items?.slice(0, 2).map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>x{item.quantity}</Text>
            </View>
          ))}
          {order.items?.length > 2 && (
            <Text style={[styles.moreItems, { color: colors.textSecondary }]}>
              +{order.items.length - 2} more items
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderTotal}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total:</Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>${order.total?.toFixed(2)}</Text>
          </View>
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate('OrderDetail', { order })}
            >
              <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Details</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
            {(order.status === 'completed' || order.status === 'delivered') && (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => {
                  const items = order.items || order.products || [];
                  if (items.length > 0) {
                    setSelectedOrder(order);
                    setShowReviewPrompt(true);
                  }
                }}
              >
                <Ionicons name="star-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteOrder(order)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color={colors.textTertiary} />
      <Title style={[styles.emptyTitle, { color: colors.text }]}>No Orders Yet</Title>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start shopping to see your order history here
      </Text>
      <TouchableOpacity
        style={[styles.shopNowButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
      >
        <Text style={styles.shopNowText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotAuthenticated = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-circle-outline" size={80} color={colors.textTertiary} />
      <Title style={[styles.emptyTitle, { color: colors.text }]}>Sign In Required</Title>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Please sign in to view your order history
      </Text>
      <TouchableOpacity
        style={[styles.shopNowButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.shopNowText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CoolHeader
          title="My Orders"
          subtitle="Sign in required"
          onBack={() => navigation.goBack()}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderNotAuthenticated()}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="My Orders"
        subtitle={`${orders.length} order${orders.length !== 1 ? 's' : ''}`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          renderEmptyOrders()
        ) : (
          <View style={styles.ordersContainer}>
            {orders.map(renderOrderItem)}
          </View>
        )}
      </ScrollView>

      {/* Review Prompt */}
      <ReviewPrompt
        visible={showReviewPrompt}
        onClose={() => {
          setShowReviewPrompt(false);
          setSelectedOrder(null);
        }}
        products={selectedOrder?.items || selectedOrder?.products || []}
        orderId={selectedOrder?._id}
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
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  shopNowButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopNowText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
    marginBottom: 15,
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
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  moreItems: {
    fontSize: 14,
    color: '#10B981',
    fontStyle: 'italic',
    marginTop: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginRight: 5,
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 15,
  },
  reviewButton: {
    marginLeft: 10,
  },
}); 