import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Chip, Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function AdvancedSearchScreen({ navigation }) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    brand: '',
    availability: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async (query) => {
    try {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      setSearchHistory([]);
      await AsyncStorage.removeItem('searchHistory');
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearchHistory(searchQuery.trim());
      // Navigate to products with search query and filters
      navigation.navigate('MainTabs', {
        screen: 'Products',
        params: {
          searchQuery: searchQuery.trim(),
          filters,
        },
      });
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      const voiceQuery = 'red laptop under 500 dollars';
      setSearchQuery(voiceQuery);
      Alert.alert('Voice Search', `You said: "${voiceQuery}"`);
    }, 2000);
  };

  const handleVisualSearch = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        // Simulate visual search
        setTimeout(() => {
          Alert.alert('Visual Search', 'Analyzing image... Found similar products!');
          navigation.navigate('MainTabs', {
            screen: 'Products',
            params: {
              visualSearch: true,
              imageUri: result.assets[0].uri,
            },
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleHistoryItemPress = (item) => {
    setSearchQuery(item);
    handleSearch();
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      brand: '',
      availability: '',
    });
  };

  const renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products, brands, or categories..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            isListening && { backgroundColor: colors.error },
          ]}
          onPress={handleVoiceSearch}
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={20}
            color={isListening ? 'white' : colors.primary}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleVisualSearch}
        >
          <Ionicons name="camera-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilters = () => (
    <Card style={[styles.filtersCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.filtersHeader}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>Filters</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={[styles.clearFilters, { color: colors.primary }]}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'].map((category) => (
              <Chip
                key={category}
                selected={filters.category === category}
                onPress={() => updateFilter('category', category)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filters.category === category ? colors.primary : colors.surfaceVariant,
                  },
                ]}
                textStyle={{
                  color: filters.category === category ? 'white' : colors.text,
                }}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Price Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {['Under $50', '$50-$100', '$100-$200', '$200-$500', 'Over $500'].map((range) => (
              <Chip
                key={range}
                selected={filters.priceRange === range}
                onPress={() => updateFilter('priceRange', range)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filters.priceRange === range ? colors.primary : colors.surfaceVariant,
                  },
                ]}
                textStyle={{
                  color: filters.priceRange === range ? 'white' : colors.text,
                }}
              >
                {range}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Rating</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {['4+ Stars', '3+ Stars', '2+ Stars'].map((rating) => (
              <Chip
                key={rating}
                selected={filters.rating === rating}
                onPress={() => updateFilter('rating', rating)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filters.rating === rating ? colors.primary : colors.surfaceVariant,
                  },
                ]}
                textStyle={{
                  color: filters.rating === rating ? 'white' : colors.text,
                }}
              >
                {rating}
              </Chip>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Availability</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
            {['In Stock', 'Free Shipping', 'Same Day Delivery'].map((availability) => (
              <Chip
                key={availability}
                selected={filters.availability === availability}
                onPress={() => updateFilter('availability', availability)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filters.availability === availability ? colors.primary : colors.surfaceVariant,
                  },
                ]}
                textStyle={{
                  color: filters.availability === availability ? 'white' : colors.text,
                }}
              >
                {availability}
              </Chip>
            ))}
          </ScrollView>
        </View>
      </Card.Content>
    </Card>
  );

  const renderSearchHistory = () => (
    <Card style={[styles.historyCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.text }]}>Recent Searches</Text>
          {searchHistory.length > 0 && (
            <TouchableOpacity onPress={clearSearchHistory}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
        
        {searchHistory.length > 0 ? (
          <View style={styles.historyItems}>
            {searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => handleHistoryItemPress(item)}
              >
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.historyText, { color: colors.text }]}>{item}</Text>
                <Ionicons name="arrow-up" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={[styles.emptyHistory, { color: colors.textSecondary }]}>
            No recent searches
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  const renderVisualSearchPreview = () => {
    if (!selectedImage) return null;

    return (
      <Card style={[styles.visualSearchCard, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Text style={[styles.visualSearchTitle, { color: colors.text }]}>Selected Image</Text>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <View style={styles.visualSearchActions}>
            <Button
              mode="outlined"
              onPress={() => setSelectedImage(null)}
              style={[styles.visualSearchButton, { borderColor: colors.border }]}
              textColor={colors.text}
            >
              Remove
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate('MainTabs', {
                  screen: 'Products',
                  params: {
                    visualSearch: true,
                    imageUri: selectedImage,
                  },
                });
              }}
              style={styles.visualSearchButton}
              buttonColor={colors.primary}
            >
              Search Similar
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Advanced Search"
        subtitle="Find exactly what you're looking for"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderSearchBar()}
          
          <View style={styles.filterToggle}>
            <TouchableOpacity
              style={[styles.filterToggleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={20} color={colors.primary} />
              <Text style={[styles.filterToggleText, { color: colors.text }]}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Text>
              <Ionicons
                name={showFilters ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {showFilters && renderFilters()}
          {renderVisualSearchPreview()}
          {renderSearchHistory()}
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
  searchBarContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggle: {
    marginBottom: 20,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterToggleText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  filtersCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearFilters: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 8,
  },
  visualSearchCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  visualSearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  visualSearchActions: {
    flexDirection: 'row',
    gap: 12,
  },
  visualSearchButton: {
    flex: 1,
  },
  historyCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItems: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  historyText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  emptyHistory: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
}); 