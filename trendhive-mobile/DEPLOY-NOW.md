# 🚀 Deploy Your Backend NOW (5 minutes)

## Step 1: Deploy to Render (Free)

### 1. Go to Render.com
- Visit [render.com](https://render.com)
- Sign up for a free account

### 2. Create New Web Service
- Click "New +" button
- Select "Web Service"
- Choose "Deploy from GitHub" or "Upload files"

### 3. If using GitHub:
- Connect your GitHub account
- Select the `trendhive-mobile` repository
- Set the root directory to `backend`

### 4. If uploading files:
- Upload the entire `backend` folder from your project
- Make sure it contains: `server.js`, `package.json`, `.env`

### 5. Configure the Service
- **Name**: `trendhive-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 6. Add Environment Variables
Click "Environment" tab and add these variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://moon:947131@cluster0.gvga3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=test
JWT_SECRET=trendhive-secret-key-2024
```

### 7. Deploy
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Copy your URL (e.g., `https://your-app.onrender.com`)

## Step 2: Add Sample Data

### Option A: Use the script
```bash
cd trendhive-mobile
node add-sample-products.js
```

### Option B: Manual (if script doesn't work)
Your MongoDB already has products from the web app, so this step is optional.

## Step 3: Update Mobile App

Edit `src/config/api.js` and replace the production URL:

```javascript
export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'http://192.168.1.3:4001/api'  // Local development
    : 'https://your-app.onrender.com/api', // Your Render URL
  // ... rest of config
};
```

## Step 4: Test Your Backend

Test these endpoints:
- Health: `https://your-app.onrender.com/api/health`
- Products: `https://your-app.onrender.com/api/products`
- Sign up: `POST https://your-app.onrender.com/api/auth/signup`

## Step 5: Build New APK

```bash
npx eas build --platform android --profile production
```

## ✅ Result
Your mobile app will now:
- ✅ Work completely independently
- ✅ Pull data from MongoDB
- ✅ Use images from Cloudinary
- ✅ Handle authentication
- ✅ Process orders
- ✅ No laptop required!

## 🆘 Troubleshooting

### If deployment fails:
- Check environment variables are correct
- Make sure MongoDB URI is valid
- Check Render logs for errors

### If app can't connect:
- Verify the backend URL is correct
- Test the health endpoint
- Check CORS settings

### If no products show:
- Run the sample data script
- Check MongoDB connection
- Verify products exist in database

## 🎉 You're Done!
Your TrendHive mobile app is now completely standalone! 