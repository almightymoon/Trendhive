import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';

export default function ThemeSettingsScreen({ navigation }) {
  const { theme, isDark, colors, setThemeMode } = useTheme();

  const themeOptions = [
    {
      id: 'light',
      title: 'Light Mode',
      description: 'Clean and bright interface',
      icon: 'sunny',
      preview: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#1E293B',
      },
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      description: 'Easy on the eyes in low light',
      icon: 'moon',
      preview: {
        background: '#0F172A',
        card: '#1E293B',
        text: '#F8FAFC',
      },
    },
    {
      id: 'system',
      title: 'System Default',
      description: 'Follows your device settings',
      icon: 'settings',
      preview: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#1E293B',
      },
    },
  ];

  const handleThemeSelect = (themeId) => {
    setThemeMode(themeId);
  };

  const renderThemeOption = (option) => {
    const isSelected = theme === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.themeOption,
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => handleThemeSelect(option.id)}
      >
        <View style={styles.themeHeader}>
          <View style={styles.themeInfo}>
            <View style={styles.themeIconContainer}>
              <Ionicons
                name={option.icon}
                size={24}
                color={isSelected ? colors.primary : colors.textSecondary}
              />
            </View>
            <View style={styles.themeText}>
              <Text style={[styles.themeTitle, { color: colors.text }]}>
                {option.title}
              </Text>
              <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                {option.description}
              </Text>
            </View>
          </View>
          {isSelected && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
        </View>
        
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: option.preview.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.previewHeader}>
              <View style={[styles.previewDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.previewDot, { backgroundColor: colors.warning }]} />
              <View style={[styles.previewDot, { backgroundColor: colors.error }]} />
            </View>
            <View style={styles.previewContent}>
              <View
                style={[
                  styles.previewBar,
                  { backgroundColor: option.preview.text, opacity: 0.3 },
                ]}
              />
              <View
                style={[
                  styles.previewBar,
                  { backgroundColor: option.preview.text, opacity: 0.2, width: '60%' },
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Theme Settings"
        subtitle="Choose your preferred appearance"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <Ionicons name="color-palette" size={24} color={colors.primary} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  Choose Your Theme
                </Text>
              </View>
              <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                Select a theme that matches your style and lighting conditions. 
                You can change this anytime in settings.
              </Text>
            </Card.Content>
          </Card>

          <View style={styles.themeOptions}>
            {themeOptions.map(renderThemeOption)}
          </View>

          <Card style={[styles.tipCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb" size={20} color={colors.warning} />
                <Text style={[styles.tipTitle, { color: colors.text }]}>
                  Pro Tip
                </Text>
              </View>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Use "System Default" to automatically switch between light and dark 
                mode based on your device settings and time of day.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  themeOptions: {
    marginBottom: 24,
  },
  themeOption: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  themeText: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewCard: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'space-around',
  },
  previewBar: {
    height: 4,
    borderRadius: 2,
  },
  tipCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 