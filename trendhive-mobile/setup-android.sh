#!/bin/bash

# TrendHive Mobile App - Android Setup Script for macOS
echo "🚀 Setting up Android development environment for TrendHive Mobile App..."

# Check if Android Studio is installed
if [ ! -d "$HOME/Library/Android/sdk" ]; then
    echo "❌ Android SDK not found!"
    echo "Please install Android Studio first:"
    echo "https://developer.android.com/studio"
    echo ""
    echo "After installing Android Studio:"
    echo "1. Open Android Studio"
    echo "2. Go to Tools > SDK Manager"
    echo "3. Install Android SDK Platform-Tools"
    echo "4. Run this script again"
    exit 1
fi

# Set up environment variables
echo "📝 Setting up environment variables..."

# Check if variables are already set
if grep -q "ANDROID_HOME" ~/.zshrc 2>/dev/null; then
    echo "✅ Android environment variables already configured in ~/.zshrc"
else
    echo "export ANDROID_HOME=\$HOME/Library/Android/sdk" >> ~/.zshrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/emulator" >> ~/.zshrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/tools" >> ~/.zshrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin" >> ~/.zshrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.zshrc
    echo "✅ Android environment variables added to ~/.zshrc"
fi

# Also add to bash profile if it exists
if [ -f ~/.bash_profile ]; then
    if grep -q "ANDROID_HOME" ~/.bash_profile 2>/dev/null; then
        echo "✅ Android environment variables already configured in ~/.bash_profile"
    else
        echo "export ANDROID_HOME=\$HOME/Library/Android/sdk" >> ~/.bash_profile
        echo "export PATH=\$PATH:\$ANDROID_HOME/emulator" >> ~/.bash_profile
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools" >> ~/.bash_profile
        echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin" >> ~/.bash_profile
        echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.bash_profile
        echo "✅ Android environment variables added to ~/.bash_profile"
    fi
fi

# Check if adb is available
if command -v adb &> /dev/null; then
    echo "✅ ADB (Android Debug Bridge) is available"
else
    echo "⚠️  ADB not found in PATH. Please restart your terminal or run:"
    echo "source ~/.zshrc"
fi

# Check if emulator is available
if command -v emulator &> /dev/null; then
    echo "✅ Android Emulator is available"
else
    echo "⚠️  Android Emulator not found in PATH. Please restart your terminal or run:"
    echo "source ~/.zshrc"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your terminal or run: source ~/.zshrc"
echo "2. Open Android Studio and create an Android Virtual Device (AVD)"
echo "3. Start the emulator from Android Studio"
echo "4. Run the app: npm run android"
echo ""
echo "Or use Expo Go app on your physical Android device:"
echo "1. Install Expo Go from Google Play Store"
echo "2. Run: npm start"
echo "3. Scan the QR code with Expo Go"
echo ""
echo "Happy coding! 🚀" 