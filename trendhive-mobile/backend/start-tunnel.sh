#!/bin/bash

echo "🚀 Starting TrendHive Backend Tunnel..."

# Check if backend is running
if ! curl -s http://localhost:4000/api/health > /dev/null; then
    echo "❌ Backend is not running on port 4000"
    echo "Please start your backend first: npm start"
    exit 1
fi

echo "✅ Backend is running on localhost:4000"
echo "🌐 Starting public tunnel..."

# Start localtunnel
npx localtunnel --port 4000 --subdomain trendhive-backend

echo ""
echo "🔗 Your backend is now accessible at:"
echo "   https://trendhive-backend.loca.lt/api"
echo ""
echo "📱 Update your mobile app's API config to use this URL" 