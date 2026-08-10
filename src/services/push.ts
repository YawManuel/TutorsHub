import { notificationsApi } from './notificationsApi';

/**
 * Device push registration — the client seam for Expo push.
 *
 * Registering for real push requires the `expo-notifications` native module
 * (permissions + `getExpoPushTokenAsync`). It is NOT installed yet, so this is a
 * documented seam: once added, complete `getExpoPushToken()` below and call
 * `registerForPush()` after sign-in. The backend endpoints
 * (/notifications/register-token, DELETE /notifications/token) are ready.
 *
 * To finish wiring:
 *   1. `npx expo install expo-notifications`
 *   2. request permissions, then getExpoPushTokenAsync({ projectId })
 *   3. return that token from getExpoPushToken()
 */

async function getExpoPushToken(): Promise<string | null> {
  // Placeholder until expo-notifications is added — see the module doc above.
  // Example:
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   if (status !== 'granted') return null;
  //   const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  //   return data; // 'ExponentPushToken[...]'
  return null;
}

/** Register this device for push, if a token is available. Safe to call always. */
export async function registerForPush(): Promise<void> {
  try {
    const token = await getExpoPushToken();
    if (token) await notificationsApi.registerToken(token);
  } catch {
    /* best-effort — never block sign-in on push registration */
  }
}
