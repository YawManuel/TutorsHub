import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import Toast, { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../hooks/useCatalog';
import { useNextBooking } from '../hooks/useBookings';
import { useWallet, useTopup, useWithdraw } from '../hooks/useWallet';
import { getApiErrorMessage } from '../services/errors';
import { colors, shadows } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { homeFeatures } from '../data/mock';
import type { TabParamList } from '../navigation/types';

// Preset amounts keep the flow one-tap until a full amount entry screen lands.
const TOPUP_AMOUNTS_GHS = [20, 50, 100];
const WITHDRAW_COINS = [100, 200, 500];

type Nav = BottomTabNavigationProp<TabParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();
  const { data: videos = [] } = useVideos();
  const { data: nextBooking } = useNextBooking();
  const { data: wallet } = useWallet();
  const topup = useTopup();
  const withdraw = useWithdraw();
  const { message, show } = useToast();

  const onJoin = () => {
    if (nextBooking?.meetingUrl) Linking.openURL(nextBooking.meetingUrl).catch(() => {});
    else navigation.navigate('Class');
  };

  const firstName = user?.fullName?.split(/\s+/)[0] ?? '';
  const coins = wallet?.balance ?? 0;
  const coinsStr = coins.toLocaleString();
  const coinsGHS = (wallet?.balanceGhs ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  const busy = topup.isPending || withdraw.isPending;

  const onAddCoins = () => {
    if (busy) return;
    Alert.alert('Add TUT Coins', 'Choose an amount to top up.', [
      ...TOPUP_AMOUNTS_GHS.map((amt) => ({
        text: `GHS ${amt}`,
        onPress: () =>
          topup.mutate(amt, {
            onSuccess: (r) =>
              show(
                r.status === 'success'
                  ? `Wallet topped up — balance ${r.balance.toLocaleString()} TK ✓`
                  : 'Payment not completed yet. Try again after paying.',
              ),
            onError: (err) => show(getApiErrorMessage(err)),
          }),
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const onWithdraw = () => {
    if (busy) return;
    const options = WITHDRAW_COINS.filter((c) => c <= coins);
    if (options.length === 0) {
      show('Not enough coins to withdraw yet.');
      return;
    }
    Alert.alert('Withdraw', 'Choose how many coins to withdraw.', [
      ...options.map((c) => ({
        text: `${c.toLocaleString()} TK  ·  GHS ${(c / 2).toFixed(0)}`,
        onPress: () =>
          withdraw.mutate(c, {
            onSuccess: (r) => show(`Withdrawal requested — GHS ${r.withdrawnGhs.toFixed(2)} ✓`),
            onError: (err) => show(getApiErrorMessage(err)),
          }),
      })),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  const onProfile = () => {
    Alert.alert('Account', user?.email ?? '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <TopBar onProfile={onProfile} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.hello}>Akwaaba 👋</Text>
          <Text style={styles.name}>{firstName}</Text>
        </View>

        {/* TUT Coin balance */}
        <View style={styles.block}>
          <LinearGradient
            colors={[colors.brand, colors.navy]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coinCard}
          >
            <View style={styles.coinOrb} />
            <View style={styles.coinTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.coinLabel}>TUT COIN BALANCE</Text>
                <Text style={styles.coinValue}>{coinsStr} TK</Text>
                <Text style={styles.coinGhs}>≈ GHS {coinsGHS}</Text>
              </View>
              <View style={styles.coinIcon}>
                <Icon name="paid" size={30} color={colors.gold} />
              </View>
            </View>
            <View style={styles.coinActions}>
              <Pressable
                style={[styles.coinBtn, styles.coinBtnGold, busy && styles.coinBtnBusy]}
                onPress={onAddCoins}
                disabled={busy}
              >
                <Icon name="add" size={19} color={colors.goldTextAlt} />
                <Text style={styles.coinBtnGoldText}>
                  {topup.isPending ? 'Adding…' : 'Add Coins'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.coinBtn, styles.coinBtnGhost, busy && styles.coinBtnBusy]}
                onPress={onWithdraw}
                disabled={busy}
              >
                <Icon name="north_east" size={19} color={colors.white} />
                <Text style={styles.coinBtnGhostText}>
                  {withdraw.isPending ? 'Withdrawing…' : 'Withdraw'}
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Quick actions */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
          <View style={styles.grid}>
            {homeFeatures.map((f) => (
              <Pressable
                key={f.label}
                style={styles.gridItem}
                onPress={() => navigation.navigate(f.route)}
              >
                <View style={[styles.gridTile, { backgroundColor: f.tint }]}>
                  <Icon name={f.icon} size={26} color={f.fg} />
                </View>
                <Text style={styles.gridLabel}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Upcoming session */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Upcoming session</Text>
          {nextBooking ? (
            <LinearGradient
              colors={['#13234D', '#22356E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.6 }}
              style={styles.upcoming}
            >
              <View style={styles.upcomingOrb} />
              <View style={styles.upcomingAvatar}>
                <Text style={styles.upcomingAvatarText}>{nextBooking.tutor.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.upcomingTitle}>{nextBooking.title}</Text>
                <View style={styles.upcomingWhen}>
                  <Icon name="schedule" size={16} color={colors.gold} />
                  <Text style={styles.upcomingWhenText}>{nextBooking.whenLabel}</Text>
                </View>
              </View>
              <Pressable style={styles.joinBtn} onPress={onJoin}>
                <Text style={styles.joinText}>Join</Text>
              </Pressable>
            </LinearGradient>
          ) : (
            <Pressable
              style={styles.upcomingEmpty}
              onPress={() => navigation.navigate('Tutors')}
            >
              <Icon name="event_available" size={22} color={colors.brand} />
              <Text style={styles.upcomingEmptyText}>
                No upcoming sessions yet — book a tutor to get started.
              </Text>
              <Icon name="chevron_right" size={22} color={colors.faint} />
            </Pressable>
          )}
        </View>

        {/* Watch & learn rail */}
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Watch &amp; learn</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {videos.map((v) => (
              <Pressable
                key={v.title}
                style={styles.videoCard}
                onPress={() => navigation.navigate('Class')}
              >
                <View style={[styles.thumb, { backgroundColor: v.tint }]}>
                  <View style={styles.playCircle}>
                    <Icon name="play_arrow" size={24} color={v.fg} />
                  </View>
                  <View style={styles.lenBadge}>
                    <Text style={styles.lenText}>{v.len}</Text>
                  </View>
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{v.title}</Text>
                <Text style={styles.videoSubj}>{v.subj}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <Toast message={message} bottom={90} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  scroll: { paddingBottom: 24 },
  greeting: { paddingHorizontal: 22, paddingTop: 18 },
  hello: { fontFamily: fonts.nunitoSemibold, fontSize: 14, color: '#7A8A82' },
  name: { fontFamily: fonts.jakartaBold, fontSize: 24, color: colors.ink, marginTop: 1 },

  block: { paddingHorizontal: 22, paddingTop: 24 },
  sectionTitle: { fontFamily: fonts.jakartaBold, fontSize: 18, color: colors.ink },

  // Coin card
  coinCard: { borderRadius: 24, padding: 18, overflow: 'hidden', ...shadows.primaryButton },
  coinOrb: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(244,194,75,0.14)',
  },
  coinTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  coinLabel: { fontFamily: fonts.nunitoBold, fontSize: 12, letterSpacing: 0.4, color: 'rgba(255,255,255,0.75)' },
  coinValue: { fontFamily: fonts.jakartaBold, fontSize: 28, color: colors.white, marginTop: 5 },
  coinGhs: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  coinIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  coinBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  coinBtnGold: { backgroundColor: colors.gold },
  coinBtnGoldText: { fontFamily: fonts.jakartaBold, fontSize: 14, color: colors.goldTextAlt },
  coinBtnGhost: { backgroundColor: 'rgba(255,255,255,0.16)' },
  coinBtnGhostText: { fontFamily: fonts.jakartaBold, fontSize: 14, color: colors.white },
  coinBtnBusy: { opacity: 0.6 },

  // Quick action grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 12 },
  gridItem: {
    width: '31%',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 8,
    ...shadows.cardSoft,
  },
  gridTile: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  gridLabel: { fontFamily: fonts.nunitoBold, fontSize: 12, color: colors.bodyDark, textAlign: 'center' },

  // Upcoming class
  upcoming: {
    borderRadius: 22,
    padding: 17,
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  upcomingOrb: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(244,194,75,0.1)',
  },
  upcomingAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#E7EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingAvatarText: { fontFamily: fonts.jakartaBold, fontSize: 17, color: colors.brand },
  upcomingEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginTop: 13,
    ...shadows.cardSoft,
  },
  upcomingEmptyText: {
    flex: 1,
    fontFamily: fonts.nunitoSemibold,
    fontSize: 13,
    color: colors.body,
    lineHeight: 18,
  },
  upcomingTitle: { fontFamily: fonts.jakartaBold, fontSize: 16, color: colors.white },
  upcomingWhen: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  upcomingWhenText: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  joinBtn: {
    height: 38,
    paddingHorizontal: 16,
    backgroundColor: colors.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: { fontFamily: fonts.jakartaBold, fontSize: 13, color: colors.goldTextAlt },

  // Video rail
  rail: { gap: 13, marginTop: 13, paddingBottom: 4, paddingRight: 22 },
  videoCard: { width: 150 },
  thumb: {
    height: 90,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lenBadge: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  lenText: { fontFamily: fonts.nunitoBold, fontSize: 10, color: colors.white },
  videoTitle: { fontFamily: fonts.nunitoBold, fontSize: 13, color: colors.ink, marginTop: 8, lineHeight: 17 },
  videoSubj: { fontFamily: fonts.nunitoSemibold, fontSize: 12, color: colors.muted, marginTop: 2 },
});
