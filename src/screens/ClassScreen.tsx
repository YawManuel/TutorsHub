import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import Chip from '../components/Chip';
import SubTabs, { type SubTab } from '../components/SubTabs';
import AvatarStack from '../components/AvatarStack';
import ListState from '../components/ListState';
import Toast, { useToast } from '../components/Toast';
import { colors, shadows } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { classFilters } from '../data/mock';
import { useClasses, usePracticeSets, useVideos } from '../hooks/useCatalog';
import { useEnrollClass, useMyClasses } from '../hooks/useBookings';
import { getApiErrorMessage } from '../services/errors';
import { GRADE_LEVELS, gradeLabel } from '../services/questionsApi';
import type { ClassItem } from '../services/catalogApi';
import type { RootStackParamList } from '../navigation/types';

type ClassTab = 'classes' | 'practice' | 'tutorials';
const TABS: SubTab<ClassTab>[] = [
  { key: 'classes', label: 'Class' },
  { key: 'practice', label: 'Practice' },
  { key: 'tutorials', label: 'Tutorials' },
];

export default function ClassScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<ClassTab>('classes');
  const [filter, setFilter] = useState(classFilters[0]);
  const [grade, setGrade] = useState('grade4');
  const [gradeModal, setGradeModal] = useState(false);
  const { message, show } = useToast();

  const showMine = filter === 'My classes';
  const classesQ = useClasses();
  const myClassesQ = useMyClasses(showMine);
  const practiceQ = usePracticeSets();
  const videosQ = useVideos();
  const enroll = useEnrollClass();

  const classListQ = showMine ? myClassesQ : classesQ;
  const displayedClasses = classListQ.data ?? [];
  const practiceSets = practiceQ.data ?? [];
  const videos = videosQ.data ?? [];

  const onEnroll = (c: ClassItem) => {
    if (enroll.isPending) return;
    enroll.mutate(c.id, {
      onSuccess: (r) =>
        show(r.alreadyEnrolled ? `You’re already in ${c.title}` : `Joined ${c.title} ✓`),
      onError: (err) => show(getApiErrorMessage(err)),
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Class</Text>
        <Text style={styles.sub}>Live classes, practice &amp; tutorials</Text>

        <SubTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === 'classes' && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {classFilters.map((f) => (
                <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
              ))}
            </ScrollView>

            <ListState
              loading={classListQ.isLoading}
              error={classListQ.isError}
              onRetry={() => classListQ.refetch()}
            />

            {showMine && !classListQ.isLoading && !classListQ.isError && displayedClasses.length === 0 && (
              <Text style={styles.emptyClasses}>
                You haven’t joined any classes yet.
              </Text>
            )}

            <View style={styles.classList}>
              {displayedClasses.map((c) => (
                <Pressable
                  key={c.id}
                  style={[styles.classCard, { backgroundColor: c.tint }]}
                  onPress={() => onEnroll(c)}
                >
                  <View style={styles.classTop}>
                    <View style={{ flex: 1 }}>
                      {c.live && (
                        <View style={styles.liveBadge}>
                          <View style={styles.liveDot} />
                          <Text style={styles.liveText}>LIVE NOW</Text>
                        </View>
                      )}
                      <Text style={styles.classTitle}>{c.title} Class</Text>
                      <View style={styles.metaRow}>
                        <Icon name="schedule" size={17} color="#6B7B74" />
                        <Text style={styles.metaText}>{c.time} · {c.dur}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Icon name="school" size={17} color="#6B7B74" />
                        <Text style={styles.metaText}>{c.level}</Text>
                      </View>
                      <Text style={styles.price}>{c.price}</Text>
                    </View>
                    <View style={styles.classIcon}>
                      <Icon name={c.icon} size={36} color={c.ill} />
                    </View>
                  </View>
                  <View style={styles.classBottom}>
                    <AvatarStack indices={c.av} count={c.count} ringColor={c.tint} />
                    <View style={styles.arrowBtn}>
                      <Icon name="arrow_outward" size={22} color={colors.white} />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {tab === 'practice' && (
          <>
            <View style={styles.subjectSelector}>
              <View style={styles.subjectLeft}>
                <View style={styles.subjectTile}>
                  <Icon name="functions" size={22} color={colors.brand} />
                </View>
                <View>
                  <Text style={styles.subjectLabel}>SUBJECT</Text>
                  <Text style={styles.subjectName}>Mathematics</Text>
                </View>
              </View>
              <Icon name="expand_more" size={24} color={colors.faint} />
            </View>

            <Pressable style={styles.gradeSelector} onPress={() => setGradeModal(true)}>
              <View style={styles.subjectLeft}>
                <View style={styles.gradeTile}>
                  <Icon name="school" size={22} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.subjectLabel}>GRADE LEVEL</Text>
                  <Text style={styles.subjectName}>{gradeLabel(grade)}</Text>
                </View>
              </View>
              <Icon name="expand_more" size={24} color={colors.faint} />
            </Pressable>

            <ListState
              loading={practiceQ.isLoading}
              error={practiceQ.isError}
              onRetry={() => practiceQ.refetch()}
            />

            <View style={styles.practiceGrid}>
              {practiceSets.map((ps) => (
                <Pressable
                  key={ps.id}
                  style={styles.practiceCard}
                  onPress={() =>
                    navigation.navigate('Practice', {
                      grade,
                      gradeLabel: gradeLabel(grade),
                      subject: 'mathematics',
                      setSlug: ps.slug,
                      setName: ps.name,
                    })
                  }
                >
                  <View style={[styles.practiceTile, { backgroundColor: ps.tint }]}>
                    <Icon name={ps.icon} size={24} color={ps.fg} />
                  </View>
                  <Text style={styles.practiceName}>{ps.name}</Text>
                  <Text style={styles.practiceCount}>{ps.count}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {tab === 'tutorials' && (
          <View style={styles.tutorialList}>
            <ListState
              loading={videosQ.isLoading}
              error={videosQ.isError}
              onRetry={() => videosQ.refetch()}
            />
            {videos.map((v) => (
              <Pressable
                key={v.id}
                style={styles.tutorialCard}
                onPress={() => show(`Opening “${v.title}”…`)}
              >
                <View style={[styles.tutorialThumb, { backgroundColor: v.tint }]}>
                  <View style={styles.playCircle}>
                    <Icon name="play_arrow" size={22} color={v.fg} />
                  </View>
                  <View style={styles.lenBadge}>
                    <Text style={styles.lenText}>{v.len}</Text>
                  </View>
                </View>
                <View style={styles.tutorialText}>
                  <Text style={[styles.tutorialTag, { color: v.fg }]}>{v.tag}</Text>
                  <Text style={styles.tutorialTitle} numberOfLines={2}>{v.title}</Text>
                  <Text style={styles.tutorialSubj}>{v.subj}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal
        visible={gradeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setGradeModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setGradeModal(false)}>
          <Pressable style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choose grade level</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {GRADE_LEVELS.map((g) => {
                const active = g.value === grade;
                return (
                  <Pressable
                    key={g.value}
                    style={[styles.gradeRow, active && styles.gradeRowActive]}
                    onPress={() => {
                      setGrade(g.value);
                      setGradeModal(false);
                    }}
                  >
                    <Text style={[styles.gradeRowText, active && styles.gradeRowTextActive]}>
                      {g.label}
                    </Text>
                    {active && <Icon name="check" size={20} color={colors.brand} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Toast message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  scroll: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 24 },
  title: { fontFamily: fonts.jakartaBold, fontSize: 26, color: colors.ink },
  sub: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: '#6B7B74', marginTop: 3 },
  chips: { gap: 9, marginTop: 16, paddingBottom: 3, paddingRight: 22 },

  // Class cards
  emptyClasses: {
    fontFamily: fonts.nunitoSemibold,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 26,
  },
  classList: { gap: 16, marginTop: 18 },
  classCard: { borderRadius: 24, padding: 18, ...shadows.card },
  classTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: colors.error,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 999,
    marginBottom: 9,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  liveText: { fontFamily: fonts.nunitoBold, fontSize: 9, letterSpacing: 0.4, color: colors.white },
  classTitle: { fontFamily: fonts.jakartaBold, fontSize: 18, color: colors.ink, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaText: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.body },
  price: { fontFamily: fonts.jakartaBold, fontSize: 19, color: colors.ink, marginTop: 12 },
  classIcon: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardSoft,
  },
  classBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  arrowBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Practice
  subjectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 18,
    ...shadows.cardSoft,
  },
  subjectLeft: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  subjectTile: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#E7EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectLabel: { fontFamily: fonts.nunitoBold, fontSize: 11, color: colors.muted },
  subjectName: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.ink },
  gradeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 12,
    ...shadows.cardSoft,
  },
  gradeTile: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#E7F4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  practiceCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    ...shadows.cardSoft,
  },
  practiceTile: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  practiceName: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.ink, marginTop: 11 },
  practiceCount: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.muted, marginTop: 2 },

  // Grade picker modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,30,82,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  modalTitle: { fontFamily: fonts.jakartaBold, fontSize: 18, color: colors.ink, marginBottom: 12 },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  gradeRowActive: { backgroundColor: '#EEF3FC' },
  gradeRowText: { fontFamily: fonts.nunitoSemibold, fontSize: 16, color: colors.body },
  gradeRowTextActive: { fontFamily: fonts.jakartaBold, color: colors.brand },

  // Tutorials
  tutorialList: { gap: 14, marginTop: 18 },
  tutorialCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 12,
    ...shadows.cardSoft,
  },
  tutorialThumb: {
    width: 104,
    height: 74,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lenBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  lenText: { fontFamily: fonts.nunitoBold, fontSize: 9, color: colors.white },
  tutorialText: { flex: 1, justifyContent: 'center' },
  tutorialTag: { fontFamily: fonts.nunitoBold, fontSize: 9, letterSpacing: 0.4 },
  tutorialTitle: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.ink, marginTop: 4, lineHeight: 19 },
  tutorialSubj: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.muted, marginTop: 3 },
});
