export default {
  expo: {
    name: "TrendHive",
    slug: "trendhive-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    icon: "./assets/icon.png",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#10B981"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.moontech94.trendhive"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#10B981"
      },
      package: "com.moontech94.trendhive",
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ],
      networkSecurityConfig: {
        cleartextTrafficPermitted: true
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "0a97877b-5525-4cd6-bf2c-e5c681b17feb"
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            networkSecurityConfig: {
              cleartextTrafficPermitted: true
            }
          }
        }
      ]
    ]
  }
}; 