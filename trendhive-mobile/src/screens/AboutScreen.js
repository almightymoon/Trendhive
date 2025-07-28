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
import { useTheme } from '../contexts/ThemeContext';

export default function AboutScreen({ navigation }) {
  const { colors } = useTheme();
  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  const appVersion = '1.0.0';
  const buildNumber = '2024.1';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="trending-up" size={80} color={colors.primary} />
        </View>
        <Title style={[styles.appName, { color: colors.text }]}>TrendHive</Title>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Your Trusted Shopping Destination</Text>
        <Text style={[styles.version, { color: colors.textSecondary }]}>Version {appVersion} (Build {buildNumber})</Text>
      </View>

      {/* About Us */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>About TrendHive</Title>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            TrendHive is a modern e-commerce platform dedicated to bringing you the latest trends 
            in fashion, electronics, home goods, and lifestyle products. Founded with a vision to 
            create a seamless shopping experience, we connect customers with quality products from 
            trusted brands worldwide.
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            Our mission is to make online shopping accessible, enjoyable, and secure for everyone. 
            We believe in providing exceptional customer service, competitive prices, and a 
            user-friendly platform that adapts to your needs.
          </Text>
        </Card.Content>
      </Card>

      {/* Our Values */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Our Values</Title>
          
          <View style={styles.valueItem}>
            <View style={[styles.valueIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            </View>
            <View style={styles.valueContent}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>Quality & Trust</Text>
              <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                We partner with reputable brands and thoroughly vet all products to ensure quality and authenticity.
              </Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <View style={[styles.valueIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="heart" size={24} color={colors.primary} />
            </View>
            <View style={styles.valueContent}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>Customer First</Text>
              <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                Your satisfaction is our priority. We're committed to providing excellent service and support.
              </Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <View style={[styles.valueIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="leaf" size={24} color={colors.primary} />
            </View>
            <View style={styles.valueContent}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>Sustainability</Text>
              <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                We're committed to eco-friendly practices and supporting sustainable product options.
              </Text>
            </View>
          </View>

          <View style={styles.valueItem}>
            <View style={[styles.valueIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="globe" size={24} color={colors.primary} />
            </View>
            <View style={styles.valueContent}>
              <Text style={[styles.valueTitle, { color: colors.text }]}>Global Reach</Text>
              <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
                Connecting customers worldwide with diverse products and international shipping options.
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Features */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>What We Offer</Title>
          
          <View style={styles.featureGrid}>
            <View style={[styles.featureItem, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="bag" size={32} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Wide Selection</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Thousands of products across multiple categories</Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="card" size={32} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Secure Payments</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Multiple payment options with bank-level security</Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="car" size={32} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Fast Delivery</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Quick shipping with real-time tracking</Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="headset" size={32} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>24/7 Support</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>Round-the-clock customer service</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Contact & Links */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>Connect With Us</Title>
          
          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={() => handleOpenLink('http://217.196.51.104:4000')}
          >
            <Ionicons name="globe" size={20} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Visit Our Website</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={() => handleOpenLink('mailto:almightymooon@gmail.com')}
          >
            <Ionicons name="mail" size={20} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Email Us</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Ionicons name="shield" size={20} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('TermsOfService')}
          >
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: colors.text }]}>App Information</Title>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Version:</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{appVersion}</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Build:</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{buildNumber}</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Platform:</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>React Native</Text>
          </View>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.infoLabel, { color: colors.text }]}>Last Updated:</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>January 2024</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          © 2024 TrendHive. All rights reserved.
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Made with ❤️ for our customers
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
  },
  card: {
    margin: 20,
    marginTop: 0,
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
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 14,
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
    marginBottom: 5,
  },
  valueDescription: {
    fontSize: 14,
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
    borderRadius: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
}); 