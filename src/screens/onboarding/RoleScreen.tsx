import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import { colors, radius, shadows } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import { roles } from '../../data/mock';
import type { RoleSlug, RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Role'>;

// Map the prototype's role keys to the backend role slugs.
const ROLE_SLUG: Record<string, RoleSlug> = {
  student: 'student',
  hub: 'hub_tutor',
  help: 'help_tutor',
};

export default function RoleScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Carry the chosen role through to account creation.
  const onPick = (key: string) => {
    const role = ROLE_SLUG[key] ?? 'student';
    navigation.navigate('Package', { role });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Join TutorsHub</Text>
        <Text style={styles.sub}>How would you like to use the app?</Text>

        <View style={styles.list}>
          {roles.map((r) => (
            <Pressable key={r.key} style={styles.card} onPress={() => onPick(r.key)}>
              <View style={[styles.tile, { backgroundColor: r.tint }]}>
                <Icon name={r.icon} size={30} color={r.fg} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{r.title}</Text>
                <Text style={styles.cardDesc}>{r.desc}</Text>
              </View>
              <Icon name="chevron_right" size={24} color={colors.faint} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  content: { paddingHorizontal: 22, paddingBottom: 30 },
  title: { fontFamily: fonts.jakartaBold, fontSize: 27, color: colors.ink, marginTop: 22 },
  sub: { fontFamily: fonts.nunitoSemibold, fontSize: 15, color: '#6B7B74', marginTop: 6 },
  list: { marginTop: 24, gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    ...shadows.cardSoft,
  },
  tile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: { fontFamily: fonts.jakartaBold, fontSize: 18, color: colors.ink },
  cardDesc: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A8A82', marginTop: 3, lineHeight: 18 },
});
