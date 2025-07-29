# 🚀 Deploy TrendHive Backend to Render

## Quick Setup

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +"** and select **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   - **Name:** `trendhive-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`

5. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   NODE_ENV=production
   DB_NAME=trendhive
   ```

6. **Deploy!**

## After Deployment

Your backend will be available at:
```
https://trendhive-backend.onrender.com/api
```

## Update Mobile App

Update your mobile app's API config:
```javascript
BASE_URL: 'https://trendhive-backend.onrender.com/api'
```

## Benefits

✅ **Always accessible** - No need for tunnels
✅ **HTTPS by default** - Works with all mobile devices
✅ **Free tier available** - No cost for development
✅ **Automatic scaling** - Handles traffic spikes
✅ **Custom domain** - Can use your own domain later 