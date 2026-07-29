import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import Icon from '../components/Icon';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';
import type { TabParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import ClassScreen from '../screens/ClassScreen';
import TutorsScreen from '../screens/tutors/TutorsScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// Icon + label per tab, matching the prototype's bottom nav.
const TAB_META: Record<
  keyof TabParamList,
  { icon: string; label: string }
> = {
  Home: { icon: 'home', label: 'Home' },
  Class: { icon: 'co_present', label: 'Class' },
  Tutors: { icon: 'school', label: 'Tutors' },
  Compete: { icon: 'emoji_events', label: 'Compete' },
  Group: { icon: 'groups', label: 'Group' },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name as keyof TabParamList];
        const color = focused ? colors.brand : '#9AA8A1';
        return (
          <Pressable
            key={route.key}
            style={styles.item}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          >
            <Icon name={meta.icon} size={25} color={color} />
            <Text style={[styles.label, { color }]}>{meta.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Class" component={ClassScreen} />
      <Tab.Screen name="Tutors" component={TutorsScreen} />
      <Tab.Screen name="Compete" component={PlaceholderScreen} />
      <Tab.Screen name="Group" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 11,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontFamily: fonts.nunitoBold, fontSize: 10 },
});
