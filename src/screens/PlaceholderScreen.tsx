import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';

// Stub for the not-yet-built tabs (Class, Tutors, Compete, Group).
// Keeps the tab bar and navigation flow working end-to-end.
export default function PlaceholderScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar />
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="construction" size={34} color={colors.brand} />
        </View>
        <Text style={styles.title}>{route.name}</Text>
        <Text style={styles.sub}>This screen is coming next in the build.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 30 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#E7EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.jakartaBold, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.secondary, textAlign: 'center' },
});
