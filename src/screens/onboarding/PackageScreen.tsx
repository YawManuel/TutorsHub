import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import ListState from '../../components/ListState';
import { colors } from '../../theme/tokens';
import { fonts } from '../../theme/typography';
import { usePackages } from '../../hooks/useCatalog';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Package'>;

export default function PackageScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>('combo');
  const role = route.params?.role ?? 'student';
  const { data: packages = [], isLoading, isError, refetch } = usePackages();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Choose your plan</Text>
        <Text style={styles.sub}>Billed monthly in GHS. Cancel anytime.</Text>

        <ListState loading={isLoading} error={isError} onRetry={() => refetch()} />

        <View style={styles.list}>
          {packages.map((p) => {
            const sel = selected === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelected(p.id)}
                style={[styles.card, sel ? styles.cardSelected : styles.cardIdle]}
              >
                <View style={styles.cardHead}>
                  <View style={styles.nameRow}>
                    <Text style={styles.planName}>{p.name}</Text>
                    {p.popular ? (
                      <View style={styles.popular}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    ) : null}
                  </View>
                  <Icon
                    name={sel ? 'check_circle' : 'radio_button_unchecked'}
                    size={24}
                    color={sel ? colors.brand : '#D7DED9'}
                  />
                </View>
                <Text style={styles.planDesc}>{p.desc}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>GHS {p.price}</Text>
                  <Text style={styles.per}>/ month</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.feats}>
                  {p.feats.map((f) => (
                    <View key={f} style={styles.featRow}>
                      <Icon name="check_circle" size={18} color={colors.brand} />
                      <Text style={styles.featText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sibling}>
          <Icon name="family_restroom" size={22} color="#C9931F" />
          <Text style={styles.siblingText}>
            <Text style={styles.siblingBold}>Sibling offer: </Text>
            up to 3 siblings taking the same subjects get a discount on any plan above.
          </Text>
        </View>

        <PrimaryButton
          label="Continue"
          onPress={() => navigation.navigate('CreateAccount', { role })}
          style={{ marginTop: 18 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  content: { paddingHorizontal: 22, paddingBottom: 30 },
  title: { fontFamily: fonts.jakartaBold, fontSize: 27, color: colors.ink, marginTop: 22 },
  sub: { fontFamily: fonts.nunitoSemibold, fontSize: 15, color: '#6B7B74', marginTop: 6 },
  list: { marginTop: 22, gap: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
  },
  cardIdle: { borderColor: colors.dividerAlt },
  cardSelected: { borderColor: colors.brand, backgroundColor: '#F7F9FF' },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' },
  planName: { fontFamily: fonts.jakartaBold, fontSize: 19, color: colors.ink },
  popular: { backgroundColor: colors.gold, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999 },
  popularText: { fontFamily: fonts.nunitoBold, fontSize: 10, letterSpacing: 0.5, color: colors.navy },
  planDesc: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A8A82', marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 },
  price: { fontFamily: fonts.jakartaBold, fontSize: 26, color: colors.brand },
  per: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: colors.muted },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 13 },
  feats: { gap: 8 },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  featText: { fontFamily: fonts.nunitoSemibold, fontSize: 13, color: colors.bodyDark },
  sibling: {
    flexDirection: 'row',
    gap: 11,
    backgroundColor: '#FFF4D9',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },
  siblingText: { flex: 1, fontFamily: fonts.nunitoSemibold, fontSize: 13, color: '#7A5E1C', lineHeight: 19 },
  siblingBold: { fontFamily: fonts.nunitoExtrabold, color: '#7A5E1C' },
});
