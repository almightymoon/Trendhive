#!/bin/bash

echo "🚀 Building TrendHive APK..."

# Set environment variables for production build
export EXPO_PUBLIC_API_URL="https://trendhive-backend.onrender.com/api"
export NODE_ENV="production"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf android/app/build
rm -rf android/.gradle

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Prebuild the project
echo "🔨 Prebuilding project..."
npx expo prebuild --platform android --clean

# Build APK
echo "🏗️ Building APK..."
cd android
./gradlew clean
./gradlew assembleDebug

# Check if build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ APK built successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    echo "📏 APK size: $(du -h app/build/outputs/apk/debug/app-debug.apk | cut -f1)"
else
    echo "❌ APK build failed!"
    exit 1
fi 