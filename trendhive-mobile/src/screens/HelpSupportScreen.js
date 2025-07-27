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

export default function HelpSupportScreen({ navigation }) {
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Title style={styles.title}>Help & Support</Title>
          <Text style={styles.subtitle}>
            Find answers to common questions or contact our support team
          </Text>
        </View>

        {/* Quick Contact Options */}
        <Card style={styles.contactCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Contact</Title>
            <View style={styles.contactOptions}>
              <TouchableOpacity style={styles.contactOption} onPress={handleCallSupport}>
                <View style={styles.contactIcon}>
                  <Ionicons name="call" size={24} color="#10B981" />
                </View>
                <Text style={styles.contactText}>Call Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactOption} onPress={handleLiveChat}>
                <View style={styles.contactIcon}>
                  <Ionicons name="chatbubbles" size={24} color="#10B981" />
                </View>
                <Text style={styles.contactText}>Live Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactOption} 
                onPress={() => setShowEmailForm(!showEmailForm)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="mail" size={24} color="#10B981" />
                </View>
                <Text style={styles.contactText}>Email Support</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Email Support Form */}
        {showEmailForm && (
          <Card style={styles.emailCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Email Support</Title>
              <Text style={styles.emailDescription}>
                Send us a detailed message and we'll get back to you within 24 hours.
              </Text>
              
              <TextInput
                label="Subject"
                value={emailSubject}
                onChangeText={setEmailSubject}
                mode="outlined"
                style={styles.input}
                placeholder="Brief description of your issue"
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
              />

              <View style={styles.emailButtons}>
                <Button
                  mode="outlined"
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowEmailForm(false);
                    setEmailSubject('');
                    setEmailMessage('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  style={styles.sendButton}
                  onPress={handleEmailSupport}
                >
                  Send Email
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Help Articles */}
        <Card style={styles.articlesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Frequently Asked Questions</Title>
            <Text style={styles.articlesDescription}>
              Find answers to common questions below
            </Text>
            
            {helpArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.accordionItem}
                onPress={() => setExpanded(expanded === article.id ? '' : article.id)}
              >
                <View style={styles.accordionHeader}>
                  <Text style={styles.accordionTitle}>{article.title}</Text>
                  <Ionicons
                    name={expanded === article.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </View>
                {expanded === article.id && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionText}>{article.content}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Support Hours */}
        <Card style={styles.hoursCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Support Hours</Title>
            <View style={styles.hoursRow}>
              <Ionicons name="time" size={20} color="#10B981" />
              <Text style={styles.hoursText}>Monday - Friday: 9 AM - 6 PM EST</Text>
            </View>
            <View style={styles.hoursRow}>
              <Ionicons name="time" size={20} color="#10B981" />
              <Text style={styles.hoursText}>Saturday: 10 AM - 4 PM EST</Text>
            </View>
            <View style={styles.hoursRow}>
              <Ionicons name="time" size={20} color="#10B981" />
              <Text style={styles.hoursText}>Sunday: Closed</Text>
            </View>
            <Text style={styles.hoursNote}>
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
    backgroundColor: '#f8fafc',
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
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  contactCard: {
    margin: 20,
    backgroundColor: 'white',
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
    color: '#1f2937',
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
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  emailCard: {
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
  emailDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  emailButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#6b7280',
  },
  sendButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#10B981',
  },
  articlesCard: {
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
  articlesDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  accordionItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
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
    color: '#1f2937',
    flex: 1,
  },
  accordionContent: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  accordionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  hoursCard: {
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
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hoursText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 10,
  },
  hoursNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 10,
  },
}); 