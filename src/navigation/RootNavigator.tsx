import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import RoleScreen from '../screens/onboarding/RoleScreen';
import PackageScreen from '../screens/onboarding/PackageScreen';
import CreateAccountScreen from '../screens/onboarding/CreateAccountScreen';
import TabNavigator from './TabNavigator';
import TutorDetailScreen from '../screens/tutors/TutorDetailScreen';
import HelpChatScreen from '../screens/tutors/HelpChatScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { useAuth } from '../context/AuthContext';
import { useNotificationsSync } from '../hooks/useNotifications';
import { colors } from '../theme/tokens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Auth-gated navigation. While the session is being restored we show a spinner;
// signed-out users get the onboarding flow, signed-in users get the tabbed app.
// Switching between the two happens automatically as auth status changes.
export default function RootNavigator() {
  const { status } = useAuth();
  // App-wide live notification badge/feed sync (no-op until signed in).
  useNotificationsSync();

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.appBg }}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {status === 'authed' ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="TutorDetail" component={TutorDetailScreen} />
          <Stack.Screen name="HelpChat" component={HelpChatScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Role" component={RoleScreen} />
          <Stack.Screen name="Package" component={PackageScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
