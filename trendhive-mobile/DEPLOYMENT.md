# TrendHive Mobile App - Backend Deployment Guide

## Overview
This guide will help you deploy the TrendHive backend to a cloud service so your mobile app can work independently without relying on your local machine.

## Option 1: Deploy to Render (Recommended - Free)

### Step 1: Prepare Your Backend
1. Navigate to the backend directory:
   ```bash
   cd trendhive-mobile/backend
   ```

2. Copy the production files:
   ```bash
   cp server.prod.js server.js
   cp package.prod.json package.json
   cp config.prod.env .env
   ```

3. Update the `.env` file with your actual credentials:
   ```env
   NODE_ENV=production
   PORT=4001
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=trendhive
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and create a free account
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository or upload the backend folder
4. Configure the service:
   - **Name**: trendhive-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add environment variables in Render dashboard:
   - `NODE_ENV`: production
   - `MONGODB_URI`: your-mongodb-connection-string
   - `DB_NAME`: trendhive
   - `JWT_SECRET`: your-secret-key

6. Deploy and get your URL (e.g., `https://trendhive-backend.onrender.com`)

## Option 2: Deploy to Railway (Alternative - Free)

1. Go to [railway.app](https://railway.app)
2. Create account and connect GitHub
3. Create new project from GitHub
4. Select the backend folder
5. Add environment variables
6. Deploy

## Option 3: Deploy to Heroku (Paid)

1. Install Heroku CLI
2. Create Heroku app
3. Add MongoDB addon
4. Deploy using Git

## Update Mobile App Configuration

After deploying, update your mobile app's API configuration:

### For Development (Local Testing)
```javascript
// src/config/api.js
const isDevelopment = __DEV__;

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'http://192.168.1.3:4001/api'  // Local development
    : 'https://your-backend-url.onrender.com/api', // Production
  // ... rest of config
};
```

### For Production APK
```javascript
// src/config/api.js
export const API_CONFIG = {
  BASE_URL: 'https://your-backend-url.onrender.com/api', // Always production
  // ... rest of config
};
```

## Environment Variables Setup

### Required Variables:
- `MONGODB_URI`: Your MongoDB connection string
- `DB_NAME`: Database name (e.g., "trendhive")
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Set to "production"

### Optional Variables:
- `CLOUDINARY_CLOUD_NAME`: For image uploads
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `STRIPE_SECRET_KEY`: For Stripe payments
- `PAYPAL_CLIENT_ID`: For PayPal payments
- `PAYPAL_CLIENT_SECRET`: PayPal client secret

## Testing Your Deployment

1. Test the health endpoint:
   ```
   GET https://your-backend-url.onrender.com/api/health
   ```

2. Test authentication:
   ```
   POST https://your-backend-url.onrender.com/api/auth/signup
   POST https://your-backend-url.onrender.com/api/auth/signin
   ```

3. Test products:
   ```
   GET https://your-backend-url.onrender.com/api/products
   ```

## Security Considerations

1. **JWT Secret**: Use a strong, random secret key
2. **CORS**: Configure CORS properly for your domain
3. **Rate Limiting**: Consider adding rate limiting
4. **Input Validation**: Validate all inputs
5. **HTTPS**: Always use HTTPS in production

## Monitoring

- Set up logging to monitor your backend
- Use health checks to ensure uptime
- Monitor database connections
- Set up alerts for errors

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CORS configuration
2. **Database Connection**: Verify MongoDB URI
3. **Environment Variables**: Ensure all required vars are set
4. **Port Issues**: Make sure port is correctly configured

### Debug Commands:
```bash
# Check if backend is running
curl https://your-backend-url.onrender.com/api/health

# Test database connection
curl https://your-backend-url.onrender.com/api/products

# Check logs in deployment platform
```

## Cost Optimization

- Use free tiers when possible
- Monitor usage to avoid unexpected charges
- Consider serverless options for cost efficiency
- Use CDN for static assets

## Next Steps

1. Deploy your backend using one of the options above
2. Update your mobile app's API configuration
3. Test all functionality
4. Build and distribute your APK
5. Monitor and maintain your backend

Your mobile app will now work independently without requiring your laptop to be running! 