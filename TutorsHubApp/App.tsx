import { useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { fontMap } from './src/theme/typography';
import { colors } from './src/theme/tokens';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

// Keep the native splash up until fonts are ready.
SplashScreen.preventAutoHideAsync().catch(() => {});

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.appBg },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ ...fontMap, ...MaterialIcons.font });

  const onLayout = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SafeAreaProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
