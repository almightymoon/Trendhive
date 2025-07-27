import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Title, Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  const appVersion = '1.0.0';
  const buildNumber = '2024.1';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="trending-up" size={80} color="#10B981" />
        </View>
        <Title style={styles.appName}>TrendHive</Title>
        <Text style={styles.tagline}>Your Trusted Shopping Destination</Text>
        <Text style={styles.version}>Version {appVersion} (Build {buildNumber})</Text>
      </View>

      {/* About Us */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About TrendHive</Title>
          <Text style={styles.aboutText}>
            TrendHive is a modern e-commerce platform dedicated to bringing you the latest trends 
            in fashion, electronics, home goods, and lifestyle products. Founded with a vision to 
            create a seamless shopping experience, we connect customers with quality products from 
            trusted brands worldwide.
          </Text>
          <Text style={styles.aboutText}>
            Our mission is to make online shopping accessible, enjoyable, and secure for everyone. 
            We believe in providing exceptional customer service, competitive prices, and a 
            user-friendly platform that adapts to your needs.
          </Text>
        </Card.Content>
      </Card>

      {/* Our Values */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Our Values</Title>
          
          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Quality & Trust</Text>
              <Text style={styles.valueDescription}>
                We partner with reputable brands and thoroughly vet all products to ensure quality and authenticity.
              </Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Ionicons name="heart" size={24} color="#10B981" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Customer First</Text>
              <Text style={styles.valueDescription}>
                Your satisfaction is our priority. We're committed to providing excellent service and support.
              </Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Ionicons name="leaf" size={24} color="#10B981" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Sustainability</Text>
              <Text style={styles.valueDescription}>
                We're committed to eco-friendly practices and supporting sustainable product options.
              </Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <View style={styles.valueIcon}>
              <Ionicons name="globe" size={24} color="#10B981" />
            </View>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Global Reach</Text>
              <Text style={styles.valueDescription}>
                Connecting customers worldwide with diverse products and international shipping options.
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Features */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>What We Offer</Title>
          
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="bag" size={32} color="#10B981" />
              <Text style={styles.featureTitle}>Wide Selection</Text>
              <Text style={styles.featureDescription}>Thousands of products across multiple categories</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="card" size={32} color="#10B981" />
              <Text style={styles.featureTitle}>Secure Payments</Text>
              <Text style={styles.featureDescription}>Multiple payment options with bank-level security</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="car" size={32} color="#10B981" />
              <Text style={styles.featureTitle}>Fast Delivery</Text>
              <Text style={styles.featureDescription}>Quick shipping with real-time tracking</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="headset" size={32} color="#10B981" />
              <Text style={styles.featureTitle}>24/7 Support</Text>
              <Text style={styles.featureDescription}>Round-the-clock customer service</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Contact & Links */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Connect With Us</Title>
          
          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('http://217.196.51.104:4000')}
          >
            <Ionicons name="globe" size={20} color="#10B981" />
            <Text style={styles.linkText}>Visit Our Website</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('mailto:almightymooon@gmail.com')}
          >
            <Ionicons name="mail" size={20} color="#10B981" />
            <Text style={styles.linkText}>Email Us</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://217.196.51.104:4000/privacy')}
          >
            <Ionicons name="shield" size={20} color="#10B981" />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://217.196.51.104:4000/terms')}
          >
            <Ionicons name="document-text" size={20} color="#10B981" />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Information</Title>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>{appVersion}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build:</Text>
            <Text style={styles.infoValue}>{buildNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform:</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>January 2024</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 TrendHive. All rights reserved.
        </Text>
        <Text style={styles.footerText}>
          Made with ❤️ for our customers
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#9ca3af',
  },
  card: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 15,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  valueDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 5,
  },
}); 