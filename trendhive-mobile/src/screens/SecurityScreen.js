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

export default function SecurityScreen({ navigation }) {
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
      
      if (response.success) {
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

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Change Password</Title>
            <Text style={styles.subtitle}>
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
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirement}>• At least 6 characters long</Text>
              <Text style={styles.requirement}>• Must be different from current password</Text>
            </View>

            <Button
              mode="contained"
              style={styles.changeButton}
              onPress={handleChangePassword}
              loading={loading}
              disabled={loading}
            >
              Change Password
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.securityTipsCard}>
          <Card.Content>
            <Title style={styles.tipsTitle}>Security Tips</Title>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.tipText}>Use a strong, unique password</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.tipText}>Never share your password with anyone</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.tipText}>Enable two-factor authentication if available</Text>
            </View>
            <View style={styles.tip}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.tipText}>Log out from shared devices</Text>
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 20,
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
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
  passwordRequirements: {
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  changeButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 8,
  },
  securityTipsCard: {
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
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 10,
    flex: 1,
  },
}); 