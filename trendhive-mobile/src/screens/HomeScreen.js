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

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
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
        setFeaturedProducts(products.slice(0, 6)); // Show only 6 featured products
      } else {
        console.error('Products is not an array:', products);
        setError('Invalid data format received');
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

  const renderProductCard = (product) => (
    <Card key={product._id} style={styles.productCard}>
      <TouchableOpacity onPress={() => handleProductPress(product)}>
        <Card.Cover
          source={{ uri: product.mainImage || product.image }}
          style={styles.productImage}
        />
      </TouchableOpacity>
      <Card.Content style={styles.productContent}>
        <Title style={styles.productTitle} numberOfLines={2}>
          {product.name}
        </Title>
        <Paragraph style={styles.productPrice}>
          ${product.price?.toFixed(2) || '0.00'}
        </Paragraph>
        <View style={styles.productActions}>
          <Button
            mode="contained"
            onPress={() => handleAddToCart(product)}
            style={styles.addToCartButton}
            labelStyle={styles.buttonLabel}
          >
            Add to Cart
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
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
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {[
            { name: 'Electronics', icon: 'phone-portrait' },
            { name: 'Fashion', icon: 'shirt' },
            { name: 'Home', icon: 'home' },
            { name: 'Sports', icon: 'fitness' },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Products', { category: category.name })}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={30} color="#10B981" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <Button
              mode="contained"
              onPress={loadFeaturedProducts}
              style={styles.retryButton}
            >
              Retry
            </Button>
          </View>
        ) : featuredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No featured products available</Text>
            <Text style={styles.emptySubtext}>Check back later for new products!</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {featuredProducts.map(renderProductCard)}
          </View>
        )}
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About TrendHive</Text>
        <Text style={styles.aboutText}>
          We bring you the latest trends in technology, fashion, and lifestyle products. 
          Quality and customer satisfaction are our top priorities.
        </Text>
        <TouchableOpacity
          style={styles.aboutButton}
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
    backgroundColor: '#f8fafc',
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
    color: '#1f2937',
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
    backgroundColor: 'white',
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
    color: '#374151',
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
    color: '#6b7280',
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#10B981',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  aboutSection: {
    backgroundColor: 'white',
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
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  aboutButton: {
    backgroundColor: '#10B981',
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