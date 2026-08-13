# Development Setup Guide

## Automated Development Environment

### Start Development Servers

```
PowerShell -ExecutionPolicy Bypass -File .\start-parea-dev.ps1
```

This automated script will:
- Detect your LAN IP address automatically
- Configure the mobile app environment
- Start both Laravel API and Expo Metro servers
- Verify connectivity
- Show you the URLs for testing

### Stop Development Servers

```
PowerShell -ExecutionPolicy Bypass -File .\stop-parea-dev.ps1
```

This will safely stop only the development servers started by the launcher.

## Manual Setup (Alternative)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd C:\Users\Michael\Desktop\New folder\parea-api
   ```

2. Start the Laravel development server:
   ```
   php artisan serve --host=0.0.0.0 --port=8000
   ```

### Mobile Setup

1. Navigate to the mobile app directory:
   ```
   cd C:\Users\Michael\Desktop\New folder\parea-app
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Edit the `.env` file and replace `YOUR_COMPUTER_LAN_IP` with your actual computer's IP address on the local network.

4. Start the Expo development server:
   ```
   npx expo start --dev-client --lan
   ```

## Testing on Physical Device (Xiaomi)

1. Make sure both your computer and Xiaomi device are on the same Wi-Fi network.

2. Find your computer's IP address:
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your active network connection

3. Update the `.env` file with your computer's IP address:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000
   ```

4. Build a new development APK if you added expo-secure-store:
   ```
   eas build --profile development --platform android
   ```

5. Install the development build on your Xiaomi device.

6. Scan the QR code from Expo or open the app directly.

## Important Notes

- Keep your Xiaomi device on the same Wi-Fi network as your development computer
- Always scan the current QR code - do not use old development-server history entries
- No EAS build is needed for normal TypeScript or UI changes
- The automated launcher handles IP detection and environment configuration automatically

## Troubleshooting

- If you get network errors, check that Windows Firewall allows connections on ports 8000 and 8081
- If authentication fails, verify that the API base URL is correct
- If the app crashes, check the logs with `npx expo logs`
- If using the automated launcher, it will show specific firewall commands if needed