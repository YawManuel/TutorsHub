import { View, Image, Text, StyleSheet } from 'react-native';
import { avatarImages } from '../data/mock';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';

type AvatarStackProps = {
  indices: number[]; // indices into avatarImages
  count: string; // e.g. "+32"
  ringColor?: string;
};

// Overlapping participant photos + a count pill.
export default function AvatarStack({ indices, count, ringColor = colors.card }: AvatarStackProps) {
  return (
    <View style={styles.row}>
      {indices.map((idx, i) => (
        <Image
          key={i}
          source={avatarImages[idx]}
          style={[styles.avatar, { borderColor: ringColor, marginLeft: i === 0 ? 0 : -10 }]}
        />
      ))}
      <View style={styles.countPill}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: '#ddd',
  },
  countPill: {
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 9,
    marginLeft: 7,
  },
  countText: { fontFamily: fonts.nunitoBold, fontSize: 11, color: colors.ink },
});
