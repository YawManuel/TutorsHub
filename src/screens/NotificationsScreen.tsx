import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../components/Icon';
import BackButton from '../components/BackButton';
import ListState from '../components/ListState';
import { colors, shadows } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { useNotifications, useMarkRead, useMarkAllRead } from '../hooks/useNotifications';
import type { AppNotification, NotificationType } from '../services/notificationsApi';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const ICON: Record<NotificationType, string> = {
  booking: 'event_available',
  payment: 'paid',
  help: 'support_agent',
  system: 'notifications',
};

const TINT: Record<NotificationType, { bg: string; fg: string }> = {
  booking: { bg: '#E7EEFB', fg: colors.brand },
  payment: { bg: '#FFF4D9', fg: '#C9931F' },
  help: { bg: '#EAF7EE', fg: '#2BA84A' },
  system: { bg: '#EFEAFB', fg: '#6C4CC4' },
};

export default function NotificationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: items = [], isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const hasUnread = items.some((n) => !n.read);

  const onOpen = (n: AppNotification) => {
    if (!n.read) markRead.mutate(n.id);
    // Route to the relevant surface where it's obvious.
    if (n.type === 'booking') navigation.navigate('Main', { screen: 'Home' });
    else if (n.type === 'payment') navigation.navigate('Main', { screen: 'Home' });
    else if (n.type === 'help') navigation.navigate('Main', { screen: 'Tutors' });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Notifications</Text>
        <Pressable
          onPress={() => hasUnread && markAllRead.mutate()}
          hitSlop={8}
          style={styles.markAll}
        >
          <Text style={[styles.markAllText, !hasUnread && styles.markAllOff]}>Mark all read</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {isLoading || isError ? (
          <ListState loading={isLoading} error={isError} onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="notifications_none" size={40} color={colors.faint} />
            <Text style={styles.emptyText}>You’re all caught up.</Text>
          </View>
        ) : (
          items.map((n) => {
            const tint = TINT[n.type];
            return (
              <Pressable
                key={n.id}
                onPress={() => onOpen(n)}
                style={[styles.card, !n.read && styles.cardUnread]}
              >
                <View style={[styles.iconWrap, { backgroundColor: tint.bg }]}>
                  <Icon name={ICON[n.type]} size={22} color={tint.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{n.title}</Text>
                  <Text style={styles.cardBody}>{n.body}</Text>
                </View>
                {!n.read && <View style={styles.unreadDot} />}
              </Pressable>
            );
          })
        )}
      </ScrollView>
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
  },
  title: { flex: 1, fontFamily: fonts.jakartaBold, fontSize: 20, color: colors.ink },
  markAll: { paddingVertical: 4 },
  markAllText: { fontFamily: fonts.jakartaBold, fontSize: 13, color: colors.brand },
  markAllOff: { color: colors.faint },

  list: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 30, gap: 11 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 15,
    ...shadows.cardSoft,
  },
  cardUnread: { backgroundColor: '#F7F9FF' },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.jakartaBold, fontSize: 15, color: colors.ink },
  cardBody: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: colors.body, marginTop: 2, lineHeight: 18 },
  unreadDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.brand },

  empty: { alignItems: 'center', paddingVertical: 70, gap: 12 },
  emptyText: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: colors.muted },
});
