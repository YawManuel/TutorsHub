import { Pressable, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Icon from './Icon';
import { colors, radius, shadows } from '../theme/tokens';
import { fonts } from '../theme/typography';

type Variant = 'blue' | 'gold' | 'navy' | 'ghost';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const VARIANTS: Record<
  Variant,
  { bg: string; fg: string; border?: string; shadow?: object }
> = {
  blue: { bg: colors.brand, fg: colors.white, shadow: shadows.primaryButton },
  gold: { bg: colors.gold, fg: colors.goldText, shadow: shadows.goldButton },
  navy: { bg: colors.navy, fg: colors.white, shadow: shadows.primaryButton },
  ghost: { bg: colors.card, fg: colors.ink, border: colors.dividerAlt },
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'blue',
  icon,
  height = 56,
  style,
  disabled = false,
}: PrimaryButtonProps) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { height, backgroundColor: v.bg, borderColor: v.border ?? 'transparent' },
        v.border ? styles.bordered : v.shadow,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={20} color={v.fg} style={{ marginRight: 8 }} /> : null}
      <Text style={[styles.label, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  bordered: { borderWidth: 1.5 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.55 },
  label: { fontFamily: fonts.jakartaBold, fontSize: 17 },
});
