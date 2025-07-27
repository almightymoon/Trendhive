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

export default function ShippingAddressesScreen({ navigation }) {
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
      if (response.success) {
        setAddresses(response.addresses || []);
      }
    } catch (error) {
      console.error('Load addresses error:', error);
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
      const addressData = { ...formData, userId };
      
      const response = editingAddress
        ? await apiService.updateAddress(editingAddress.id, formData)
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
              const response = await apiService.deleteAddress(addressId);
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
      name: address.name || '',
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

  const renderAddressForm = () => (
    <Card style={styles.formCard}>
      <Card.Content>
        <Title style={styles.formTitle}>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </Title>

        <TextInput
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          mode="outlined"
          style={[styles.input, errors.name ? styles.inputError : null]}
          error={!!errors.name}
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
          />
          <TextInput
            label="State"
            value={formData.state}
            onChangeText={(text) => updateField('state', text)}
            mode="outlined"
            style={[styles.halfInput, errors.state ? styles.inputError : null]}
            error={!!errors.state}
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
          />
          <TextInput
            label="Country"
            value={formData.country}
            onChangeText={(text) => updateField('country', text)}
            mode="outlined"
            style={[styles.halfInput, errors.country ? styles.inputError : null]}
            error={!!errors.country}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            style={styles.cancelButton}
            onPress={() => {
              setShowAddForm(false);
              setEditingAddress(null);
              resetForm();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={handleSaveAddress}
            loading={loading}
            disabled={loading}
          >
            {editingAddress ? 'Update' : 'Save'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddressCard = (address) => (
    <Card key={address._id} style={styles.addressCard}>
      <Card.Content>
        <View style={styles.addressHeader}>
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>{address.name}</Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAddress(address)}
            >
              <Ionicons name="pencil" size={20} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteAddress(address.id)}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.addressPhone}>{address.phone}</Text>
        <Text style={styles.addressText}>{address.address}</Text>
        <Text style={styles.addressText}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={styles.addressText}>{address.country}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        {showAddForm ? (
          renderAddressForm()
        ) : (
          <>
            <View style={styles.header}>
              <Title style={styles.title}>Shipping Addresses</Title>
              <Text style={styles.subtitle}>
                Manage your delivery addresses
              </Text>
            </View>

            {addresses.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Card.Content style={styles.emptyContent}>
                  <Ionicons name="location-outline" size={60} color="#d1d5db" />
                  <Text style={styles.emptyTitle}>No Addresses</Text>
                  <Text style={styles.emptyText}>
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
          style={styles.fab}
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
    backgroundColor: '#f8fafc',
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
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  formCard: {
    margin: 20,
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  halfInput: {
    flex: 1,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
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
    borderColor: '#6b7280',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#10B981',
  },
  emptyCard: {
    margin: 20,
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  addressCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginRight: 10,
  },
  defaultBadge: {
    backgroundColor: '#10B981',
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
    color: '#6b7280',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#10B981',
  },
}); 