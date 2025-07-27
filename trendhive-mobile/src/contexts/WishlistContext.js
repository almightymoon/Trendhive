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
    console.log('WishlistContext: User changed:', user ? 'User logged in' : 'No user');
    if (user) {
      console.log('WishlistContext: Loading wishlist for user:', user.id || user._id);
      loadWishlist();
    } else {
      console.log('WishlistContext: No user, clearing wishlist');
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const storageKey = getStorageKey();
      console.log('WishlistContext: Loading wishlist from storage:', storageKey);
      const savedWishlist = await AsyncStorage.getItem(storageKey);
      console.log('WishlistContext: Saved wishlist found:', savedWishlist ? 'Yes' : 'No');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        console.log('WishlistContext: Loaded wishlist items:', parsedWishlist.length);
        setWishlistItems(parsedWishlist);
      } else {
        console.log('WishlistContext: No saved wishlist, setting empty array');
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('WishlistContext: Error loading wishlist:', error);
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
      console.log('WishlistContext: No user logged in, cannot add to wishlist');
      return false;
    }

    const productId = product._id || product.id || product.productId;
    console.log('WishlistContext: Adding to wishlist:', product.name, 'ID:', productId);
    
    const existingItem = wishlistItems.find(item => {
      const itemId = item._id || item.id || item.productId;
      return itemId === productId;
    });

    if (existingItem) {
      console.log('WishlistContext: Product already in wishlist');
      return false;
    }

    const newWishlist = [...wishlistItems, product];
    console.log('WishlistContext: New wishlist items:', newWishlist.length);
    setWishlistItems(newWishlist);
    saveWishlist(newWishlist);
    return true;
  };

  const removeFromWishlist = (product) => {
    const productId = product._id || product.id || product.productId;
    console.log('WishlistContext: Removing from wishlist:', product.name, 'ID:', productId);
    const newWishlist = wishlistItems.filter(item => {
      const itemId = item._id || item.id || item.productId;
      return itemId !== productId;
    });
    console.log('WishlistContext: Wishlist after removal:', newWishlist.length);
    setWishlistItems(newWishlist);
    saveWishlist(newWishlist);
  };

  const isInWishlist = (product) => {
    const productId = product._id || product.id || product.productId;
    const result = wishlistItems.some(item => {
      const itemId = item._id || item.id || item.productId;
      return itemId === productId;
    });
    console.log('WishlistContext: Checking if product in wishlist:', product.name, 'Result:', result);
    return result;
  };

  const clearWishlist = () => {
    console.log('WishlistContext: Clearing wishlist');
    setWishlistItems([]);
    saveWishlist([]);
  };

  const getWishlistCount = () => {
    const count = wishlistItems.length;
    console.log('WishlistContext: Wishlist count:', count);
    return count;
  };

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