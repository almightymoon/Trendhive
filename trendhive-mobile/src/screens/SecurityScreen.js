import React, { useState } from 'react';
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
import { apiService } from '../services/apiService';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SecurityScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (!user || (!user._id && !user.id)) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      const userId = user._id || user.id;
      const passwordData = {
        userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };
      
      const response = await apiService.changePassword(passwordData);
      
      // Handle both old and new response formats
      if (response.success || response.message) {
        Alert.alert(
          'Success',
          'Password changed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setFormData({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
                setErrors({});
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      
      // Handle specific error responses
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        
        if (errorMessage.includes('Current password is incorrect') || errorMessage.includes('incorrect')) {
          setErrors({ oldPassword: 'Current password is incorrect' });
        } else {
          Alert.alert('Error', errorMessage);
        }
      } else if (error.message) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Also clear oldPassword error when user types in any field
    if (field !== 'oldPassword' && errors.oldPassword) {
      setErrors(prev => ({ ...prev, oldPassword: '' }));
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
            <Title style={[styles.title, { color: colors.text }]}>Change Password</Title>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Update your password to keep your account secure
            </Text>

            <TextInput
              label="Current Password"
              value={formData.oldPassword}
              onChangeText={(text) => updateField('oldPassword', text)}
              mode="outlined"
              style={[styles.input, errors.oldPassword ? styles.inputError : null]}
              secureTextEntry={!showOldPassword}
              autoCapitalize="none"
              error={!!errors.oldPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showOldPassword ? "eye-off" : "eye"}
                  onPress={() => setShowOldPassword(!showOldPassword)}
                />
              }
              theme={getTextInputTheme(!!errors.oldPassword)}
            />
            {errors.oldPassword ? <Text style={styles.errorText}>{errors.oldPassword}</Text> : null}

            <TextInput
              label="New Password"
              value={formData.newPassword}
              onChangeText={(text) => updateField('newPassword', text)}
              mode="outlined"
              style={[styles.input, errors.newPassword ? styles.inputError : null]}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              error={!!errors.newPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showNewPassword ? "eye-off" : "eye"}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
              theme={getTextInputTheme(!!errors.newPassword)}
            />
            {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

            <TextInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              mode="outlined"
              style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              error={!!errors.confirmPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              theme={getTextInputTheme(!!errors.confirmPassword)}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <View style={[styles.passwordRequirements, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.requirementsTitle, { color: colors.text }]}>Password Requirements:</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• At least 6 characters long</Text>
              <Text style={[styles.requirement, { color: colors.textSecondary }]}>• Must be different from current password</Text>
            </View>

            <Button
              mode="contained"
              style={styles.changeButton}
              onPress={handleChangePassword}
              loading={loading}
              disabled={loading}
              buttonColor={colors.primary}
            >
              Change Password
            </Button>
          </Card.Content>
        </Card>

        <Card style={[styles.securityTipsCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.tipsTitle, { color: colors.text }]}>Security Tips</Title>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Use a strong, unique password</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Never share your password with anyone</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Enable two-factor authentication if available</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>Log out from shared devices</Text>
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
    // Handled dynamically
  },
  errorText: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
  },
  passwordRequirements: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 4,
  },
  changeButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  securityTipsCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
}); 