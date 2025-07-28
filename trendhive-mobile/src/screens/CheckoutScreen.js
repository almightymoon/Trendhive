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
import { apiService } from '../services/apiService';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function CheckoutScreen({ navigation }) {
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

  const subtotal = getCartTotal();
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
        products: cartItems, // Changed from items to products
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
              onPress: () => navigation.navigate('Orders'),
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
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={24} color="#10B981" />
          <Title style={styles.sectionTitle}>Select Shipping Address</Title>
        </View>
        
        {savedAddresses.length > 0 && (
          <View style={styles.savedAddressesContainer}>
            <Text style={styles.sectionSubtitle}>Saved Addresses</Text>
            {savedAddresses.map((address) => (
              <TouchableOpacity
                key={address._id}
                style={[
                  styles.addressCard,
                  selectedAddressId === address._id && styles.selectedAddressCard
                ]}
                onPress={() => handleSelectAddress(address)}
              >
                <View style={styles.addressContent}>
                  <Text style={styles.addressName}>{address.name || address.fullName}</Text>
                  <Text style={styles.addressText}>{address.address}</Text>
                  <Text style={styles.addressText}>
                    {address.city}, {address.state} {address.zipCode}
                  </Text>
                  <Text style={styles.addressText}>{address.country}</Text>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                </View>
                {selectedAddressId === address._id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <TouchableOpacity
          style={styles.newAddressButton}
          onPress={handleUseNewAddress}
        >
          <Ionicons name="add-circle-outline" size={20} color="#10B981" />
          <Text style={styles.newAddressText}>Use New Address</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderShippingForm = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={24} color="#10B981" />
          <Title style={styles.sectionTitle}>Shipping Information</Title>
        </View>
        
        {savedAddresses.length > 0 && (
          <TouchableOpacity
            style={styles.savedAddressesButton}
            onPress={() => setShowAddressSelector(true)}
          >
            <Ionicons name="bookmark-outline" size={20} color="#10B981" />
            <Text style={styles.savedAddressesText}>
              Use Saved Address ({savedAddresses.length} available)
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#10B981" />
          </TouchableOpacity>
        )}
        
          <TextInput
          label="Full Name"
          value={shippingInfo.fullName}
          onChangeText={(value) => updateShippingInfo('fullName', value)}
            mode="outlined"
          style={styles.input}
          theme={{
            colors: {
              primary: '#10B981',
              text: '#000000',
              placeholder: '#666666',
              background: 'white',
              onSurface: '#000000',
              surface: 'white',
              outline: '#d1d5db',
              onSurfaceVariant: '#10B981',
              primaryContainer: '#10B981',
              onPrimaryContainer: '#ffffff',
              secondary: '#10B981',
              secondaryContainer: '#10B981',
              onSecondaryContainer: '#ffffff',
            }
          }}
          />

        <TextInput
          label="Email"
          value={shippingInfo.email}
          onChangeText={(value) => updateShippingInfo('email', value)}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          theme={{
            colors: {
              primary: '#10B981',
              text: '#000000',
              placeholder: '#666666',
              background: 'white',
              onSurface: '#000000',
              surface: 'white',
              outline: '#d1d5db',
              onSurfaceVariant: '#10B981',
              primaryContainer: '#10B981',
              onPrimaryContainer: '#ffffff',
              secondary: '#10B981',
              secondaryContainer: '#10B981',
              onSecondaryContainer: '#ffffff',
            }
          }}
        />

        <TextInput
          label="Phone"
          value={shippingInfo.phone}
          onChangeText={(value) => updateShippingInfo('phone', value)}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          theme={{
            colors: {
              primary: '#10B981',
              text: '#000000',
              placeholder: '#666666',
              background: 'white',
              onSurface: '#000000',
              surface: 'white',
              outline: '#d1d5db',
              onSurfaceVariant: '#10B981',
              primaryContainer: '#10B981',
              onPrimaryContainer: '#ffffff',
              secondary: '#10B981',
              secondaryContainer: '#10B981',
              onSecondaryContainer: '#ffffff',
            }
          }}
        />

        <TextInput
          label="Address"
          value={shippingInfo.address}
          onChangeText={(value) => updateShippingInfo('address', value)}
          mode="outlined"
          style={styles.input}
          multiline
          theme={{
            colors: {
              primary: '#10B981',
              text: '#000000',
              placeholder: '#666666',
              background: 'white',
              onSurface: '#000000',
              surface: 'white',
              outline: '#d1d5db',
              onSurfaceVariant: '#10B981',
              primaryContainer: '#10B981',
              onPrimaryContainer: '#ffffff',
              secondary: '#10B981',
              secondaryContainer: '#10B981',
              onSecondaryContainer: '#ffffff',
            }
          }}
        />

        <View style={styles.formRow}>
          <TextInput
            label="City"
            value={shippingInfo.city}
            onChangeText={(value) => updateShippingInfo('city', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          <TextInput
            label="State"
            value={shippingInfo.state}
            onChangeText={(value) => updateShippingInfo('state', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
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
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          <TextInput
            label="Country"
            value={shippingInfo.country}
            onChangeText={(value) => updateShippingInfo('country', value)}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
        </View>

        {savedAddresses.length > 0 && (
          <TouchableOpacity
            style={styles.saveAddressButton}
            onPress={handleSaveCurrentAddress}
          >
            <Ionicons name="bookmark-outline" size={20} color="#10B981" />
            <Text style={styles.saveAddressText}>Save This Address</Text>
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={24} color="#10B981" />
          <Title style={styles.sectionTitle}>Payment Method</Title>
        </View>

        <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
          <View style={styles.paymentOption}>
            <RadioButton value="stripe" color="#10B981" />
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentOptionSubtitle}>Visa, Mastercard, American Express</Text>
            </View>
            <Ionicons name="card" size={24} color="#10B981" />
          </View>

          <View style={styles.paymentOption}>
            <RadioButton value="paypal" color="#10B981" />
            <View style={styles.paymentOptionContent}>
              <Text style={styles.paymentOptionTitle}>PayPal</Text>
              <Text style={styles.paymentOptionSubtitle}>Pay with your PayPal account</Text>
            </View>
            <Ionicons name="logo-paypal" size={24} color="#10B981" />
          </View>
        </RadioButton.Group>
      </Card.Content>
    </Card>
  );

  const renderOrderSummary = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Ionicons name="receipt-outline" size={24} color="#10B981" />
          <Title style={styles.sectionTitle}>Order Summary</Title>
        </View>

        <View style={styles.orderItems}>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.orderTotals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>${total.toFixed(2)}</Text>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please sign in to continue...</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.scrollView}>
        {showAddressSelector ? renderAddressSelector() : renderShippingForm()}
        {renderPaymentMethods()}
        {renderOrderSummary()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading || cartItems.length === 0}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.placeOrderText}> Place Order - ${total.toFixed(2)}</Text>
        </Button>
      </View>
    </SafeAreaWrapper>
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
  sectionCard: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  halfInput: {
    flex: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  paymentOptionContent: {
    flex: 1,
    marginLeft: 10,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
    borderBottomColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  orderTotals: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 15,
    marginTop: 10,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  placeOrderButton: {
    backgroundColor: '#10B981',
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
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  savedAddressesText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  savedAddressesContainer: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedAddressCard: {
    borderColor: '#10B981',
    backgroundColor: '#f0fdf4',
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  newAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  newAddressText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  saveAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  saveAddressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
}); 