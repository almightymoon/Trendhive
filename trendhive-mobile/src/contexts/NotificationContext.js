import React, { createContext, useContext, useState } from 'react';
import NotificationToast from '../components/NotificationToast';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success',
    duration: 3000,
  });

  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({
      visible: true,
      message,
      type,
      duration,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const showSuccess = (message, duration) => {
    showNotification(message, 'success', duration);
  };

  const showError = (message, duration) => {
    showNotification(message, 'error', duration);
  };

  const showWarning = (message, duration) => {
    showNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration) => {
    showNotification(message, 'info', duration);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <NotificationToast
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onHide={hideNotification}
      />
    </NotificationContext.Provider>
  );
}; 