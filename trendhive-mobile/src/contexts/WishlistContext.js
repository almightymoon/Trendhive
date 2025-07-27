import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Get storage key based on user ID
  const getStorageKey = () => {
    const userId = user?.id || user?._id;
    return userId ? `wishlist_${userId}` : 'wishlist_guest';
  };

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      const storageKey = getStorageKey();
      const savedWishlist = await AsyncStorage.getItem(storageKey);
      console.log('Loading wishlist from storage:', storageKey, savedWishlist ? 'found' : 'not found');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        console.log('Loaded wishlist items:', parsedWishlist.length);
        setWishlistItems(parsedWishlist);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveWishlist = async (items) => {
    try {
      const storageKey = getStorageKey();
      console.log('Saving wishlist items:', items.length, 'to key:', storageKey);
      await AsyncStorage.setItem(storageKey, JSON.stringify(items));
      console.log('Wishlist saved successfully');
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const addToWishlist = (product) => {
    if (!user) {
      console.log('No user logged in, cannot add to wishlist');
      return false;
    }

    const productId = product._id || product.id || product.productId;
    console.log('Adding to wishlist:', product.name, 'ID:', productId);
    
    const existingItem = wishlistItems.find(item => {
      const itemId = item._id || item.id || item.productId;
      return itemId === productId;
    });

    if (existingItem) {
      console.log('Product already in wishlist');
      return false;
    }

    const newWishlist = [...wishlistItems, product];
    console.log('New wishlist items:', newWishlist.length);
    setWishlistItems(newWishlist);
    saveWishlist(newWishlist);
    return true;
  };

  const removeFromWishlist = (product) => {
    const productId = product._id || product.id || product.productId;
    const newWishlist = wishlistItems.filter(item => {
      const itemId = item._id || item.id || item.productId;
      return itemId !== productId;
    });
    setWishlistItems(newWishlist);
    saveWishlist(newWishlist);
  };

  const isInWishlist = (product) => {
    const productId = product._id || product.id || product.productId;
    return wishlistItems.some(item => {
      const itemId = item._id || item.id || item.productId;
      return itemId === productId;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    saveWishlist([]);
  };

  const getWishlistCount = () => wishlistItems.length;

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 