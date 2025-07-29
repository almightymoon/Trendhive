import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { apiService } from '../services/apiService';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Basic connection
      console.log('Testing basic connection...');
      const connectionTest = await apiService.testConnection();
      results.connection = connectionTest;

      // Test 2: Products endpoint
      console.log('Testing products endpoint...');
      try {
        const products = await apiService.getProducts();
        results.products = { success: true, count: products.length || 0 };
      } catch (error) {
        results.products = { success: false, error: error.message };
      }

      // Test 3: Health endpoint
      console.log('Testing health endpoint...');
      try {
        const health = await apiService.api.get('/health');
        results.health = { success: true, data: health };
      } catch (error) {
        results.health = { success: false, error: error.message };
      }

    } catch (error) {
      console.error('Test error:', error);
      results.general = { success: false, error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (success) => {
    return success ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (success) => {
    return success ? '✅ SUCCESS' : '❌ FAILED';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 API Connection Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={runTests}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Run API Tests'}
        </Text>
      </TouchableOpacity>

      {Object.keys(testResults).length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          
          {Object.entries(testResults).map(([testName, result]) => (
            <View key={testName} style={styles.testResult}>
              <Text style={styles.testName}>{testName.toUpperCase()}:</Text>
              <Text style={[
                styles.testStatus, 
                { color: getStatusColor(result.success) }
              ]}>
                {getStatusText(result.success)}
              </Text>
              
              {result.error && (
                <Text style={styles.errorText}>Error: {result.error}</Text>
              )}
              
              {result.count && (
                <Text style={styles.successText}>Products found: {result.count}</Text>
              )}
              
              {result.data && (
                <Text style={styles.successText}>
                  Response: {JSON.stringify(result.data, null, 2)}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Current Configuration:</Text>
        <Text style={styles.infoText}>
          Base URL: {apiService.api.defaults.baseURL}
        </Text>
        <Text style={styles.infoText}>
          Timeout: {apiService.api.defaults.timeout}ms
        </Text>
        <Text style={styles.infoText}>
          Platform: {require('react-native').Platform.OS}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  testResult: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  testStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 12,
    marginTop: 5,
  },
  info: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default ApiTest; 