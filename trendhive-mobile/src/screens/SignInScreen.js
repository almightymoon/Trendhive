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
import { TextInput, Button, Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../contexts/AuthContext';
import CoolHeader from '../components/CoolHeader';

// WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  // Commented out Google Sign-In for now
  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   expoClientId: 'YOUR_EXPO_CLIENT_ID',
  //   iosClientId: 'YOUR_IOS_CLIENT_ID',
  //   androidClientId: 'YOUR_ANDROID_CLIENT_ID',
  //   webClientId: 'YOUR_WEB_CLIENT_ID',
  // });

  // React.useEffect(() => {
  //   if (response?.type === 'success') {
  //     const { authentication } = response;
  //     handleGoogleSignIn(authentication.accessToken);
  //   }
  // }, [response]);

  // const handleGoogleSignIn = async (accessToken) => {
  //   try {
  //     setLoading(true);
  //     const result = await signInWithGoogle(accessToken);
  //     if (result.success) {
  //       navigation.replace('MainTabs');
  //     } else {
  //       Alert.alert('Google Sign In Failed', result.error || 'Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Google sign in error:', error);
  //     Alert.alert('Google Sign In Failed', 'An error occurred. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignIn = async () => {
    // Clear previous errors
    setErrors({});

    // Validate email
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    // Validate password
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    try {
      console.log('SignInScreen: Attempting sign in with:', { email: formData.email, password: formData.password ? '[HIDDEN]' : 'MISSING' });
      const response = await signIn(formData.email, formData.password);
      console.log('SignInScreen: Sign in response:', response);
      
      if (response && (response.success || response.token)) {
        navigation.navigate('MainTabs');
      } else {
        setErrors({ general: response?.error || 'Sign in failed' });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        
        // Set field-specific errors
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors({ email: errorMessage });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setErrors({ password: errorMessage });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Network error. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      'Google Sign In',
      'Google Sign In is currently disabled. Please use email and password.',
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
          <Title style={styles.title}>Welcome Back</Title>
          <Text style={styles.subtitle}>
            Sign in to your TrendHive account
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
              setErrors({ ...errors, email: '' });
            }}
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
            label="Password"
            value={formData.password}
            onChangeText={(text) => {
              setFormData({ ...formData, password: text });
              setErrors({ ...errors, password: '' });
            }}
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

          {errors.general ? <Text style={styles.generalErrorText}>{errors.general}</Text> : null}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleSignIn}
            style={styles.signInButton}
            loading={loading}
            disabled={loading}
            buttonColor="#10B981"
            textColor="white"
          >
            Sign In
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            mode="outlined"
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            textColor="#10B981"
          >
            <Ionicons name="logo-google" size={20} color="#10B981" />
            <Text style={styles.googleButtonText}> Continue with Google</Text>
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
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
    marginBottom: 40,
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
  input: {
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
  generalErrorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#10B981',
    fontWeight: '600',
  },
  signInButton: {
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
  signUpLink: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 