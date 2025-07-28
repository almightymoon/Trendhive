import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Card, Button, TextInput, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function WishlistShareModal({ visible, onClose, wishlistItems, wishlistName }) {
  const { colors } = useTheme();
  const [shareMethod, setShareMethod] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const shareMethods = [
    {
      id: 'copy',
      title: 'Copy Link',
      description: 'Copy wishlist link to clipboard',
      icon: 'copy-outline',
      color: '#3B82F6',
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Send via email',
      icon: 'mail-outline',
      color: '#10B981',
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      description: 'Share on WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
    },
    {
      id: 'telegram',
      title: 'Telegram',
      description: 'Share on Telegram',
      icon: 'paper-plane-outline',
      color: '#0088CC',
    },
    {
      id: 'facebook',
      title: 'Facebook',
      description: 'Share on Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
    },
    {
      id: 'twitter',
      title: 'Twitter',
      description: 'Share on Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
    },
  ];

  const generateWishlistLink = () => {
    // Generate a unique wishlist link
    const wishlistId = Math.random().toString(36).substr(2, 9);
    return `https://trendhive.com/wishlist/${wishlistId}`;
  };

  const generateWishlistText = () => {
    const itemCount = wishlistItems.length;
    const link = generateWishlistLink();
    return `Check out my wishlist "${wishlistName}" with ${itemCount} item${itemCount > 1 ? 's' : ''} on TrendHive! ${link}`;
  };

  const handleShare = async (method) => {
    const wishlistText = generateWishlistText();
    const link = generateWishlistLink();

    try {
      switch (method) {
        case 'copy':
          // Copy to clipboard
          await Share.share({
            message: wishlistText,
            url: link,
          });
          Alert.alert('Success', 'Wishlist link copied to clipboard!');
          break;

        case 'email':
          setShareMethod('email');
          break;

        case 'whatsapp':
          await Share.share({
            message: wishlistText,
            url: link,
          });
          break;

        case 'telegram':
          await Share.share({
            message: wishlistText,
            url: link,
          });
          break;

        case 'facebook':
          await Share.share({
            message: wishlistText,
            url: link,
          });
          break;

        case 'twitter':
          await Share.share({
            message: wishlistText,
            url: link,
          });
          break;

        default:
          await Share.share({
            message: wishlistText,
            url: link,
          });
      }
    } catch (error) {
      console.error('Error sharing wishlist:', error);
      Alert.alert('Error', 'Failed to share wishlist. Please try again.');
    }
  };

  const handleEmailShare = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const wishlistText = generateWishlistText();
    const link = generateWishlistLink();
    const emailBody = `${message}\n\n${wishlistText}`;

    // In a real app, you would send this via your backend
    Alert.alert(
      'Email Sent',
      `Wishlist shared with ${email}!`,
      [{ text: 'OK', onPress: () => setShareMethod('') }]
    );
  };

  const renderShareMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.shareMethod,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => handleShare(method.id)}
    >
      <View style={styles.shareMethodContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${method.color}20` },
          ]}
        >
          <Ionicons name={method.icon} size={24} color={method.color} />
        </View>
        <View style={styles.shareMethodText}>
          <Text style={[styles.shareMethodTitle, { color: colors.text }]}>
            {method.title}
          </Text>
          <Text style={[styles.shareMethodDescription, { color: colors.textSecondary }]}>
            {method.description}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderEmailForm = () => (
    <Card style={[styles.emailCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.emailTitle, { color: colors.text }]}>
          Share via Email
        </Text>
        
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.emailInput}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.textTertiary,
              background: colors.surface,
              outline: colors.border,
            }
          }}
        />

        <TextInput
          label="Message (Optional)"
          value={message}
          onChangeText={setMessage}
          mode="outlined"
          style={styles.emailInput}
          multiline
          numberOfLines={3}
          placeholder="Add a personal message..."
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.textTertiary,
              background: colors.surface,
              outline: colors.border,
            }
          }}
        />

        <View style={styles.emailActions}>
          <Button
            mode="outlined"
            onPress={() => setShareMethod('')}
            style={[styles.emailButton, { borderColor: colors.border }]}
            textColor={colors.text}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleEmailShare}
            style={styles.emailButton}
            buttonColor={colors.primary}
          >
            Send Email
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderWishlistPreview = () => (
    <Card style={[styles.previewCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <Text style={[styles.previewTitle, { color: colors.text }]}>
          Wishlist Preview
        </Text>
        <Text style={[styles.previewName, { color: colors.textSecondary }]}>
          {wishlistName}
        </Text>
        <Text style={[styles.previewCount, { color: colors.textSecondary }]}>
          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
        </Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewItems}>
          {wishlistItems.slice(0, 5).map((item, index) => (
            <View key={index} style={styles.previewItem}>
              <View style={[styles.previewItemImage, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="image-outline" size={20} color={colors.textTertiary} />
              </View>
              <Text style={[styles.previewItemName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))}
          {wishlistItems.length > 5 && (
            <View style={styles.previewMore}>
              <Text style={[styles.previewMoreText, { color: colors.textSecondary }]}>
                +{wishlistItems.length - 5} more
              </Text>
            </View>
          )}
        </ScrollView>
      </Card.Content>
    </Card>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Share Wishlist
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderWishlistPreview()}

          {shareMethod === 'email' ? (
            renderEmailForm()
          ) : (
            <Card style={[styles.shareCard, { backgroundColor: colors.card }]}>
              <Card.Content>
                <Text style={[styles.shareTitle, { color: colors.text }]}>
                  Choose Sharing Method
                </Text>
                <View style={styles.shareMethods}>
                  {shareMethods.map(renderShareMethod)}
                </View>
              </Card.Content>
            </Card>
          )}

          <Card style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={20} color={colors.info} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  Sharing Tips
                </Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Recipients can view your wishlist and purchase items for you{'\n'}
                • You'll be notified when someone buys from your wishlist{'\n'}
                • Wishlist links are private and secure
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  previewCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  previewItems: {
    flexDirection: 'row',
  },
  previewItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  previewItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  previewItemName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  previewMore: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  previewMoreText: {
    fontSize: 12,
    fontWeight: '500',
  },
  shareCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  shareMethods: {
    gap: 12,
  },
  shareMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  shareMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  shareMethodText: {
    flex: 1,
  },
  shareMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  shareMethodDescription: {
    fontSize: 14,
  },
  emailCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emailTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  emailInput: {
    marginBottom: 16,
  },
  emailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emailButton: {
    flex: 1,
  },
  infoCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 