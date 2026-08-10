import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

// Scattered translucent academic glyphs behind the hero.
const DECOR: {
  name: string;
  size: number;
  color: string;
  pos: { top?: number; bottom?: number; left?: number; right?: number };
  rotate: number;
}[] = [
  { name: 'school', size: 38, color: 'rgba(244,194,75,0.22)', pos: { top: 60, left: 24 }, rotate: -12 },
  { name: 'functions', size: 30, color: 'rgba(255,255,255,0.12)', pos: { top: 120, right: 26 }, rotate: 10 },
  { name: 'science', size: 26, color: 'rgba(255,255,255,0.12)', pos: { top: 230, left: 30 }, rotate: 8 },
  { name: 'menu_book', size: 30, color: 'rgba(244,194,75,0.18)', pos: { top: 200, right: 34 }, rotate: -8 },
  { name: 'edit', size: 24, color: 'rgba(244,194,75,0.16)', pos: { bottom: 250, left: 40 }, rotate: 14 },
  { name: 'calculate', size: 26, color: 'rgba(255,255,255,0.10)', pos: { bottom: 300, right: 28 }, rotate: -14 },
];

export default function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const start = () => navigation.navigate('Role');

  return (
    <LinearGradient
      colors={[colors.teal1, colors.teal2, colors.teal3]}
      locations={[0, 0.58, 1]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.root}
    >
      {DECOR.map((d, i) => (
        <Icon
          key={i}
          name={d.name}
          size={d.size}
          color={d.color}
          style={[styles.decor, d.pos, { transform: [{ rotate: `${d.rotate}deg` }] }]}
        />
      ))}

      <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
        <View style={styles.hero}>
          <Image
            source={require('../../../assets/images/logo-full.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Student inside a gold radial orb with floating chips */}
          <View style={styles.orbWrap}>
            <LinearGradient
              colors={['#F7CF63', '#E5A52B']}
              start={{ x: 0.5, y: 0.1 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.orb}
            />
            <View style={styles.orbRing} />

            <View style={[styles.chip, styles.chipTop]}>
              <Icon name="emoji_events" size={18} color={colors.teal1} />
              <Text style={styles.chipTextDark}>+5 pts</Text>
            </View>
            <View style={[styles.chip, styles.chipBottom]}>
              <Icon name="menu_book" size={18} color={colors.gold} />
              <Text style={styles.chipTextLight}>Live class</Text>
            </View>

            <Image
              source={require('../../../assets/images/onboard-student.png')}
              style={styles.student}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.headline}>Learn together.{'\n'}Practice smarter.</Text>
          <Text style={styles.sub}>
            Tutoring, practice rooms, challenges and rewards — all in one app.
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Get Started" variant="gold" onPress={start} />
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.textBtn}>
            <Text style={styles.textBtnLabel}>I already have an account</Text>
          </Pressable>
          <Text style={styles.url}>www.tutorshubgh.com</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  decor: { position: 'absolute' },
  content: { flex: 1, paddingHorizontal: 30, paddingBottom: 36 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 172, height: 44, tintColor: colors.white },
  orbWrap: {
    width: 268,
    height: 268,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  orb: {
    position: 'absolute',
    bottom: 0,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  orbRing: {
    position: 'absolute',
    bottom: 0,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  chip: {
    position: 'absolute',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 13,
    paddingVertical: 7,
    paddingHorizontal: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  chipTop: { top: 10, right: 30, backgroundColor: colors.white },
  chipBottom: { bottom: 54, left: 14, backgroundColor: colors.teal1 },
  chipTextDark: { fontFamily: fonts.nunitoBold, fontSize: 12, color: colors.teal1 },
  chipTextLight: { fontFamily: fonts.nunitoBold, fontSize: 12, color: colors.white },
  student: { position: 'relative', zIndex: 2, height: 266, width: 220 },
  headline: {
    fontFamily: fonts.jakartaExtrabold,
    fontSize: 23,
    color: colors.white,
    marginTop: 14,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 29,
  },
  sub: {
    fontFamily: fonts.nunitoSemibold,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 9,
    maxWidth: 262,
    textAlign: 'center',
    lineHeight: 21,
  },
  footer: { width: '100%' },
  textBtn: { height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  textBtnLabel: { fontFamily: fonts.nunitoSemibold, fontSize: 15, color: 'rgba(255,255,255,0.85)' },
  url: {
    textAlign: 'center',
    fontFamily: fonts.nunitoSemibold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
});
