// Font family names as registered by useFonts() in App.tsx.
// Headings/labels -> Plus Jakarta Sans; body/secondary -> Nunito.

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

export const fonts = {
  // Plus Jakarta Sans
  jakarta: 'PlusJakartaSans_400Regular',
  jakartaMedium: 'PlusJakartaSans_500Medium',
  jakartaSemibold: 'PlusJakartaSans_600SemiBold',
  jakartaBold: 'PlusJakartaSans_700Bold',
  jakartaExtrabold: 'PlusJakartaSans_800ExtraBold',

  // Nunito
  nunito: 'Nunito_400Regular',
  nunitoMedium: 'Nunito_500Medium',
  nunitoSemibold: 'Nunito_600SemiBold',
  nunitoBold: 'Nunito_700Bold',
  nunitoExtrabold: 'Nunito_800ExtraBold',
} as const;

// Font map passed to useFonts().
export const fontMap = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
};
