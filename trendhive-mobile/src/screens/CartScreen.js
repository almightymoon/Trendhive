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
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import CoolHeader from '../components/CoolHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function CartScreen({ navigation }) {
  const { colors } = useTheme();
  const { showSuccess, showError } = useNotification();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);

  // Initialize selected items when cart changes
  useEffect(() => {
    const allItemIds = cartItems.map(item => item._id);
    setSelectedItems(allItemIds);
  }, [cartItems]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => {
            removeFromCart(productId);
            showSuccess('Item removed from cart');
          }},
        ]
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
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
    const allItemIds = cartItems.map(item => item._id);
    setSelectedItems(allItemIds);
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showError('Please sign in to proceed with checkout');
      return;
    }

    if (selectedItems.length === 0) {
      showError('Please select at least one item to checkout');
      return;
    }

    // Filter cart items to only include selected items
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item._id));
    navigation.navigate('Checkout', { selectedItems: selectedCartItems });
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => {
          clearCart();
          showSuccess('Cart cleared successfully');
        }, style: 'destructive' },
      ]
    );
  };

  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedCount = () => {
    return selectedItems.length;
  };

  const renderCartHeader = () => (
    <Card style={styles.headerCard}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.headerGradient}
      >
        <Card.Content style={styles.headerContent}>
          <View style={styles.cartInfo}>
            <Ionicons name="cart" size={48} color="white" />
            <View style={styles.cartText}>
              <Title style={styles.cartTitle}>Shopping Cart</Title>
              <Text style={styles.cartSubtitle}>
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </Text>
            </View>
          </View>
        </Card.Content>
      </LinearGradient>
    </Card>
  );

  const renderSelectionControls = () => (
    <Card style={[styles.selectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.selectionHeader}>
          <Text style={[styles.selectionTitle, { color: colors.text }]}>Select Items</Text>
          <Text style={[styles.selectionCount, { color: colors.textSecondary }]}>
            {getSelectedCount()} of {cartItems.length} selected
          </Text>
        </View>
        
        <View style={styles.selectionButtons}>
          <Button
            mode="outlined"
            onPress={selectAllItems}
            style={styles.selectionButton}
            textColor={colors.primary}
          >
            Select All
          </Button>
          <Button
            mode="outlined"
            onPress={deselectAllItems}
            style={styles.selectionButton}
            textColor={colors.error}
          >
            Clear All
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCartItem = (item) => {
    const isSelected = selectedItems.includes(item._id);
    const totalPrice = item.price * item.quantity;

    return (
      <Card key={item._id} style={[styles.cartItem, { backgroundColor: colors.card }, isSelected && styles.selectedItemCard]}>
        <Card.Content>
          <View style={styles.itemRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleItemSelection(item._id)}
            >
              <Ionicons
                name={isSelected ? "checkbox" : "square-outline"}
                size={24}
                color={isSelected ? colors.primary : colors.border}
              />
            </TouchableOpacity>
            
            <Card.Cover
              source={{ uri: item.mainImage || item.image }}
              style={styles.itemImage}
            />
            
            <View style={styles.itemDetails}>
              <Title style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                {item.name}
              </Title>
              <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                ${item.price.toFixed(2)} each
              </Text>
              <Text style={[styles.itemTotal, { color: colors.primary }]}>
                Total: ${totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.itemActions}>
            <View style={styles.quantitySection}>
              <Text style={[styles.quantityLabel, { color: colors.text }]}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color={item.quantity <= 1 ? colors.textTertiary : colors.primary} />
                </TouchableOpacity>
                
                <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item._id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                removeFromCart(item._id);
                showSuccess('Item removed from cart');
              }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Ionicons name="cart-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyCartTitle, { color: colors.text }]}>Your cart is empty</Text>
      <Text style={[styles.emptyCartText, { color: colors.textSecondary }]}>
        Add some products to get started with your shopping
      </Text>
      <Button
        mode="contained"
        style={styles.shopNowButton}
        buttonColor={colors.primary}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
      >
        Shop Now
      </Button>
    </View>
  );

  const renderCartSummary = () => (
    <Card style={[styles.summaryCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={[styles.clearCartText, { color: colors.error }]}>Clear Cart</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryItems}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Selected Items:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{getSelectedCount()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${getSelectedTotal().toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {getSelectedTotal() > 50 ? 'Free' : '$5.99'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Tax</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${(getSelectedTotal() * 0.08).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${(getSelectedTotal() + (getSelectedTotal() > 50 ? 0 : 5.99) + (getSelectedTotal() * 0.08)).toFixed(2)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Shopping Cart"
        subtitle={`${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`}
        showBack={false}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            {renderCartHeader()}
            <View style={styles.content}>
              {renderSelectionControls()}
              
              <View style={styles.cartItems}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Cart Items</Text>
                {cartItems.map(renderCartItem)}
              </View>
              
              {renderCartSummary()}
            </View>
          </>
        )}
      </ScrollView>
      
      {cartItems.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Button
            mode="contained"
            onPress={handleCheckout}
            style={styles.checkoutButton}
            disabled={getSelectedCount() === 0}
            buttonColor={colors.primary}
            textColor="white"
          >
            <Ionicons name="card-outline" size={20} color="white" />
            <Text style={styles.checkoutButtonText}>
              Checkout {getSelectedCount()} Item{getSelectedCount() !== 1 ? 's' : ''}
            </Text>
          </Button>
        </View>
      )}
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
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    marginLeft: 16,
    flex: 1,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cartSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  selectionCard: {
    marginBottom: 20,
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
  },
  selectionCount: {
    fontSize: 14,
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionButton: {
    flex: 1,
  },
  cartItems: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  cartItem: {
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
  itemTitle: {
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
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
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
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 30,
  },
  summaryCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearCartText: {
    fontWeight: '600',
  },
  summaryItems: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 15,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  checkoutButton: {
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
  checkoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 