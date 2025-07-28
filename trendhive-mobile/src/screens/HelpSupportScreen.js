import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function HelpSupportScreen({ navigation }) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const helpArticles = [
    {
      id: '1',
      title: 'How to place an order',
      content: `1. Browse our products and add items to your cart
2. Review your cart and proceed to checkout
3. Enter your shipping and billing information
4. Choose your payment method
5. Review your order and confirm
6. You'll receive an order confirmation email

If you encounter any issues during checkout, please contact our support team.`,
    },
    {
      id: '2',
      title: 'Payment methods accepted',
      content: `We accept the following payment methods:
• Credit/Debit Cards (Visa, MasterCard, American Express)
• PayPal
• Apple Pay (iOS devices)
• Google Pay (Android devices)

All payments are processed securely through our trusted payment partners.`,
    },
    {
      id: '3',
      title: 'Shipping and delivery',
      content: `Standard Shipping: 3-5 business days
Express Shipping: 1-2 business days
Free shipping on orders over $50

We ship to all 50 US states and most international locations. International shipping may take 7-14 business days.

You can track your order through your account or using the tracking number provided in your shipping confirmation email.`,
    },
    {
      id: '4',
      title: 'Returns and refunds',
      content: `We offer a 30-day return policy for most items:
• Items must be unused and in original packaging
• Return shipping is free for defective items
• Refunds are processed within 5-7 business days
• Some items are non-returnable (electronics, personal care items)

To initiate a return, go to your order history and select "Return Item" or contact our support team.`,
    },
    {
      id: '5',
      title: 'Account and security',
      content: `• Keep your password secure and don't share it with anyone
• Enable two-factor authentication if available
• Regularly update your contact information
• Monitor your order history for any suspicious activity
• Log out from shared devices

If you suspect unauthorized access to your account, contact us immediately.`,
    },
    {
      id: '6',
      title: 'Product information',
      content: `• Product descriptions include detailed specifications
• Customer reviews help you make informed decisions
• Product images show multiple angles and details
• Size charts are available for clothing and accessories
• Contact us if you need additional product information

We strive to provide accurate and up-to-date product information.`,
    },
  ];

  const handleEmailSupport = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      Alert.alert('Error', 'Please fill in both subject and message');
      return;
    }

    try {
      const mailtoUrl = `mailto:support@trendhive.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        setEmailSubject('');
        setEmailMessage('');
        setShowEmailForm(false);
      } else {
        Alert.alert('Error', 'No email app found on your device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email app');
    }
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Contact Support',
      'Call our support team at +1 (555) 123-4567',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+15551234567'),
        },
      ]
    );
  };

  const handleLiveChat = () => {
    Alert.alert(
      'Live Chat',
      'Live chat is available Monday-Friday, 9 AM - 6 PM EST. Please visit our website for live chat support.',
      [
        { text: 'OK' },
        {
          text: 'Visit Website',
          onPress: () => Linking.openURL('https://trendhive.com/support'),
        },
      ]
    );
  };

  const getTextInputTheme = () => ({
    colors: {
      primary: colors.primary,
      text: colors.text,
      placeholder: colors.textSecondary,
      background: colors.card,
      onSurface: colors.text,
      surface: colors.card,
      outline: colors.border,
      onSurfaceVariant: colors.primary,
      primaryContainer: colors.primary,
      onPrimaryContainer: '#ffffff',
      secondary: colors.primary,
      secondaryContainer: colors.primary,
      onSecondaryContainer: '#ffffff',
    }
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: colors.text }]}>Help & Support</Title>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Find answers to common questions or contact our support team
          </Text>
        </View>

        {/* Quick Contact Options */}
        <Card style={[styles.contactCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Quick Contact</Title>
            <View style={styles.contactOptions}>
              <TouchableOpacity style={styles.contactOption} onPress={handleCallSupport}>
                <View style={[styles.contactIcon, { backgroundColor: colors.surfaceVariant }]}>
                  <Ionicons name="call" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.contactText, { color: colors.text }]}>Call Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactOption} onPress={handleLiveChat}>
                <View style={[styles.contactIcon, { backgroundColor: colors.surfaceVariant }]}>
                  <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.contactText, { color: colors.text }]}>Live Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactOption} 
                onPress={() => setShowEmailForm(!showEmailForm)}
              >
                <View style={[styles.contactIcon, { backgroundColor: colors.surfaceVariant }]}>
                  <Ionicons name="mail" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.contactText, { color: colors.text }]}>Email Support</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Email Support Form */}
        {showEmailForm && (
          <Card style={[styles.emailCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Title style={[styles.sectionTitle, { color: colors.text }]}>Email Support</Title>
              <Text style={[styles.emailDescription, { color: colors.textSecondary }]}>
                Send us a detailed message and we'll get back to you within 24 hours.
              </Text>
              
              <TextInput
                label="Subject"
                value={emailSubject}
                onChangeText={setEmailSubject}
                mode="outlined"
                style={styles.input}
                placeholder="Brief description of your issue"
                theme={getTextInputTheme()}
              />

              <TextInput
                label="Message"
                value={emailMessage}
                onChangeText={setEmailMessage}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={6}
                placeholder="Please provide detailed information about your issue..."
                theme={getTextInputTheme()}
              />

              <View style={styles.emailButtons}>
                <Button
                  mode="outlined"
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => {
                    setShowEmailForm(false);
                    setEmailSubject('');
                    setEmailMessage('');
                  }}
                  textColor={colors.text}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  style={styles.sendButton}
                  onPress={handleEmailSupport}
                  buttonColor={colors.primary}
                >
                  Send Email
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Help Articles */}
        <Card style={[styles.articlesCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Title>
            <Text style={[styles.articlesDescription, { color: colors.textSecondary }]}>
              Find answers to common questions below
            </Text>
            
            {helpArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={[styles.accordionItem, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border 
                }]}
                onPress={() => setExpanded(expanded === article.id ? '' : article.id)}
              >
                <View style={styles.accordionHeader}>
                  <Text style={[styles.accordionTitle, { color: colors.text }]}>{article.title}</Text>
                  <Ionicons
                    name={expanded === article.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
                {expanded === article.id && (
                  <View style={[styles.accordionContent, { 
                    backgroundColor: colors.surfaceVariant,
                    borderTopColor: colors.border 
                  }]}>
                    <Text style={[styles.accordionText, { color: colors.textSecondary }]}>{article.content}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Support Hours */}
        <Card style={[styles.hoursCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: colors.text }]}>Support Hours</Title>
            <View style={styles.hoursRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.hoursText, { color: colors.textSecondary }]}>Monday - Friday: 9 AM - 6 PM EST</Text>
            </View>
            <View style={styles.hoursRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.hoursText, { color: colors.textSecondary }]}>Saturday: 10 AM - 4 PM EST</Text>
            </View>
            <View style={styles.hoursRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.hoursText, { color: colors.textSecondary }]}>Sunday: Closed</Text>
            </View>
            <Text style={[styles.hoursNote, { color: colors.textSecondary }]}>
              For urgent issues outside business hours, please email us and we'll respond as soon as possible.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  contactCard: {
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactOption: {
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  emailCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  emailButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    flex: 1,
    marginLeft: 10,
  },
  articlesCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articlesDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  accordionItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  accordionContent: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
  },
  accordionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  hoursCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hoursText: {
    fontSize: 14,
    marginLeft: 10,
  },
  hoursNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
  },
}); 