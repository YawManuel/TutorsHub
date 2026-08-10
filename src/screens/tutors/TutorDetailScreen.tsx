import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import StarRating from '../../components/StarRating';
import ListState from '../../components/ListState';
import Toast, { useToast } from '../../components/Toast';
import { colors, shadows } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import { useTutor } from '../../hooks/useCatalog';
import { useCreateBooking, useBookings } from '../../hooks/useBookings';
import { useTutorReviews, useCreateReview } from '../../hooks/useReviews';
import { getApiErrorMessage } from '../../services/errors';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TutorDetail'>;

export default function TutorDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const tutorId = route.params.tutorId;
  const { data: tutor, isLoading, isError, refetch } = useTutor(tutorId);
  const { message, show } = useToast();
  const booking = useCreateBooking();
  const { data: reviews = [], isLoading: reviewsLoading } = useTutorReviews(tutorId);
  const { data: myBookings = [] } = useBookings();
  const review = useCreateReview(tutorId);

  const [rateOpen, setRateOpen] = useState(false);
  const [rateStars, setRateStars] = useState(5);
  const [rateComment, setRateComment] = useState('');

  const onBook = () => {
    if (!tutor || booking.isPending) return;
    booking.mutate(
      { tutorId: tutor.id },
      {
        onSuccess: (b) => show(`Session booked with ${tutor.name.split(' ')[0]} · ${b.whenLabel} ✓`),
        onError: (err) => show(getApiErrorMessage(err)),
      },
    );
  };

  const openRate = () => {
    // A review must attach to one of the student's sessions with this tutor.
    const hasBooking = myBookings.some((b) => b.tutor.id === tutorId);
    if (!hasBooking) {
      show('Book a session with this tutor before leaving a review.');
      return;
    }
    setRateStars(5);
    setRateComment('');
    setRateOpen(true);
  };

  const submitRate = () => {
    if (review.isPending) return;
    // Newest booking with this tutor that we can rate.
    const target = [...myBookings].reverse().find((b) => b.tutor.id === tutorId);
    if (!target) {
      setRateOpen(false);
      show('Book a session with this tutor first.');
      return;
    }
    review.mutate(
      { bookingId: target.id, score: rateStars * 20, comment: rateComment.trim() || undefined },
      {
        onSuccess: () => {
          setRateOpen(false);
          show('Thanks — your review was posted ✓');
        },
        onError: (err) => show(getApiErrorMessage(err)),
      },
    );
  };

  // The whole screen is one tutor — show a placeholder until it loads.
  if (!tutor) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 10 }]}>
        <StatusBar style="dark" />
        <View style={{ paddingHorizontal: 22 }}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <ListState
          loading={isLoading}
          error={isError}
          onRetry={() => refetch()}
          errorLabel="Couldn’t load this tutor. Please try again."
        />
      </View>
    );
  }

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

        {/* Reviews */}
        <View style={styles.reviewsHead}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Pressable style={styles.rateBtn} onPress={openRate}>
            <Icon name="rate_review" size={16} color={colors.brand} />
            <Text style={styles.rateBtnText}>Rate session</Text>
          </Pressable>
        </View>
        {reviewsLoading ? (
          <Text style={styles.reviewEmpty}>Loading reviews…</Text>
        ) : reviews.length === 0 ? (
          <Text style={styles.reviewEmpty}>No reviews yet — be the first to rate a session.</Text>
        ) : (
          <View style={styles.reviewList}>
            {reviews.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{r.author.initials}</Text>
                  </View>
                  <Text style={styles.reviewAuthor}>{r.author.name}</Text>
                  <View style={styles.scoreBadge}>
                    <Icon name="star" size={12} color={colors.gold} />
                    <Text style={styles.scoreText}>{r.score}</Text>
                  </View>
                </View>
                {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Rating modal */}
      <Modal visible={rateOpen} transparent animationType="fade" onRequestClose={() => setRateOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setRateOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Rate your session</Text>
            <Text style={styles.modalSub}>with {tutor.name}</Text>

            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRateStars(n)} hitSlop={6}>
                  <Icon name="star" size={38} color={n <= rateStars ? colors.gold : '#D7DED9'} />
                </Pressable>
              ))}
            </View>
            <Text style={styles.scoreHint}>{rateStars * 20} / 100 points</Text>

            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment (optional)"
              placeholderTextColor={colors.mutedSoft}
              value={rateComment}
              onChangeText={setRateComment}
              multiline
              maxLength={1000}
            />

            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setRateOpen(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <PrimaryButton
                label={review.isPending ? 'Posting…' : 'Post review'}
                height={48}
                style={{ flex: 1 }}
                disabled={review.isPending}
                onPress={submitRate}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Text style={styles.footerRate}>GHS {tutor.rate}</Text>
          <Text style={styles.footerPer}>per session</Text>
        </View>
        <PrimaryButton
          label={booking.isPending ? 'Booking…' : 'Book session'}
          height={54}
          style={{ flex: 1 }}
          disabled={booking.isPending}
          onPress={onBook}
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

  // Reviews
  reviewsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  rateBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rateBtnText: { fontFamily: fonts.jakartaBold, fontSize: 13, color: colors.brand },
  reviewEmpty: { fontFamily: fonts.nunitoMedium, fontSize: 13, color: colors.muted, marginTop: 10 },
  reviewList: { gap: 11, marginTop: 12 },
  reviewCard: { backgroundColor: colors.card, borderRadius: 16, padding: 14, ...shadows.cardSoft },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#E7EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: { fontFamily: fonts.jakartaBold, fontSize: 12, color: colors.brand },
  reviewAuthor: { flex: 1, fontFamily: fonts.jakartaBold, fontSize: 14, color: colors.ink },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF4D9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  scoreText: { fontFamily: fonts.nunitoExtrabold, fontSize: 12, color: '#7A5E1C' },
  reviewComment: { fontFamily: fonts.nunitoMedium, fontSize: 13, color: colors.body, lineHeight: 19, marginTop: 8 },

  // Rating modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  modalCard: { backgroundColor: colors.card, borderRadius: 24, padding: 22 },
  modalTitle: { fontFamily: fonts.jakartaBold, fontSize: 20, color: colors.ink },
  modalSub: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.muted, marginTop: 2 },
  starPicker: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 18 },
  scoreHint: {
    fontFamily: fonts.nunitoBold,
    fontSize: 13,
    color: colors.brand,
    textAlign: 'center',
    marginTop: 8,
  },
  commentInput: {
    minHeight: 72,
    backgroundColor: colors.appBg,
    borderRadius: 14,
    padding: 13,
    marginTop: 16,
    fontFamily: fonts.nunitoMedium,
    fontSize: 14,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18 },
  modalCancel: { paddingVertical: 12, paddingHorizontal: 16 },
  modalCancelText: { fontFamily: fonts.jakartaBold, fontSize: 14, color: colors.muted },

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
