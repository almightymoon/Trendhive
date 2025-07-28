import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import CacheManager from '../components/CacheManager';

export default function CacheManagerScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <CacheManager />
    </ScrollView>
  );
} 