import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, TextInput, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import ReviewPrompt from '../components/ReviewPrompt';

export default function CheckoutScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [showShippingForm, setShowShippingForm] = useState(true);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  // Get selected items from route params or use all cart items as fallback
  const selectedItems = route.params?.selectedItems || cartItems;
  
  // Calculate totals based on selected items
  const getSelectedTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = getSelectedTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Load saved addresses when component mounts
  useEffect(() => {
    if (user && (user._id || user.id)) {
      loadSavedAddresses();
    }
  }, [user]);

  const loadSavedAddresses = async () => {
    try {
      const userId = user._id || user.id;
      const response = await apiService.getAddresses(userId);
      
      // Handle both old and new response formats
      if (Array.isArray(response)) {
        // New format: response is directly an array of addresses
        setSavedAddresses(response);
      } else if (response.success && response.addresses) {
        // Old format: response has success and addresses properties
        setSavedAddresses(response.addresses);
      } else {
        setSavedAddresses([]);
      }
    } catch (error) {
      console.error('Error loading saved addresses:', error);
      setSavedAddresses([]);
    }
  };

  const handleSelectAddress = (address) => {
    setShippingInfo({
      fullName: address.name || address.fullName || '',
      email: user?.email || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'United States',
    });
    setSelectedAddressId(address._id);
    setShowAddressSelector(false);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setShippingInfo({
      fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    });
    setShowAddressSelector(false);
  };

  const handleSaveCurrentAddress = async () => {
    if (!validateShippingInfo()) {
      Alert.alert('Error', 'Please fill in all required fields before saving');
      return;
    }

    try {
      const userId = user._id || user.id;
      const addressData = {
        userId,
        name: shippingInfo.fullName.trim(),
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
      };

      const response = await apiService.addAddress(addressData);
      if (response.success) {
        Alert.alert('Success', 'Address saved successfully!');
        // Reload saved addresses
        await loadSavedAddresses();
      } else {
        Alert.alert('Error', response.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  const updateShippingInfo = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const getTextInputTheme = () => ({
    colors: {
      primary: colors.primary,
      text: colors.text,
      placeholder: colors.textSecondary,
      background: colors.card,
      onSurface: colors.text,
      surface: colors.card,
      outline: colors.border,
      onSurfaceVariant: colors.primary,
      primaryContainer: colors.primary,
      onPrimaryContainer: '#ffffff',
      secondary: colors.primary,
      secondaryContainer: colors.primary,
      onSecondaryContainer: '#ffffff',
    }
  });

  const validateShippingInfo = () => {
    const required = ['fullName', 'email', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field]) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingInfo()) return;

    setLoading(true);
    try {
      if (!user || (!user._id && !user.id)) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const userId = user._id || user.id;
      const orderData = {
        userId,
        products: selectedItems, // Changed from items to products
        amount: total,
        total: total,
        shippingInfo, // Add shipping info
        paymentMethod,
        status: 'Pending',
        currency: 'usd',
        date: new Date(),
      };

      const order = await apiService.createOrder(orderData);
      
      if (order && order.success) {
        clearCart();
        Alert.alert(
          'Order Placed Successfully!',
          `Your order #${order.orderNumber || order.orderId || 'TH' + Date.now()} has been placed. You will receive a confirmation email shortly.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Show review prompt after successful order
                setShowReviewPrompt(true);
                navigation.navigate('Orders');
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAddressSelector = () => (
    <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={24} color={colors.primary} />
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Select Shipping Address</Title>
        </View>
        
        {savedAddresses.length > 0 && (
          <View style={styles.savedAddressesContainer}>
            <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Saved Addresses</Text>
            {savedAddresses.map((address) => (
              <TouchableOpacity
                key={address._id}
                style={[
                  styles.addressCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedAddressId === address._id && { borderColor: colors.primary, backgroundColor: colors.surfaceVariant }
                ]}
                onPress={() => handleSelectAddress(address)}
              >
                <View style={styles.addressContent}>
                  <Text style={[styles.addressName, { color: colors.text }]}>{address.name || address.fullName}</Text>
                  <Text style={[styles.addressText, { color: colors.textSecondary }]}>{address.address}</Text>
                  <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                    {address.city}, {address.state} {address.zipCode}
                  </Text>
                  <Text style={[styles.addressText, { color: colors.textSecondary }]}>{address.country}</Text>
                  <Text style={[styles.addressPhone, { color: colors.textSecondary }]}>{address.phone}</Text>
                </View>
                {selectedAddressId === address._id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.newAddressButton, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
          onPress={handleUseNewAddress}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.newAddressText, { color: colors.text }]}>Use New Address</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderShippingForm = () => (
    <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={24} color={colors.primary} />
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Shipping Information</Title>
        </View>
        
        {savedAddresses.length > 0 && (
          <TouchableOpacity
            style={[styles.savedAddressesButton, { backgroundColor: colors.surfaceVariant, borderColor: colors.primary }]}
            onPress={() => setShowAddressSelector(true)}
          >
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
            <Text style={[styles.savedAddressesText, { color: colors.primary }]}>
              Use Saved Address ({savedAddresses.length} available)
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        
          <TextInput
          label="Full Name"
          value={shippingInfo.fullName}
          onChangeText={(value) => updateShippingInfo('fullName', value)}
            mode="outlined"
          style={styles.input}
          theme={getTextInputTheme()}
          />

        <TextInput
          label="Email"
          value={shippingInfo.email}
          onChangeText={(value) => updateShippingInfo('email', value)}
          mode="outlined"
          style={styles.input}
          theme={getTextInputTheme()}
          keyboardType="email-address"
        />

        <TextInput
          label="Phone"
          value={shippingInfo.phone}
          onChangeText={(value) => updateShippingInfo('phone', value)}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          theme={getTextInputTheme()}
        />

        <TextInput
          label="Address"
          value={shippingInfo.address}
          onChangeText={(value) => updateShippingInfo('address', value)}
          mode="outlined"
          style={styles.input}
          multiline
          theme={getTextInputTheme()}
        />

        <View style={styles.formRow}>
          <TextInput
            label="City"
            value={shippingInfo.city}
            onChangeText={(value) => updateShippingInfo('city', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            theme={getTextInputTheme()}
          />
          <TextInput
            label="State"
            value={shippingInfo.state}
            onChangeText={(value) => updateShippingInfo('state', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            theme={getTextInputTheme()}
          />
        </View>

        <View style={styles.formRow}>
          <TextInput
            label="ZIP Code"
            value={shippingInfo.zipCode}
            onChangeText={(value) => updateShippingInfo('zipCode', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            keyboardType="numeric"
            theme={getTextInputTheme()}
          />
          <TextInput
            label="Country"
            value={shippingInfo.country}
            onChangeText={(value) => updateShippingInfo('country', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            theme={getTextInputTheme()}
          />
        </View>

        {savedAddresses.length > 0 && (
          <TouchableOpacity
            style={[styles.saveAddressButton, { backgroundColor: colors.surfaceVariant, borderColor: colors.primary }]}
            onPress={handleSaveCurrentAddress}
          >
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
            <Text style={[styles.saveAddressText, { color: colors.primary }]}>Save This Address</Text>
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={24} color={colors.primary} />
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Title>
        </View>

        <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
          <View style={[styles.paymentOption, { borderBottomColor: colors.border }]}>
            <RadioButton value="stripe" color={colors.primary} />
            <View style={styles.paymentOptionContent}>
              <Text style={[styles.paymentOptionTitle, { color: colors.text }]}>Credit/Debit Card</Text>
              <Text style={[styles.paymentOptionSubtitle, { color: colors.textSecondary }]}>Visa, Mastercard, American Express</Text>
            </View>
            <Ionicons name="card" size={24} color={colors.primary} />
          </View>

          <View style={[styles.paymentOption, { borderBottomColor: colors.border }]}>
            <RadioButton value="paypal" color={colors.primary} />
            <View style={styles.paymentOptionContent}>
              <Text style={[styles.paymentOptionTitle, { color: colors.text }]}>PayPal</Text>
              <Text style={[styles.paymentOptionSubtitle, { color: colors.textSecondary }]}>Pay with your PayPal account</Text>
            </View>
            <Ionicons name="logo-paypal" size={24} color={colors.primary} />
          </View>
        </RadioButton.Group>
      </Card.Content>
    </Card>
  );

  const renderOrderSummary = () => (
    <Card style={[styles.sectionCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="receipt-outline" size={24} color={colors.primary} />
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Title>
        </View>

        <View style={styles.orderItems}>
          {selectedItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>Qty: {item.quantity}</Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.orderTotals}>
          <View style={[styles.totalRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Subtotal</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Shipping</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          <View style={[styles.totalRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Tax</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal, { borderBottomColor: colors.border }]}>
            <Text style={[styles.finalTotalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.finalTotalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to complete your purchase.',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
        ]
      );
    }
  }, [user, navigation]);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Please sign in to continue...</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
        {showAddressSelector ? renderAddressSelector() : renderShippingForm()}
        {renderPaymentMethods()}
        {renderOrderSummary()}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Button
          mode="contained"
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading || selectedItems.length === 0}
          buttonColor={colors.primary}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.placeOrderText}> Place Order - ${total.toFixed(2)}</Text>
        </Button>
      </View>

      {/* Review Prompt */}
      <ReviewPrompt
        visible={showReviewPrompt}
        onClose={() => setShowReviewPrompt(false)}
        products={selectedItems}
        orderId={null}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  paymentOptionContent: {
    flex: 1,
    marginLeft: 10,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  orderItems: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderTotals: {
    borderTopWidth: 1,
    paddingTop: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  finalTotal: {
    borderTopWidth: 1,
    paddingTop: 15,
    marginTop: 10,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  placeOrderButton: {
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  savedAddressesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  savedAddressesText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  savedAddressesContainer: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  selectedAddressCard: {
    // Handled dynamically in component
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    marginTop: 5,
  },
  newAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  newAddressText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  saveAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
  },
  saveAddressText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
}); 