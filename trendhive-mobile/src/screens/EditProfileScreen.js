import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function EditProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Split the name into first and last name
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!user || (!user._id && !user.id)) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      const userId = user._id || user.id;
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const profileData = { 
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        userId 
      };
      
      const response = await apiService.updateProfile(profileData);
      
      // Handle both old and new response formats
      if (response.success || response.message) {
        // Update the user object with the new data
        const updatedUser = {
          ...user,
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        };
        updateUser(updatedUser);
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.title, { color: colors.text }]}>Edit Profile</Title>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Update your personal information
            </Text>

            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
              mode="outlined"
              style={[styles.input, errors.firstName ? styles.inputError : null]}
              error={!!errors.firstName}
              theme={getTextInputTheme(!!errors.firstName)}
            />
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
              mode="outlined"
              style={[styles.input, errors.lastName ? styles.inputError : null]}
              error={!!errors.lastName}
              theme={getTextInputTheme(!!errors.lastName)}
            />
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              mode="outlined"
              style={[styles.input, errors.email ? styles.inputError : null]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!errors.email}
              theme={getTextInputTheme(!!errors.email)}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              label="Phone Number (Optional)"
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
              label="Date of Birth (Optional)"
              value={formData.dateOfBirth}
              onChangeText={(text) => updateField('dateOfBirth', text)}
              mode="outlined"
              style={styles.input}
              placeholder="MM/DD/YYYY"
              theme={getTextInputTheme()}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => navigation.goBack()}
                disabled={loading}
                textColor={colors.text}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                style={styles.saveButton}
                onPress={handleSave}
                loading={loading}
                disabled={loading}
                buttonColor={colors.primary}
              >
                Save Changes
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  inputError: {
    // Handled dynamically in component
  },
  errorText: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
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
}); 