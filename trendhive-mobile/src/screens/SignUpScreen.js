import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Title, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import CoolHeader from '../components/CoolHeader';

export default function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signUp } = useAuth();
  const { showSuccess, showError } = useNotification();

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare user data for signup
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
      };

      const response = await signUp(userData);
      if (response.success || response.message) {
        showSuccess('Account created successfully!');
        signUp(response.token, response.user);
        navigation.navigate('MainTabs');
      } else {
        showError(response.error || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        showError(errorMessage);
        
        // Set field-specific errors
        if (errorMessage.toLowerCase().includes('name')) {
          setErrors({ firstName: errorMessage });
        } else if (errorMessage.toLowerCase().includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (error.message) {
        showError(error.message);
      } else {
        showError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    Alert.alert(
      'Google Sign Up',
      'Google Sign Up is currently disabled. Please use email and password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="trending-up" size={60} color="#10B981" />
          <Title style={styles.title}>Create Account</Title>
          <Text style={styles.subtitle}>
            Join TrendHive and start shopping
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
              mode="outlined"
              style={[styles.input, styles.halfInput, errors.firstName ? styles.inputError : null]}
              autoCapitalize="words"
              error={!!errors.firstName}
              theme={{
                colors: {
                  primary: '#10B981',
                  text: '#000000',
                  placeholder: '#666666',
                  background: 'white',
                  onSurface: '#000000',
                  surface: 'white',
                  outline: errors.firstName ? '#ef4444' : '#d1d5db',
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
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              mode="outlined"
              style={[styles.input, styles.halfInput, errors.lastName ? styles.inputError : null]}
              autoCapitalize="words"
              error={!!errors.lastName}
              theme={{
                colors: {
                  primary: '#10B981',
                  text: '#000000',
                  placeholder: '#666666',
                  background: 'white',
                  onSurface: '#000000',
                  surface: 'white',
                  outline: errors.lastName ? '#ef4444' : '#d1d5db',
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
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            style={[styles.input, errors.email ? styles.inputError : null]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email" />}
            error={!!errors.email}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: errors.email ? '#ef4444' : '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <TextInput
            label="Phone (Optional)"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
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
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            mode="outlined"
            style={[styles.input, errors.password ? styles.inputError : null]}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!errors.password}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: errors.password ? '#ef4444' : '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            mode="outlined"
            style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            error={!!errors.confirmPassword}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: errors.confirmPassword ? '#ef4444' : '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          {errors.general ? <Text style={styles.generalErrorText}>{errors.general}</Text> : null}

          <View style={styles.termsContainer}>
            <Checkbox
              status={acceptedTerms ? 'checked' : 'unchecked'}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              color="#10B981"
            />
            <View style={styles.termsText}>
              <Text style={styles.termsTextContent}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.signUpButton}
            loading={loading}
            disabled={loading}
            buttonColor="#10B981"
            textColor="white"
          >
            Create Account
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            mode="outlined"
            style={styles.googleButton}
            onPress={handleGoogleSignUp}
            textColor="#10B981"
          >
            <Ionicons name="logo-google" size={20} color="#10B981" />
            <Text style={styles.googleButtonText}> Continue with Google</Text>
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  nameRow: {
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
  generalErrorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
  },
  termsTextContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  termsLink: {
    color: '#10B981',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  googleButton: {
    borderColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#10B981',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 16,
  },
  signInLink: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 