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

// WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
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
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        // Navigate to main app after successful sign in
        navigation.replace('MainTabs');
      } else {
        // Show specific error message
        if (result.error) {
          if (result.error.includes('Invalid credentials')) {
            setPasswordError('Invalid email or password. Please try again.');
          } else if (result.error.includes('User not found')) {
            setEmailError('No account found with this email. Please sign up first.');
          } else {
            setGeneralError(result.error);
          }
        } else {
          setGeneralError('Sign in failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setGeneralError('Network error. Please check your connection and try again.');
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
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            mode="outlined"
            style={[styles.input, emailError ? styles.inputError : null]}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email" />}
            error={!!emailError}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: emailError ? '#ef4444' : '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            mode="outlined"
            style={[styles.input, passwordError ? styles.inputError : null]}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!passwordError}
            theme={{
              colors: {
                primary: '#10B981',
                text: '#000000',
                placeholder: '#666666',
                background: 'white',
                onSurface: '#000000',
                surface: 'white',
                outline: passwordError ? '#ef4444' : '#d1d5db',
                onSurfaceVariant: '#10B981',
                primaryContainer: '#10B981',
                onPrimaryContainer: '#ffffff',
                secondary: '#10B981',
                secondaryContainer: '#10B981',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {generalError ? <Text style={styles.generalErrorText}>{generalError}</Text> : null}

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