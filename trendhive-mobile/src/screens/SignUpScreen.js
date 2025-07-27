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

export default function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signUp } = useAuth();

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
      const result = await signUp(formData);
      if (result.success) {
        // Navigate to main app after successful sign up
        navigation.replace('MainTabs');
      } else {
        // Show specific error message
        let errorMessage = 'Sign up failed';
        if (result.error) {
          if (result.error.includes('User already exists')) {
            errorMessage = 'An account with this email already exists. Please sign in instead.';
          } else if (result.error.includes('Missing required fields')) {
            errorMessage = 'Please fill in all required fields.';
          } else {
            errorMessage = result.error;
          }
        }
        Alert.alert('Sign Up Failed', errorMessage);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
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
              style={[styles.input, styles.halfInput]}
              autoCapitalize="words"
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
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              autoCapitalize="words"
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

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email" />}
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
            style={styles.input}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
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
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
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