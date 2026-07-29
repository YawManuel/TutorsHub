import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../../components/TopBar';
import Icon from '../../components/Icon';
import Chip from '../../components/Chip';
import StarRating from '../../components/StarRating';
import SubTabs, { type SubTab } from '../../components/SubTabs';
import PrimaryButton from '../../components/PrimaryButton';
import Toast, { useToast } from '../../components/Toast';
import { colors, shadows } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import { subjects, tutors, helpTutors } from '../../data/mock';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type TutorTab = 'hub' | 'help';
const TABS: SubTab<TutorTab>[] = [
  { key: 'hub', label: 'Hub Tutor' },
  { key: 'help', label: 'Help Tutor' },
];

export default function TutorsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<TutorTab>('hub');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');
  const [question, setQuestion] = useState('');
  const [helpTutor, setHelpTutor] = useState('abena');
  const { message, show } = useToast();

  const filtered = tutors.filter((t) => {
    const bySubject = subject === 'All' || t.subj === subject;
    const byQuery =
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.subj.toLowerCase().includes(query.toLowerCase());
    return bySubject && byQuery;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Tutors</Text>
        <Text style={styles.sub}>Book a session or get on-demand help</Text>

        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === 'hub' ? (
          <>
            <View style={styles.search}>
              <Icon name="search" size={22} color="#9AA8A1" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search subject or tutor name"
                placeholderTextColor="#A6B2AB"
                style={styles.searchInput}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              <Chip label="All" active={subject === 'All'} onPress={() => setSubject('All')} />
              {subjects.map((s) => (
                <Chip key={s.name} label={s.name} active={subject === s.name} onPress={() => setSubject(s.name)} />
              ))}
            </ScrollView>

            <View style={styles.tutorList}>
              {filtered.map((t) => (
                <Pressable
                  key={t.name}
                  style={styles.tutorCard}
                  onPress={() => navigation.navigate('TutorDetail', { tutorName: t.name })}
                >
                  <View style={[styles.tutorTile, { backgroundColor: t.bg }]}>
                    <Text style={[styles.tutorInitials, { color: t.fg }]}>{t.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.tutorName}>{t.name}</Text>
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>{t.rank}</Text>
                      </View>
                    </View>
                    <Text style={styles.tutorSubj}>{t.subj}</Text>
                    <View style={styles.ratingRow}>
                      <StarRating stars={t.stars} size={13} />
                      <Text style={styles.sessText}>· {t.sessions} sessions</Text>
                    </View>
                  </View>
                  <View style={styles.rateWrap}>
                    <Text style={styles.rate}>GHS {t.rate}</Text>
                    <Text style={styles.ratePer}>/ session</Text>
                  </View>
                </Pressable>
              ))}
              {filtered.length === 0 && (
                <Text style={styles.empty}>No tutors match your search.</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoBanner}>
              <Icon name="info" size={22} color={colors.brand} />
              <Text style={styles.infoText}>
                Submit an assignment or essay. Your help tutor reviews via{' '}
                <Text style={styles.infoBold}>Google Classroom</Text>. Each session up to 30 min.
                Max 2 sessions per tutor per day.
              </Text>
            </View>

            <Text style={styles.formLabel}>SUBMISSION</Text>
            <Pressable style={styles.dropdown} onPress={() => show('Subject picker coming soon')}>
              <Text style={styles.dropdownText}>Mathematics — Algebra</Text>
              <Icon name="expand_more" size={22} color="#9AA8A1" />
            </Pressable>

            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder="Describe your question…"
              placeholderTextColor="#A6B2AB"
              multiline
              style={styles.textarea}
            />

            <View style={styles.dropzone}>
              <Icon name="upload" size={28} color="#9AA8A1" />
              <Text style={styles.dropzoneText}>Attach your assignment</Text>
            </View>

            <View style={styles.fileRow}>
              <Icon name="description" size={22} color={colors.brand} />
              <Text style={styles.fileName}>Assignment_Q3.pdf</Text>
              <Icon name="close" size={20} color="#9AA8A1" />
            </View>

            <Text style={styles.formLabel}>CHOOSE A HELP TUTOR</Text>
            <View style={styles.helpList}>
              {helpTutors.map((h) => {
                const on = helpTutor === h.id;
                return (
                  <Pressable
                    key={h.id}
                    onPress={() => setHelpTutor(h.id)}
                    style={[styles.helpCard, on ? styles.helpOn : styles.helpOff]}
                  >
                    <View style={[styles.helpAvatar, { backgroundColor: h.bg }]}>
                      <Text style={[styles.helpInitials, { color: h.fg }]}>{h.initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.helpName}>{h.name}</Text>
                      <Text style={styles.helpMeta}>{h.meta}</Text>
                    </View>
                    <Icon
                      name={on ? 'radio_button_checked' : 'radio_button_unchecked'}
                      size={24}
                      color={on ? colors.navy : '#D7DED9'}
                    />
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              label="Request help session"
              variant="navy"
              onPress={() => show('Help session requested ✓')}
              height={54}
              style={{ marginTop: 20 }}
            />
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
      <Toast message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  scroll: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 24 },
  title: { fontFamily: fonts.jakartaBold, fontSize: 26, color: colors.ink },
  sub: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: '#6B7B74', marginTop: 3 },

  // Hub
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginTop: 16,
    ...shadows.cardSoft,
  },
  searchInput: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.ink },
  chips: { gap: 9, marginTop: 15, paddingBottom: 3, paddingRight: 22 },
  tutorList: { gap: 13, marginTop: 18 },
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 15,
    ...shadows.cardSoft,
  },
  tutorTile: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tutorInitials: { fontFamily: fonts.jakartaBold, fontSize: 18 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap' },
  tutorName: { fontFamily: fonts.jakartaBold, fontSize: 16, color: colors.ink },
  rankBadge: { backgroundColor: '#E7EEFB', paddingVertical: 3, paddingHorizontal: 7, borderRadius: 999 },
  rankText: { fontFamily: fonts.nunitoBold, fontSize: 9, letterSpacing: 0.3, color: colors.navy },
  tutorSubj: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A8A82', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  sessText: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.mutedSoft },
  rateWrap: { alignItems: 'flex-end' },
  rate: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.brand },
  ratePer: { fontFamily: fonts.nunitoSemibold, fontSize: 11, color: colors.mutedSoft },
  empty: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.muted, textAlign: 'center', paddingVertical: 30 },

  // Help
  infoBanner: {
    flexDirection: 'row',
    gap: 11,
    backgroundColor: '#E7EEFB',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },
  infoText: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#27468C', lineHeight: 19 },
  infoBold: { fontFamily: fonts.nunitoExtrabold, color: '#27468C' },
  formLabel: { fontFamily: fonts.nunitoBold, fontSize: 12, letterSpacing: 0.3, color: colors.muted, marginTop: 20 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.dividerAlt,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginTop: 8,
  },
  dropdownText: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.ink },
  textarea: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.dividerAlt,
    borderRadius: 14,
    padding: 15,
    marginTop: 11,
    minHeight: 84,
    fontFamily: fonts.nunitoSemibold,
    fontSize: 14,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C9D3CD',
    borderRadius: 14,
    padding: 22,
    marginTop: 11,
    alignItems: 'center',
    gap: 7,
  },
  dropzoneText: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A8A82' },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#F4EFE3',
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 11,
  },
  fileName: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.ink },
  helpList: { gap: 11, marginTop: 9 },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
  },
  helpOn: { borderColor: colors.brand, backgroundColor: '#EEF2FD' },
  helpOff: { borderColor: colors.dividerAlt, backgroundColor: colors.card },
  helpAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  helpInitials: { fontFamily: fonts.jakartaBold, fontSize: 15 },
  helpName: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.ink },
  helpMeta: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: '#7A8A82', marginTop: 1 },
});
