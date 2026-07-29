import { MaterialIcons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

// The design uses Material Symbols Rounded with underscore glyph names.
// @expo/vector-icons' MaterialIcons uses the same glyphs with hyphenated
// names, so we translate `foo_bar` -> `foo-bar`. A few names differ between
// the two sets; remap those explicitly here.
const NAME_OVERRIDES: Record<string, string> = {
  play_circle: 'play-circle-filled',
  co_present: 'co-present',
};

export default function Icon({ name, size = 24, color = '#13234D', style }: IconProps) {
  const mapped = NAME_OVERRIDES[name] ?? name.replace(/_/g, '-');
  return <MaterialIcons name={mapped as never} size={size} color={color} style={style} />;
}
