import { Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

// Pill filter chip: active = filled brand blue, idle = white with border.
export default function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active ? styles.active : styles.idle]}>
      <Text style={[styles.label, { color: active ? colors.white : colors.bodyDark }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  active: { backgroundColor: colors.brand },
  idle: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.dividerAlt },
  label: { fontFamily: fonts.nunitoBold, fontSize: 13 },
});
