import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';

export type SubTab<T extends string> = { key: T; label: string };

type SubTabsProps<T extends string> = {
  tabs: SubTab<T>[];
  active: T;
  onChange: (key: T) => void;
};

// Underline tab row: active = brand blue text + 2.5px bottom border.
export default function SubTabs<T extends string>({ tabs, active, onChange }: SubTabsProps<T>) {
  return (
    <View style={styles.row}>
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.tab, on ? styles.tabOn : styles.tabOff]}
          >
            <Text style={[styles.label, { color: on ? colors.brand : colors.muted }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 26,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.dividerAlt,
    marginTop: 16,
  },
  tab: { paddingBottom: 12, marginBottom: -1.5 },
  tabOn: { borderBottomWidth: 2.5, borderBottomColor: colors.brand },
  tabOff: { borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  label: { fontFamily: fonts.jakartaBold, fontSize: 15 },
});
