import { View } from 'react-native';
import Icon from './Icon';
import { colors } from '../theme/tokens';

type StarRatingProps = {
  stars: number; // 0..5 filled
  size?: number;
  color?: string;
  emptyColor?: string;
};

// Five star glyphs: `stars` filled gold, remainder faint.
export default function StarRating({
  stars,
  size = 14,
  color = colors.star,
  emptyColor = '#E2DCCB',
}: StarRatingProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={size} color={i < stars ? color : emptyColor} />
      ))}
    </View>
  );
}
