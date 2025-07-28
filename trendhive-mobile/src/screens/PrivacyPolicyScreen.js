import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CoolHeader from '../components/CoolHeader';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CoolHeader
        title="Privacy Policy"
        subtitle="Last updated: July 28, 2025"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
          </Text>
          <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
          <Text style={styles.bulletPoint}>• Shipping and billing addresses</Text>
          <Text style={styles.bulletPoint}>• Payment information (processed securely through our payment partners)</Text>
          <Text style={styles.bulletPoint}>• Order history and preferences</Text>
          <Text style={styles.bulletPoint}>• Communication records with our support team</Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Process and fulfill your orders</Text>
          <Text style={styles.bulletPoint}>• Send order confirmations and updates</Text>
          <Text style={styles.bulletPoint}>• Provide customer support</Text>
          <Text style={styles.bulletPoint}>• Improve our products and services</Text>
          <Text style={styles.bulletPoint}>• Send marketing communications (with your consent)</Text>
          <Text style={styles.bulletPoint}>• Prevent fraud and ensure security</Text>

          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </Text>
          <Text style={styles.bulletPoint}>• With payment processors to complete transactions</Text>
          <Text style={styles.bulletPoint}>• With shipping partners to deliver your orders</Text>
          <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
          <Text style={styles.bulletPoint}>• With your explicit consent</Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
          <Text style={styles.bulletPoint}>• Secure payment processing</Text>
          <Text style={styles.bulletPoint}>• Regular security assessments</Text>
          <Text style={styles.bulletPoint}>• Access controls and authentication</Text>

          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. We may retain certain information for legal, accounting, or security purposes.
          </Text>

          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal information</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your information</Text>
          <Text style={styles.bulletPoint}>• Opt out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Withdraw consent at any time</Text>

          <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie settings through your device preferences.
          </Text>

          <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
          </Text>

          <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </Text>

          <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy in our app and updating the "Last updated" date.
          </Text>

          <Text style={styles.sectionTitle}>11. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: almightymooon@gmail.com</Text>
          <Text style={styles.contactInfo}>Phone: +1 (555) xxx-xxxx</Text>
          <Text style={styles.contactInfo}>Address: somewhere on earth</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using our app, you agree to the collection and use of information in accordance with this policy.
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