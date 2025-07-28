import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/apiService';
import cacheService from '../services/cacheService';

export default function CacheManager() {
  const { colors } = useTheme();
  const [cacheInfo, setCacheInfo] = useState({ size: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCacheInfo();
  }, []);

  const loadCacheInfo = async () => {
    try {
      const info = await apiService.getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('Error loading cache info:', error);
    }
  };

  const clearProductCache = async () => {
    setLoading(true);
    try {
      await apiService.clearProductCache();
      await loadCacheInfo();
      Alert.alert('Success', 'Product cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing product cache:', error);
      Alert.alert('Error', 'Failed to clear product cache');
    } finally {
      setLoading(false);
    }
  };

  const clearAllCache = async () => {
    Alert.alert(
      'Clear All Cache',
      'This will clear all cached data including products, user data, and settings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await apiService.clearAllCache();
              await loadCacheInfo();
              Alert.alert('Success', 'All cache cleared successfully!');
            } catch (error) {
              console.error('Error clearing all cache:', error);
              Alert.alert('Error', 'Failed to clear cache');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      margin: 16,
    },
    card: {
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    icon: {
      marginRight: 8,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    button: {
      flex: 1,
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.header}>
            <Ionicons 
              name="hardware-chip" 
              size={24} 
              color={colors.primary} 
              style={styles.icon}
            />
            <Title style={{ color: colors.text }}>Cache Management</Title>
          </View>

          <View style={styles.infoRow}>
            <Text style={{ color: colors.textSecondary }}>Cached Items:</Text>
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>
              {cacheInfo.size}
            </Text>
          </View>

          <Paragraph style={{ color: colors.textSecondary, marginTop: 8 }}>
            Cache helps improve app performance by storing frequently accessed data locally. 
            Clear cache if you're experiencing issues or want fresh data.
          </Paragraph>

          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={clearProductCache}
              disabled={loading}
              style={[styles.button, { borderColor: colors.border }]}
              textColor={colors.text}
              icon="package-variant"
            >
              Clear Products
            </Button>
            
            <Button
              mode="outlined"
              onPress={clearAllCache}
              disabled={loading}
              style={[styles.button, { borderColor: colors.error }]}
              textColor={colors.error}
              icon="delete-sweep"
            >
              Clear All
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
} 