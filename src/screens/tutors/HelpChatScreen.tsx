import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import ListState from '../../components/ListState';
import { colors, shadows } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import { useMessages, useHelpChatStream, useSendMessage } from '../../hooks/useHelpChat';
import type { Message } from '../../services/messagesApi';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpChat'>;

export default function HelpChatScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { requestId, tutorName } = route.params;
  const { data: messages = [], isLoading, isError, refetch } = useMessages(requestId);
  const { online, connected } = useHelpChatStream(requestId);
  const send = useSendMessage(requestId);

  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Keep the newest message in view.
  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [messages.length]);

  const onSend = () => {
    const body = draft.trim();
    if (!body || send.isPending) return;
    setDraft('');
    send.mutate(body);
  };

  // The tutor is "present" when someone other than this device is subscribed.
  const tutorOnline = online > 1;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{tutorName}</Text>
          <View style={styles.presenceRow}>
            <View style={[styles.dot, { backgroundColor: tutorOnline ? '#2BA84A' : '#C2CCC6' }]} />
            <Text style={styles.presenceText}>
              {tutorOnline ? 'Online now' : connected ? 'Waiting for tutor…' : 'Connecting…'}
            </Text>
          </View>
        </View>
        <Icon name="support_agent" size={24} color={colors.brand} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 8}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          {isLoading || isError ? (
            <ListState loading={isLoading} error={isError} onRetry={() => refetch()} />
          ) : (
            messages.map((m) => <Bubble key={m.id} message={m} />)
          )}
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            placeholder="Message your tutor…"
            placeholderTextColor={colors.mutedSoft}
            value={draft}
            onChangeText={setDraft}
            multiline
            onSubmitEditing={onSend}
          />
          <Pressable
            style={[styles.sendBtn, (!draft.trim() || send.isPending) && styles.sendBtnOff]}
            onPress={onSend}
            disabled={!draft.trim() || send.isPending}
          >
            <Icon name="send" size={20} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Bubble({ message }: { message: Message }) {
  if (message.senderRole === 'system') {
    return (
      <View style={styles.systemWrap}>
        <Text style={styles.systemText}>{message.body}</Text>
      </View>
    );
  }
  const mine = message.senderRole === 'student';
  return (
    <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
      {!mine && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{message.author.initials}</Text>
        </View>
      )}
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{message.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: { fontFamily: fonts.jakartaBold, fontSize: 18, color: colors.ink },
  presenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  presenceText: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.muted },

  messages: { padding: 18, gap: 12 },

  systemWrap: { alignItems: 'center', marginVertical: 4 },
  systemText: {
    fontFamily: fonts.nunitoSemibold,
    fontSize: 12,
    color: colors.muted,
    backgroundColor: '#E7EEFB',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 999,
    textAlign: 'center',
    overflow: 'hidden',
  },

  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '86%' },
  rowMine: { alignSelf: 'flex-end' },
  rowTheirs: { alignSelf: 'flex-start' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E7EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.jakartaBold, fontSize: 11, color: colors.brand },
  bubble: { borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, ...shadows.cardSoft },
  bubbleMine: { backgroundColor: colors.brand, borderBottomRightRadius: 6 },
  bubbleTheirs: { backgroundColor: colors.card, borderBottomLeftRadius: 6 },
  bubbleText: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.ink, lineHeight: 20 },
  bubbleTextMine: { color: colors.white },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: colors.appBg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 44,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: fonts.nunitoSemibold,
    fontSize: 14,
    color: colors.ink,
    ...shadows.cardSoft,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { opacity: 0.5 },
});
