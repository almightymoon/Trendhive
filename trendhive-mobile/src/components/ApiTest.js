import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';
import { API_CONFIG } from '../config/api';

export default function ApiTest() {
  const { colors } = useTheme();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const testApiConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log('Testing API connection...');
      const testResult = await apiService.testConnection();
      setResult(testResult);
      
      if (testResult.success) {
        Alert.alert('Success', 'API connection successful!');
      } else {
        Alert.alert('Error', `API connection failed: ${testResult.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      setResult({ success: false, error });
      Alert.alert('Error', 'Test failed: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      margin: 16,
    },
    card: {
      marginBottom: 16,
    },
    resultContainer: {
      marginTop: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.surfaceVariant,
    },
    resultText: {
      color: colors.text,
      fontFamily: 'monospace',
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={{ color: colors.text }}>API Connection Test</Title>
          <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>
            Base URL: {API_CONFIG.BASE_URL}
          </Text>
          
          <Button
            mode="contained"
            onPress={testApiConnection}
            loading={testing}
            disabled={testing}
            buttonColor={colors.primary}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>

          {result && (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultText, { color: result.success ? '#4CAF50' : '#F44336' }]}>
                Status: {result.success ? 'SUCCESS' : 'FAILED'}
              </Text>
              {result.error && (
                <Text style={styles.resultText}>
                  Error: {JSON.stringify(result.error, null, 2)}
                </Text>
              )}
              {result.data && (
                <Text style={styles.resultText}>
                  Response: {JSON.stringify(result.data, null, 2)}
                </Text>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
} 