import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../components/Icon';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';
import ListState from '../components/ListState';
import { colors, shadows, radius } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { useQuestions } from '../hooks/useQuestions';
import { sessionSize } from '../services/questionsApi';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

export default function QuizScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { grade, gradeLabel, subject, setSlug, setName } = route.params;
  const limit = useMemo(() => sessionSize(setSlug), [setSlug]);

  const {
    data: questions = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuestions({ grade, subject, limit });

  // Quiz progress
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[index];

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    refetch(); // reshuffle
  };

  const onSelect = (key: string) => {
    if (selected) return; // locked once answered
    setSelected(key);
    if (current && key === current.correctAnswer) setScore((s) => s + 1);
  };

  const onNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const header = (
    <View style={styles.header}>
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.headerText}>
        <Text style={styles.headerTitle} numberOfLines={1}>{setName}</Text>
        <Text style={styles.headerSub}>{gradeLabel} · Mathematics</Text>
      </View>
    </View>
  );

  // Loading / error / empty
  if (isLoading || isError || total === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
        {header}
        {isLoading || isError ? (
          <ListState loading={isLoading} error={isError} onRetry={() => refetch()} />
        ) : (
          <View style={styles.emptyWrap}>
            <Icon name="quiz" size={40} color={colors.faint} />
            <Text style={styles.emptyText}>No questions available for {gradeLabel} yet.</Text>
            <PrimaryButton label="Go back" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: 18 }} />
          </View>
        )}
      </View>
    );
  }

  // Summary
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const good = pct >= 50;
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
        {header}
        <ScrollView contentContainerStyle={styles.summaryScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.scoreRing}>
            <Text style={styles.scorePct}>{pct}%</Text>
            <Text style={styles.scoreFrac}>{score} / {total}</Text>
          </View>
          <Text style={styles.summaryTitle}>{good ? 'Well done! 🎉' : 'Keep practising 💪'}</Text>
          <Text style={styles.summarySub}>
            You got {score} of {total} questions right.
          </Text>
          <View style={{ height: 24 }} />
          <PrimaryButton label="Try again" icon="refresh" onPress={restart} />
          <View style={{ height: 12 }} />
          <PrimaryButton label="Done" variant="ghost" onPress={() => navigation.goBack()} />
        </ScrollView>
      </View>
    );
  }

  const answered = selected !== null;
  const progress = total > 0 ? (index + (answered ? 1 : 0)) / total : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {header}

      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Q{index + 1} / {total}</Text>
        <Text style={styles.progressLabel}>Score {score}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!current?.topic && (
          <View style={styles.topicBadge}>
            <Text style={styles.topicText}>{current.curriculum} · {current.topic}</Text>
          </View>
        )}
        <Text style={styles.question}>{current?.question}</Text>

        <View style={styles.options}>
          {current?.options.map((opt) => {
            const isChosen = selected === opt.key;
            const isCorrect = opt.key === current.correctAnswer;
            let state: 'idle' | 'correct' | 'wrong' = 'idle';
            if (answered && isCorrect) state = 'correct';
            else if (answered && isChosen && !isCorrect) state = 'wrong';

            return (
              <Pressable
                key={opt.key}
                disabled={answered}
                onPress={() => onSelect(opt.key)}
                style={[
                  styles.option,
                  state === 'correct' && styles.optionCorrect,
                  state === 'wrong' && styles.optionWrong,
                ]}
              >
                <View
                  style={[
                    styles.optionKey,
                    state === 'correct' && styles.optionKeyCorrect,
                    state === 'wrong' && styles.optionKeyWrong,
                  ]}
                >
                  {state === 'idle' ? (
                    <Text style={styles.optionKeyText}>{opt.key}</Text>
                  ) : (
                    <Icon
                      name={state === 'correct' ? 'check' : 'close'}
                      size={18}
                      color={colors.white}
                    />
                  )}
                </View>
                <Text style={styles.optionText}>{opt.text}</Text>
              </Pressable>
            );
          })}
        </View>

        {answered && (
          <View style={styles.explainCard}>
            <Text style={styles.explainLabel}>
              {selected === current?.correctAnswer ? 'Correct ✓' : `Answer: ${current?.correctAnswer}`}
            </Text>
            <Text style={styles.explainText}>{current?.explanation}</Text>
          </View>
        )}

        <View style={{ height: 12 }} />
        {answered && (
          <PrimaryButton
            label={index + 1 >= total ? 'See results' : 'Next question'}
            icon={index + 1 >= total ? 'flag' : 'arrow_forward'}
            onPress={onNext}
          />
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {isFetching && !isLoading && (
        <View style={styles.reshufflePill}>
          <Text style={styles.reshuffleText}>Loading…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg, paddingHorizontal: 22 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  headerText: { flex: 1 },
  headerTitle: { fontFamily: fonts.jakartaBold, fontSize: 18, color: colors.ink },
  headerSub: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.body, marginTop: 1 },

  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressLabel: { fontFamily: fonts.nunitoBold, fontSize: 12, color: colors.muted },
  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.divider,
    marginTop: 7,
    overflow: 'hidden',
  },
  progressFill: { height: 7, borderRadius: 999, backgroundColor: colors.brand },

  body: { paddingTop: 20, paddingBottom: 12 },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 14,
    ...shadows.cardSoft,
  },
  topicText: { fontFamily: fonts.nunitoBold, fontSize: 11, color: colors.brand, letterSpacing: 0.3 },
  question: { fontFamily: fonts.jakartaBold, fontSize: 20, color: colors.ink, lineHeight: 28 },

  options: { gap: 12, marginTop: 22 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderRadius: radius.cardSm,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadows.cardSoft,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#EAF6F0' },
  optionWrong: { borderColor: colors.error, backgroundColor: '#FCEBF0' },
  optionKey: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionKeyCorrect: { backgroundColor: colors.success },
  optionKeyWrong: { backgroundColor: colors.error },
  optionKeyText: { fontFamily: fonts.jakartaBold, fontSize: 14, color: colors.body },
  optionText: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 15, color: colors.ink, lineHeight: 21 },

  explainCard: {
    marginTop: 20,
    backgroundColor: '#EEF3FC',
    borderRadius: radius.cardSm,
    padding: 16,
  },
  explainLabel: { fontFamily: fonts.jakartaBold, fontSize: 13, color: colors.brand, marginBottom: 5 },
  explainText: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.bodyDark, lineHeight: 21 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 60 },
  emptyText: {
    fontFamily: fonts.nunitoSemibold,
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  summaryScroll: { alignItems: 'center', paddingTop: 40, paddingBottom: 30 },
  scoreRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  scorePct: { fontFamily: fonts.jakartaExtrabold, fontSize: 38, color: colors.ink },
  scoreFrac: { fontFamily: fonts.nunitoBold, fontSize: 14, color: colors.muted, marginTop: 2 },
  summaryTitle: { fontFamily: fonts.jakartaBold, fontSize: 22, color: colors.ink },
  summarySub: {
    fontFamily: fonts.nunitoSemibold,
    fontSize: 15,
    color: colors.body,
    marginTop: 6,
    textAlign: 'center',
  },

  reshufflePill: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  reshuffleText: { fontFamily: fonts.nunitoBold, fontSize: 12, color: colors.white },
});
