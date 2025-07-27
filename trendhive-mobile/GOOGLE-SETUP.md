# Google Sign-In Setup Guide

## Quick Setup (5 minutes)

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Sign-In API

### 2. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Create credentials for:
   - **Web application** (for Expo development)
   - **Android** (for APK)
   - **iOS** (if needed)

### 3. Update Mobile App
Replace the placeholder IDs in `src/screens/SignInScreen.js`:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

### 4. Update Backend (Optional)
For production, update the Google Sign-In endpoint in `backend/server.prod.js` to verify tokens with Google.

## Current Status
✅ Google Sign-In UI implemented  
✅ Backend endpoint ready  
⚠️ Need to add your Google Client IDs  
⚠️ Need to verify tokens with Google (optional)  

## Test
1. Run the app
2. Tap "Continue with Google"
3. Should open Google Sign-In flow
4. After successful sign-in, user will be logged in

## Troubleshooting
- If you get "invalid_client" error, check your Client IDs
- If you get "redirect_uri_mismatch", add your redirect URI to Google Console
- For development, use the web client ID in Expo

## Next Steps
1. Add your Google Client IDs
2. Test the sign-in flow
3. Deploy backend with Google verification (optional) 