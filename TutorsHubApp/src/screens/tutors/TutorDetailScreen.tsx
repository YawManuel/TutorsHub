import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import StarRating from '../../components/StarRating';
import Toast, { useToast } from '../../components/Toast';
import { colors, shadows } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import { getTutor } from '../../data/mock';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TutorDetail'>;

export default function TutorDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const tutor = getTutor(route.params.tutorName);
  const { message, show } = useToast();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Blue header */}
      <LinearGradient
        colors={['#1C56C9', '#143A8F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 6 }]}
      >
        <View style={styles.headerOrb} />
        <BackButton tint="light" onPress={() => navigation.goBack()} />
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: tutor.fg }]}>{tutor.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{tutor.name}</Text>
            <Text style={styles.subj}>{tutor.subj} Tutor</Text>
            <View style={{ marginTop: 5 }}>
              <StarRating stars={tutor.stars} size={14} color={colors.gold} emptyColor="rgba(255,255,255,0.3)" />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        <View style={styles.stats}>
          <Stat value={String(tutor.sessions)} label="Sessions" />
          <Stat value={tutor.rank} label="Ranking" />
          <Stat value="~90m" label="Per session" />
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.about}>{tutor.bio}</Text>

        <View style={styles.classroomBanner}>
          <Icon name="videocam" size={22} color={colors.brand} />
          <Text style={styles.classroomText}>
            Sessions run on <Text style={styles.classroomBold}>Google Classroom (Hangout)</Text> linked
            to the app — 60 to 90 minutes each. Rate your tutor 20–100 points afterwards.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Text style={styles.footerRate}>GHS {tutor.rate}</Text>
          <Text style={styles.footerPer}>per session</Text>
        </View>
        <PrimaryButton
          label="Book session"
          height={54}
          style={{ flex: 1 }}
          onPress={() => show(`Session booked with ${tutor.name.split(' ')[0]} ✓`)}
        />
      </View>

      <Toast message={message} bottom={100} />
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 26,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerOrb: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(244,194,75,0.12)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 16 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.jakartaBold, fontSize: 24 },
  name: { fontFamily: fonts.jakartaBold, fontSize: 23, color: colors.white },
  subj: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  body: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 30 },
  stats: { flexDirection: 'row', gap: 11 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    ...shadows.cardSoft,
  },
  statValue: { fontFamily: fonts.jakartaBold, fontSize: 19, color: colors.ink },
  statLabel: { fontFamily: fonts.nunitoSemibold, fontSize: 11, color: colors.muted, marginTop: 2 },
  sectionTitle: { fontFamily: fonts.jakartaBold, fontSize: 16, color: colors.ink, marginTop: 22 },
  about: { fontFamily: fonts.nunitoMedium, fontSize: 14, color: colors.body, lineHeight: 22, marginTop: 7 },
  classroomBanner: {
    flexDirection: 'row',
    gap: 11,
    backgroundColor: '#E7EEFB',
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
  },
  classroomText: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#27468C', lineHeight: 19 },
  classroomBold: { fontFamily: fonts.nunitoExtrabold, color: '#27468C' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingTop: 14,
    backgroundColor: colors.appBg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerRate: { fontFamily: fonts.jakartaBold, fontSize: 20, color: colors.brand },
  footerPer: { fontFamily: fonts.nunitoSemibold, fontSize: 11, color: colors.mutedSoft },
});
