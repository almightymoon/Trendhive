import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiService.setAuthToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await apiService.signIn(email, password);
      const { token: authToken, user: userData } = response;
      
      // Validate that we have valid data before storing
      if (!authToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      setToken(authToken);
      setUser(userData);
      
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      apiService.setAuthToken(authToken);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async (accessToken) => {
    try {
      const response = await apiService.signInWithGoogle(accessToken);
      const { token: authToken, user: userData } = response;
      
      setToken(authToken);
      setUser(userData);
      
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      apiService.setAuthToken(authToken);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await apiService.signUp(userData);
      const { token: authToken, user: newUser } = response;
      
      // Validate that we have valid data before storing
      if (!authToken || !newUser) {
        throw new Error('Invalid response from server');
      }
      
      setToken(authToken);
      setUser(newUser);
      
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      apiService.setAuthToken(authToken);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      setToken(null);
      setUser(null);
      
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      apiService.setAuthToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await apiService.updateProfile(profileData);
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = (newUserData) => {
    if (newUserData) {
      setUser(newUserData);
      AsyncStorage.setItem('user', JSON.stringify(newUserData));
    }
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    updateUser,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 