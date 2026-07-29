import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from './Icon';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { useAuth, initialsOf } from '../context/AuthContext';

type TopBarProps = {
  onProfile?: () => void;
};

// App top bar: logo + notifications bell (with dot) + avatar.
// Shown on the main tab screens (Home, Class, Tutors, Compete, Group).
export default function TopBar({ onProfile }: TopBarProps) {
  const { user } = useAuth();
  const initials = user ? initialsOf(user.fullName) : '';

  return (
    <View style={styles.bar}>
      <Image
        source={require('../../assets/images/logo-full.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.right}>
        <View style={styles.bell}>
          <Icon name="notifications" size={22} color={colors.ink} />
          <View style={styles.dot} />
        </View>
        <Pressable onPress={onProfile}>
          <LinearGradient
            colors={[colors.brand, colors.navy]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    zIndex: 25,
  },
  logo: { height: 27, width: 140 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#F4F1E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.card,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.white },
});
