import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import Icon from './Icon';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';

// Small hook to drive a transient toast message (auto-dismiss ~2.6s).
export function useToast() {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (m: string) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), 2600);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { message, show };
}

type ToastProps = { message: string; bottom?: number };

// Bottom-centered pill that slides up when a message appears.
export default function Toast({ message, bottom = 104 }: ToastProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    } else {
      anim.setValue(0);
    }
  }, [message, anim]);

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom,
          opacity: anim,
          transform: [
            { translateX: -0.5 },
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
          ],
        },
      ]}
    >
      <Icon name="paid" size={18} color={colors.gold} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0A1A45',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 60,
  },
  text: { fontFamily: fonts.nunitoBold, fontSize: 14, color: colors.white },
});
