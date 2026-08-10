import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from './Icon';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { useAuth, initialsOf } from '../context/AuthContext';
import { useUnreadCount } from '../hooks/useNotifications';
import type { RootStackParamList } from '../navigation/types';

type TopBarProps = {
  onProfile?: () => void;
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

// App top bar: logo + notifications bell (live unread badge) + avatar.
// Shown on the main tab screens (Home, Class, Tutors, Compete, Group).
export default function TopBar({ onProfile }: TopBarProps) {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const { data: unread = 0 } = useUnreadCount();
  const initials = user ? initialsOf(user.fullName) : '';

  return (
    <View style={styles.bar}>
      <Image
        source={require('../../assets/images/logo-full.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.right}>
        <Pressable style={styles.bell} onPress={() => navigation.navigate('Notifications')}>
          <Icon name="notifications" size={22} color={colors.ink} />
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </Pressable>
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
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.jakartaBold, fontSize: 9, color: colors.navy },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.white },
});
