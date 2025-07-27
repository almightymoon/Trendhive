# TrendHive Mobile App

A modern React Native mobile application for the TrendHive e-commerce platform, built with Expo and designed to run on Android devices.

## 🚀 Features

### Core Features
- **Product Browsing**: Browse products with search, filtering, and sorting
- **Shopping Cart**: Add/remove items, manage quantities, and view cart total
- **User Authentication**: Sign up, sign in, and profile management
- **Order Management**: View order history and track order status
- **Checkout Process**: Complete checkout with shipping and payment information
- **Responsive Design**: Optimized for mobile devices with beautiful UI

### Technical Features
- **React Native + Expo**: Cross-platform mobile development
- **Navigation**: Tab and stack navigation with React Navigation
- **State Management**: Context API for authentication and cart state
- **API Integration**: RESTful API communication with backend
- **Offline Storage**: AsyncStorage for persistent data
- **Modern UI**: React Native Paper components with custom styling

## 🎨 Design

The app uses your brand colors:
- **Primary Green**: `#10B981` (Emerald-500)
- **White**: `#FFFFFF`
- **Background**: `#F8FAFC` (Gray-50)
- **Text**: `#1F2937` (Gray-800)

## 📱 Screens

1. **Home Screen**: Hero section, categories, featured products
2. **Products Screen**: Product grid with search and filters
3. **Product Detail**: Product information, images, add to cart
4. **Cart Screen**: Cart items, quantity controls, checkout
5. **Profile Screen**: User profile, settings, quick actions
6. **Authentication**: Sign in and sign up forms
7. **Orders Screen**: Order history and status tracking
8. **Checkout Screen**: Shipping info, payment methods, order summary

## 🛠️ Prerequisites

Before running the app, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio** (for Android development)
- **Android SDK** (for Android emulator/device)

## 📦 Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd trendhive-mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## 🚀 Running on Android

### Option 1: Using Expo Go App (Easiest)
1. Install **Expo Go** from Google Play Store on your Android device
2. Run `npm start` in the project directory
3. Scan the QR code with Expo Go app
4. The app will load on your device

### Option 2: Using Android Emulator
1. **Install Android Studio** and set up an Android Virtual Device (AVD)
2. **Set up Android SDK**:
   ```bash
   # Add to your ~/.bash_profile or ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. **Start the emulator** from Android Studio
4. **Run the app**:
   ```bash
   npm run android
   ```

### Option 3: Using Physical Android Device
1. **Enable Developer Options** on your Android device
2. **Enable USB Debugging**
3. **Connect your device** via USB
4. **Run the app**:
   ```bash
   npm run android
   ```

## 🔧 Configuration

### Backend API Configuration
Update the API base URL in `src/services/apiService.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url.com/api';
```

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=http://your-backend-url.com/api
```

## 📁 Project Structure

```
trendhive-mobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.js
│   │   ├── ProductsScreen.js
│   │   ├── ProductDetailScreen.js
│   │   ├── CartScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SignInScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── OrdersScreen.js
│   │   └── CheckoutScreen.js
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── services/          # API services
│   │   └── apiService.js
│   ├── components/        # Reusable components
│   └── utils/            # Utility functions
├── assets/               # Images and static files
├── App.js               # Main app component
├── app.json             # Expo configuration
└── package.json         # Dependencies
```

## 🔌 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run build:android` - Build Android APK
- `npm run build:ios` - Build iOS app

## 📱 Building for Production

### Android APK
```bash
expo build:android
```

### Android App Bundle (AAB)
```bash
expo build:android --type app-bundle
```

## 🐛 Troubleshooting

### Common Issues

1. **Android SDK not found**:
   - Install Android Studio
   - Set up ANDROID_HOME environment variable
   - Install Android SDK Platform Tools

2. **Metro bundler issues**:
   ```bash
   npm start -- --clear
   ```

3. **Package version conflicts**:
   ```bash
   npm install --force
   ```

4. **Expo Go connection issues**:
   - Ensure device and computer are on the same network
   - Try using tunnel connection: `npm start -- --tunnel`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the TrendHive e-commerce platform.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review Expo documentation: https://docs.expo.dev/
- Review React Native documentation: https://reactnative.dev/

---

**Note**: Make sure your backend server is running and accessible before testing the mobile app features that require API communication. 