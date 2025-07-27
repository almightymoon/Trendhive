# Quick Backend Deployment Guide

## 🚀 Deploy Your Backend in 5 Minutes

### Step 1: Prepare Backend
```bash
cd trendhive-mobile
./deploy-backend.sh
```

### Step 2: Deploy to Render (Free)
1. Go to [render.com](https://render.com) - Sign up for free
2. Click "New +" → "Web Service"
3. Upload your `backend` folder or connect GitHub
4. Set environment variables:
   - `NODE_ENV`: production
   - `MONGODB_URI`: `mongodb+srv://moon:947131@cluster0.gvga3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - `DB_NAME`: test
   - `JWT_SECRET`: `trendhive-secret-key-2024`
5. Deploy and get your URL (e.g., `https://your-app.onrender.com`)

### Step 3: Update Mobile App
Edit `src/config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'http://192.168.1.3:4001/api'  // Local development
    : 'https://your-app.onrender.com/api', // Your Render URL
  // ... rest of config
};
```

### Step 4: Build APK
```bash
npx eas build --platform android --profile production
```

## ✅ Your app will now work without your laptop!

### Test Your Deployment
```bash
curl https://your-app.onrender.com/api/health
```

### Troubleshooting
- If you get CORS errors, the backend is working but needs CORS config
- If you get "not found", check your URL
- If you get database errors, check your MongoDB connection string

## 🔧 Alternative: Railway (Also Free)
1. Go to [railway.app](https://railway.app)
2. Create account and connect GitHub
3. Deploy the backend folder
4. Add the same environment variables
5. Get your URL and update the mobile app

## 💡 Pro Tips
- Use the same MongoDB database as your web app
- Keep your JWT secret secure
- Monitor your free tier usage
- Set up automatic deployments from GitHub

Your mobile app will now be completely independent! 🎉 