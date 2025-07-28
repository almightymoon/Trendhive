import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import CoolHeader from '../components/CoolHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReorderScreen({ route, navigation }) {
  const { order } = route.params;
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (order) {
      const items = order.items || order.products || [];
      const formattedItems = items.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        selected: true,
        originalQuantity: item.quantity || 1,
      }));
      setOrderItems(formattedItems);
      setSelectedItems(formattedItems.map(item => item._id || item.id || item.productId));
    }
  }, [order]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setOrderItems(prev => prev.map(item => {
      const itemIdToCheck = item._id || item.id || item.productId;
      if (itemIdToCheck === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const selectAllItems = () => {
    const allItemIds = orderItems.map(item => item._id || item.id || item.productId);
    setSelectedItems(allItemIds);
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const handleReorder = async () => {
    if (selectedItems.length === 0) {
      showError('Please select at least one item to reorder');
      return;
    }

    setLoading(true);
    try {
      let addedCount = 0;
      
      for (const item of orderItems) {
        const itemId = item._id || item.id || item.productId;
        if (selectedItems.includes(itemId)) {
          const product = {
            _id: itemId,
            name: item.name || item.title,
            price: item.price || 0,
            mainImage: item.mainImage || item.image || item.images?.[0],
            quantity: item.quantity,
          };
          
          addToCart(product, item.quantity);
          addedCount++;
        }
      }

      showSuccess(`${addedCount} item${addedCount > 1 ? 's' : ''} added to cart!`);
      
      // Navigate to cart after a short delay
      setTimeout(() => {
        navigation.navigate('Cart');
      }, 1500);
      
    } catch (error) {
      console.error('Reorder error:', error);
      showError('Failed to reorder items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return orderItems
      .filter(item => selectedItems.includes(item._id || item.id || item.productId))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedCount = () => {
    return selectedItems.length;
  };

  const renderOrderHeader = () => (
    <Card style={styles.headerCard}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.headerGradient}
      >
        <Card.Content style={styles.headerContent}>
          <View style={styles.orderInfo}>
            <Ionicons name="refresh-circle" size={48} color="white" />
            <View style={styles.orderText}>
              <Title style={styles.orderTitle}>Reorder Items</Title>
              <Text style={styles.orderSubtitle}>
                Order #{order.orderNumber || order.orderId || order._id?.toString().slice(-8)}
              </Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt || order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </Card.Content>
      </LinearGradient>
    </Card>
  );

  const renderItemCard = (item, index) => {
    const itemId = item._id || item.id || item.productId;
    const isSelected = selectedItems.includes(itemId);
    const totalPrice = (item.price || 0) * item.quantity;

    return (
      <Card key={index} style={[styles.itemCard, isSelected && styles.selectedItemCard]}>
        <Card.Content>
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleItemSelection(itemId)}
            >
              <Ionicons
                name={isSelected ? "checkbox" : "square-outline"}
                size={24}
                color={isSelected ? "#10B981" : "#D1D5DB"}
              />
            </TouchableOpacity>
            
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
                ${(item.price || 0).toFixed(2)} each
              </Text>
              <Text style={styles.itemTotal}>
                Total: ${totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(itemId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={item.quantity <= 1 ? "#9CA3AF" : "#10B981"} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(itemId, item.quantity + 1)}
              >
                <Ionicons name="add" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderSelectionControls = () => (
    <Card style={styles.selectionCard}>
      <Card.Content>
        <View style={styles.selectionHeader}>
          <Text style={styles.selectionTitle}>Select Items</Text>
          <Text style={styles.selectionCount}>
            {getSelectedCount()} of {orderItems.length} selected
          </Text>
        </View>
        
        <View style={styles.selectionButtons}>
          <Button
            mode="outlined"
            onPress={selectAllItems}
            style={styles.selectionButton}
            textColor="#10B981"
          >
            Select All
          </Button>
          <Button
            mode="outlined"
            onPress={deselectAllItems}
            style={styles.selectionButton}
            textColor="#EF4444"
          >
            Clear All
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSummary = () => (
    <Card style={styles.summaryCard}>
      <Card.Content>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Selected Items:</Text>
          <Text style={styles.summaryValue}>{getSelectedCount()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Price:</Text>
          <Text style={styles.summaryTotal}>${getTotalPrice().toFixed(2)}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <CoolHeader
        title="Reorder"
        subtitle={`Order #${order.orderNumber || order.orderId || order._id?.toString().slice(-8)}`}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderOrderHeader()}
        
        <View style={styles.content}>
          {renderSelectionControls()}
          
          <View style={styles.itemsContainer}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {orderItems.map((item, index) => renderItemCard(item, index))}
          </View>
          
          {renderSummary()}
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleReorder}
          style={styles.reorderButton}
          loading={loading}
          disabled={loading || getSelectedCount() === 0}
          buttonColor="#10B981"
          textColor="white"
        >
          <Ionicons name="cart" size={20} color="white" />
          <Text style={styles.reorderButtonText}>
            Add {getSelectedCount()} Item{getSelectedCount() !== 1 ? 's' : ''} to Cart
          </Text>
        </Button>
      </View>
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
  content: {
    padding: 20,
  },
  headerCard: {
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerGradient: {
    borderRadius: 16,
  },
  headerContent: {
    padding: 24,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderText: {
    marginLeft: 16,
    flex: 1,
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  orderSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectionCard: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  selectionCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionButton: {
    flex: 1,
    borderColor: '#d1d5db',
  },
  itemsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  itemCard: {
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  selectedItemCard: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
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
  itemTotal: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bottomBar: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  reorderButton: {
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  reorderButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 