import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Title, Card, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ShippingAddressesScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      if (!user || (!user._id && !user.id)) {
        console.error('No user ID available for addresses');
        return;
      }
      const userId = user._id || user.id;
      console.log('Loading addresses for user:', userId);
      const response = await apiService.getAddresses(userId);
      
      // Handle both old and new response formats
      if (Array.isArray(response)) {
        // New format: response is directly an array of addresses
        setAddresses(response);
      } else if (response.success && response.addresses) {
        // Old format: response has success and addresses properties
        setAddresses(response.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Load addresses error:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!user || (!user._id && !user.id)) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      const userId = user._id || user.id;
      // Convert name to fullName to match backend expectations
      const addressData = { 
        ...formData, 
        fullName: formData.name, // Convert name to fullName
        userId 
      };
      
      const response = editingAddress
        ? await apiService.updateAddress(editingAddress.id, addressData)
        : await apiService.addAddress(addressData);

      if (response.success) {
        Alert.alert('Success', editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        setShowAddForm(false);
        setEditingAddress(null);
        resetForm();
        loadAddresses();
      } else {
        Alert.alert('Error', response.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Save address error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user || (!user._id && !user.id)) {
                Alert.alert('Error', 'User not authenticated');
                return;
              }
              const userId = user._id || user.id;
              const response = await apiService.deleteAddress(addressId, userId);
              if (response.success) {
                Alert.alert('Success', 'Address deleted successfully!');
                loadAddresses();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete address');
              }
            } catch (error) {
              console.error('Delete address error:', error);
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || address.fullName || '', // Handle both name and fullName
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || '',
      isDefault: address.isDefault || false,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    setErrors({});
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTextInputTheme = (hasError = false) => ({
    colors: {
      primary: colors.primary,
      text: colors.text,
      placeholder: colors.textSecondary,
      background: colors.card,
      onSurface: colors.text,
      surface: colors.card,
      outline: hasError ? colors.error : colors.border,
      onSurfaceVariant: colors.primary,
      primaryContainer: colors.primary,
      onPrimaryContainer: '#ffffff',
      secondary: colors.primary,
      secondaryContainer: colors.primary,
      onSecondaryContainer: '#ffffff',
    }
  });

  const renderAddressForm = () => (
    <Card style={[styles.formCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Title style={[styles.formTitle, { color: colors.text }]}>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </Title>

        <TextInput
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          mode="outlined"
          style={[styles.input, errors.name ? styles.inputError : null]}
          error={!!errors.name}
          theme={getTextInputTheme(!!errors.name)}
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <TextInput
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          mode="outlined"
          style={[styles.input, errors.phone ? styles.inputError : null]}
          keyboardType="phone-pad"
          error={!!errors.phone}
          theme={getTextInputTheme(!!errors.phone)}
        />
        {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

        <TextInput
          label="Street Address"
          value={formData.address}
          onChangeText={(text) => updateField('address', text)}
          mode="outlined"
          style={[styles.input, errors.address ? styles.inputError : null]}
          multiline
          numberOfLines={2}
          error={!!errors.address}
          theme={getTextInputTheme(!!errors.address)}
        />
        {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

        <View style={styles.row}>
          <TextInput
            label="City"
            value={formData.city}
            onChangeText={(text) => updateField('city', text)}
            mode="outlined"
            style={[styles.halfInput, errors.city ? styles.inputError : null]}
            error={!!errors.city}
            theme={getTextInputTheme(!!errors.city)}
          />
          <TextInput
            label="State"
            value={formData.state}
            onChangeText={(text) => updateField('state', text)}
            mode="outlined"
            style={[styles.halfInput, errors.state ? styles.inputError : null]}
            error={!!errors.state}
            theme={getTextInputTheme(!!errors.state)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="ZIP Code"
            value={formData.zipCode}
            onChangeText={(text) => updateField('zipCode', text)}
            mode="outlined"
            style={[styles.halfInput, errors.zipCode ? styles.inputError : null]}
            keyboardType="numeric"
            error={!!errors.zipCode}
            theme={getTextInputTheme(!!errors.zipCode)}
          />
          <TextInput
            label="Country"
            value={formData.country}
            onChangeText={(text) => updateField('country', text)}
            mode="outlined"
            style={[styles.halfInput, errors.country ? styles.inputError : null]}
            error={!!errors.country}
            theme={getTextInputTheme(!!errors.country)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => {
              setShowAddForm(false);
              setEditingAddress(null);
              resetForm();
            }}
            disabled={loading}
            textColor={colors.text}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleSaveAddress}
            loading={loading}
            disabled={loading}
            buttonColor={colors.primary}
          >
            {editingAddress ? 'Update' : 'Save'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddressCard = (address) => (
    <Card key={address._id} style={[styles.addressCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.addressHeader}>
          <View style={styles.addressInfo}>
            <Text style={[styles.addressName, { color: colors.text }]}>{address.name || address.fullName}</Text>
            {address.isDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAddress(address)}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteAddress(address._id || address.id)}
            >
              <Ionicons name="trash" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.addressPhone, { color: colors.textSecondary }]}>{address.phone}</Text>
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>{address.address}</Text>
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>{address.country}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        {showAddForm ? (
          renderAddressForm()
        ) : (
          <>
            <View style={styles.header}>
              <Title style={[styles.title, { color: colors.text }]}>Shipping Addresses</Title>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Manage your delivery addresses
              </Text>
            </View>

            {addresses.length === 0 ? (
              <Card style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons name="location-outline" size={60} color={colors.textTertiary} />
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No Addresses</Text>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Add your first shipping address to get started
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              addresses.map((address) => renderAddressCard(address))
            )}
          </>
        )}
      </ScrollView>

      {!showAddForm && (
        <FAB
          style={[styles.fab, { backgroundColor: colors.primary }]}
          icon="plus"
          onPress={() => setShowAddForm(true)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
    marginBottom: 15,
  },
  inputError: {
    // Handled dynamically
  },
  errorText: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  emptyCard: {
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  addressCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  addressPhone: {
    fontSize: 14,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 