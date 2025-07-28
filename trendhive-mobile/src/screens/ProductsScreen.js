import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useTheme } from '../contexts/ThemeContext';
import CoolHeader from '../components/CoolHeader';

const { width, height } = Dimensions.get('window');

export default function ProductsScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categories = [
    { name: 'All', icon: 'grid' },
    { name: 'Electronics', icon: 'phone-portrait' },
    { name: 'Fashion', icon: 'shirt' },
    { name: 'Home', icon: 'home' },
    { name: 'Sports', icon: 'fitness' },
    { name: 'Books', icon: 'book' },
    { name: 'Bagpacks', icon: 'bag' },
  ];

  const sortOptions = [
    { key: 'name', label: 'Name', icon: 'text' },
    { key: 'price-low', label: 'Price Low', icon: 'trending-down' },
    { key: 'price-high', label: 'Price High', icon: 'trending-up' },
    { key: 'newest', label: 'Newest', icon: 'time' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading all products...');
      
      const allProducts = await apiService.getProducts();
      console.log('All products received:', allProducts);
      
      if (Array.isArray(allProducts)) {
        setProducts(allProducts);
      } else {
        console.error('Products is not an array:', allProducts);
        setError('Invalid data format received');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.message || 'Failed to load products');
      Alert.alert('Error', 'Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category === selectedCategory
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProductItem = ({ item }) => {
    // Handle different ID formats
    const productId = item._id || item.id || item.productId;
    
    // Check if product has multiple images
    const hasMultipleImages = item.images && item.images.length > 0;
    
    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: colors.card }]}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.productImageContainer}>
          <Image
          source={{ uri: item.mainImage || item.image }}
          style={styles.productImage}
            resizeMode="cover"
          />
          
          {/* Multiple Images Indicator */}
          {hasMultipleImages && (
            <View style={styles.multipleImagesIndicator}>
              <Ionicons name="images" size={12} color="white" />
              <Text style={styles.multipleImagesText}>{item.images.length + 1}</Text>
            </View>
          )}
          
          <View style={styles.productOverlay}>
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={() => handleAddToCart(item)}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.wishlistButton, isInWishlist(item) && styles.wishlistButtonActive]}
              onPress={() => {
                if (isInWishlist(item)) {
                  removeFromWishlist(item);
                  Alert.alert('Removed', 'Product removed from wishlist!');
                } else {
                  addToWishlist(item);
                  Alert.alert('Added', 'Product added to wishlist!');
                }
              }}
            >
              <Ionicons 
                name={isInWishlist(item) ? "heart" : "heart-outline"} 
                size={20} 
                color={isInWishlist(item) ? "white" : "white"} 
        />
      </TouchableOpacity>
          </View>
        </View>
              <View style={styles.productContent}>
          <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
          {item.name}
          </Text>
          <Text style={[styles.productDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.shortDescription || item.description}
          </Text>
        <View style={styles.productMeta}>
            <View style={[styles.categoryTag, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.categoryText, { color: colors.text }]}>{item.category}</Text>
            </View>
          <Text style={[styles.productPrice, { color: colors.primary }]}>${item.price?.toFixed(2) || '0.00'}</Text>
        </View>
        <View style={styles.productActions}>
            <TouchableOpacity
              style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAddToCart(item)}
            >
              <Ionicons name="cart" size={16} color="white" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
  );
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surfaceVariant }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textTertiary}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={[styles.categoriesTitle, { color: colors.text }]}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                { backgroundColor: colors.surfaceVariant },
                selectedCategory === item.name && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSelectedCategory(selectedCategory === item.name ? '' : item.name)}
            >
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={selectedCategory === item.name ? "white" : colors.primary} 
              />
              <Text
                style={[
                  styles.categoryChipText,
                  { color: selectedCategory === item.name ? "white" : colors.text },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: colors.text }]}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                { backgroundColor: colors.surfaceVariant },
                sortBy === option.key && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Ionicons 
                name={option.icon} 
                size={14} 
                color={sortBy === option.key ? "white" : colors.primary} 
              />
              <Text
                style={[
                  styles.sortButtonText,
                  { color: sortBy === option.key ? "white" : colors.text },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
      <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
      </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
        <Button
          mode="contained"
          onPress={loadProducts}
          style={styles.retryButton}
          buttonColor={colors.primary}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CoolHeader
        title="Products"
        showBack={false}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id || item.id || item.productId || item.name}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No products found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryChip: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryChipText: {
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
  sortContainer: {
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },

  resultsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resultsCount: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  multipleImagesIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  multipleImagesText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  productOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  quickAddButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productContent: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  productDescription: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productActions: {
    marginTop: 5,
  },
  addToCartButton: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 