# Parea Mobile App 📱
> Cross-platform React Native mobile application for local event discovery, social hosting, and community interaction.

[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_51-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Expo Router](https://img.shields.io/badge/Expo_Router-v3-000000?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

## 📌 Architecture & Features
- **Race-Condition-Free Navigation:** Centralized initial layout router guards eliminating auth/onboarding flashes on app cold start.
- **Dynamic Event Discovery:** Real-time search, category filtering, and attendance management powered by React hooks (`useMemo`).
- **Persistent Auth Hydration:** Token persistence via `expo-secure-store` synchronized with AuthContext state.
- **Event Chat & Social Features:** In-app messaging for approved event participants with strict host/attendee permission rules.
- **Custom UI System:** Built with reusable modal sheets (`PareaDialog`), custom tab navigators, and theme-aware layouts.

## 🛠️ Tech Stack
- **Framework:** React Native / Expo (SDK 51)
- **Language:** TypeScript
- **Navigation:** Expo Router v3 (File-based Routing inside `app/`)
- **State Management:** React Context API (`AuthContext`, `AppContext`)
- **Storage:** Expo SecureStore (Auth Tokens) & AsyncStorage (App State)

## 🚀 Quick Start
```bash
# Clone the repository
git clone https://github.com/mkirkos2/parea-mobile-app.git
cd parea-mobile-app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```