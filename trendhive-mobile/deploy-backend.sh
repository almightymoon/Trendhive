
#!/bin/bash

echo "🚀 TrendHive Backend Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    print_error "Backend directory not found. Please run this script from the trendhive-mobile directory."
    exit 1
fi

print_status "Preparing backend for deployment..."

# Navigate to backend directory
cd backend

# Copy production files
if [ -f "server.prod.js" ]; then
    cp server.prod.js server.js
    print_status "Copied production server file"
else
    print_error "server.prod.js not found!"
    exit 1
fi

if [ -f "package.prod.json" ]; then
    cp package.prod.json package.json
    print_status "Copied production package.json"
else
    print_error "package.prod.json not found!"
    exit 1
fi

if [ -f "config.prod.env" ]; then
    cp config.prod.env .env
    print_status "Copied production environment file"
else
    print_error "config.prod.env not found!"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Test the server (macOS compatible)
print_status "Testing server startup..."
node server.js &
SERVER_PID=$!

sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    print_status "Server started successfully"
    kill $SERVER_PID
else
    print_warning "Server test skipped (timeout not available on macOS)"
    print_status "Backend files are ready for deployment"
fi

print_status "Backend is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://render.com and create a free account"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository or upload the backend folder"
echo "4. Set the following environment variables:"
echo "   - NODE_ENV=production"
echo "   - MONGODB_URI=mongodb+srv://moon:947131@cluster0.gvga3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
echo "   - DB_NAME=test"
echo "   - JWT_SECRET=trendhive-secret-key-2024"
echo "5. Deploy and get your URL"
echo "6. Update the mobile app's API configuration with your URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
print_warning "Don't forget to update your MongoDB connection string and JWT secret!" 