import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Icon from './Icon';
import { colors, shadows } from '../theme/tokens';

type BackButtonProps = {
  onPress?: () => void;
  tint?: 'light' | 'dark'; // dark = white pill (default), light = translucent on color header
  style?: StyleProp<ViewStyle>;
};

// Rounded 42x42 back button used across onboarding + detail screens.
export default function BackButton({ onPress, tint = 'dark', style }: BackButtonProps) {
  const onColor = tint === 'light';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.btn,
        onColor
          ? { backgroundColor: 'rgba(255,255,255,0.16)' }
          : [{ backgroundColor: colors.card }, styles.shadow],
        style,
      ]}
    >
      <Icon name="arrow_back" size={24} color={onColor ? colors.white : '#1C2B26'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#182E68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
});
