#!/bin/bash

echo "🚀 Deploying TrendHive Backend to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📦 Installing Render CLI..."
    curl -sL https://render.com/download-cli/install.sh | bash
fi

# Navigate to backend directory
cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in backend directory"
    exit 1
fi

echo "✅ Backend files found"
echo "📋 Next steps:"
echo ""
echo "1. Go to https://render.com and sign up/login"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Set the following environment variables:"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - JWT_SECRET: A secure secret key"
echo "   - NODE_ENV: production"
echo "5. Set Build Command: npm install"
echo "6. Set Start Command: node server.js"
echo "7. Deploy!"
echo ""
echo "🔗 Once deployed, update your mobile app's API config with the new URL"
echo "   Example: https://your-app-name.onrender.com/api" 