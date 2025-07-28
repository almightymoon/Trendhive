import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { apiService } from '../services/apiService';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading featured products...');
      
      const products = await apiService.getFeaturedProducts();
      console.log('Products received:', products);
      
      if (Array.isArray(products)) {
        // Filter out any undefined or null products before setting state
        const validProducts = products.filter(product => product && product._id);
        setFeaturedProducts(validProducts.slice(0, 6)); // Show only 6 featured products
      } else if (products && Array.isArray(products.data)) {
        // Handle case where API returns { data: [...] }
        const validProducts = products.data.filter(product => product && product._id);
        setFeaturedProducts(validProducts.slice(0, 6));
      } else {
        console.error('Products is not an array:', products);
        setError('Invalid data format received');
        setFeaturedProducts([]); // Set empty array as fallback
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      setError(error.message || 'Failed to load products');
      Alert.alert('Error', 'Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedProducts();
    setRefreshing(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProductCard = (product) => {
    try {
      if (!product || !product._id) return null;
      
      return (
        <Card key={product._id} style={[styles.productCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => handleProductPress(product)}>
            <Card.Cover
              source={{ uri: product.mainImage || product.image || 'https://via.placeholder.com/300x200?text=No+Image' }}
              style={styles.productImage}
            />
          </TouchableOpacity>
          <Card.Content style={styles.productContent}>
            <Title style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
              {product.name || 'Product Name'}
            </Title>
            <Paragraph style={[styles.productPrice, { color: colors.primary }]}>
              ${(product.price || 0).toFixed(2)}
            </Paragraph>
            <View style={styles.productActions}>
              <Button
                mode="contained"
                onPress={() => handleAddToCart(product)}
                style={styles.addToCartButton}
                labelStyle={styles.buttonLabel}
                buttonColor={colors.primary}
              >
                Add to Cart
              </Button>
            </View>
          </Card.Content>
        </Card>
      );
    } catch (error) {
      console.error('Error rendering product card:', error, product);
      return null;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Hero Section */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Welcome to TrendHive</Text>
          <Text style={styles.heroSubtitle}>
            Discover the latest trends in technology and lifestyle
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.heroButtonText}>Shop Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {[
            { name: 'Electronics', icon: 'phone-portrait' },
            { name: 'Fashion', icon: 'shirt' },
            { name: 'Home', icon: 'home' },
            { name: 'Sports', icon: 'fitness' },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryCard, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Products', params: { category: category.name } })}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={30} color={colors.primary} />
              </View>
              <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>Error: {error}</Text>
            <Button
              mode="contained"
              onPress={loadFeaturedProducts}
              style={styles.retryButton}
              buttonColor={colors.primary}
            >
              Retry
            </Button>
          </View>
        ) : featuredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No featured products available</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Check back later for new products!</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {featuredProducts.filter(product => product).map(renderProductCard)}
          </View>
        )}
      </View>

      {/* About Section */}
      <View style={[styles.aboutSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.aboutTitle, { color: colors.text }]}>About TrendHive</Text>
        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          We bring you the latest trends in technology, fashion, and lifestyle products. 
          Quality and customer satisfaction are our top priorities.
        </Text>
        <TouchableOpacity
          style={[styles.aboutButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={styles.aboutButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  heroButtonText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#10B981',
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  categoryCard: {
    width: (width - 60) / 4,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productContent: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000000',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 10,
  },
  productActions: {
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  aboutSection: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  aboutButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  aboutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
}); 