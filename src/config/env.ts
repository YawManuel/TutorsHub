import { Platform } from 'react-native';

/**
 * Runtime configuration for the app.
 *
 * The API base URL comes from the EXPO_PUBLIC_API_URL env var (set it in a
 * `.env` file or the shell before `expo start`). When it's not set we fall back
 * to a sensible dev default per platform:
 *  - Android emulator reaches the host machine via 10.0.2.2
 *  - iOS simulator / web can use localhost
 *
 * For a physical device, set EXPO_PUBLIC_API_URL to your machine's LAN IP,
 * e.g. EXPO_PUBLIC_API_URL=http://192.168.1.20:4000
 */
const devFallback = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? devFallback!;
