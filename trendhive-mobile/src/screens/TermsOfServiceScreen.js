import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CoolHeader from '../components/CoolHeader';

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CoolHeader
        title="Terms of Service"
        subtitle="Last updated: July 28, 2025"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using the TrendHive mobile application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Text>

          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            TrendHive is an e-commerce platform that allows users to browse, purchase, and manage orders for various products. Our service includes product listings, shopping cart functionality, secure payment processing, and order management.
          </Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            To access certain features of our service, you must create an account. You are responsible for:
          </Text>
          <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account credentials</Text>
          <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
          <Text style={styles.bulletPoint}>• Providing accurate and complete information</Text>
          <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized use</Text>

          <Text style={styles.sectionTitle}>4. Product Information</Text>
          <Text style={styles.paragraph}>
            We strive to provide accurate product information, including descriptions, prices, and availability. However, we do not guarantee the accuracy, completeness, or reliability of any product information. Product images are for illustrative purposes and may not reflect the exact appearance of the product.
          </Text>

          <Text style={styles.sectionTitle}>5. Pricing and Payment</Text>
          <Text style={styles.paragraph}>
            All prices are displayed in the local currency and are subject to change without notice. Payment is processed securely through our third-party payment processors. By making a purchase, you authorize us to charge your payment method for the total amount of your order.
          </Text>

          <Text style={styles.sectionTitle}>6. Shipping and Delivery</Text>
          <Text style={styles.paragraph}>
            We will make reasonable efforts to ship your order within the estimated timeframe. Delivery times may vary based on your location and the shipping method selected. We are not responsible for delays caused by circumstances beyond our control.
          </Text>

          <Text style={styles.sectionTitle}>7. Returns and Refunds</Text>
          <Text style={styles.paragraph}>
            We accept returns within 30 days of delivery for most items in their original condition. Some products may have different return policies. Refunds will be processed to the original payment method within 5-10 business days of receiving the returned item.
          </Text>

          <Text style={styles.sectionTitle}>8. Prohibited Uses</Text>
          <Text style={styles.paragraph}>
            You agree not to use our service to:
          </Text>
          <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
          <Text style={styles.bulletPoint}>• Infringe on intellectual property rights</Text>
          <Text style={styles.bulletPoint}>• Transmit harmful or malicious code</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
          <Text style={styles.bulletPoint}>• Interfere with the proper functioning of the service</Text>

          <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The content, features, and functionality of our app, including but not limited to text, graphics, logos, and software, are owned by TrendHive and are protected by copyright, trademark, and other intellectual property laws.
          </Text>

          <Text style={styles.sectionTitle}>10. Privacy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.
          </Text>

          <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, TrendHive shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our service.
          </Text>

          <Text style={styles.sectionTitle}>12. Disclaimers</Text>
          <Text style={styles.paragraph}>
            Our service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.
          </Text>

          <Text style={styles.sectionTitle}>13. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify and hold harmless TrendHive and its officers, directors, employees, and agents from any claims, damages, or expenses arising out of your use of the service or violation of these terms.
          </Text>

          <Text style={styles.sectionTitle}>14. Termination</Text>
          <Text style={styles.paragraph}>
            We may terminate or suspend your account and access to our service at any time, with or without cause, with or without notice. You may also terminate your account at any time by contacting our support team.
          </Text>

          <Text style={styles.sectionTitle}>15. Governing Law</Text>
          <Text style={styles.paragraph}>
            These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which TrendHive operates, without regard to its conflict of law provisions.
          </Text>

          <Text style={styles.sectionTitle}>16. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the updated terms in our app. Your continued use of the service after such changes constitutes acceptance of the new terms.
          </Text>

          <Text style={styles.sectionTitle}>17. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: almightymooon@gmail.com</Text>
          <Text style={styles.contactInfo}>Phone: +1 (555) xxx-xxxx</Text>
          <Text style={styles.contactInfo}>Address: somewhere on earth</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using our app, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginBottom: 5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 