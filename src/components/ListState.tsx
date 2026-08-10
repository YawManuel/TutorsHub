import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';

type Props = {
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  errorLabel?: string;
};

/**
 * Compact loading / error placeholder for data-backed lists. Renders nothing
 * once data is available, so screens can drop it in above their content.
 */
export default function ListState({
  loading,
  error,
  onRetry,
  errorLabel = 'Couldn’t load. Check your connection and try again.',
}: Props) {
  if (loading) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.text}>{errorLabel}</Text>
        {onRetry ? (
          <Pressable onPress={onRetry} style={styles.retry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 34, alignItems: 'center', gap: 12 },
  text: {
    fontFamily: fonts.nunitoSemibold,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retry: {
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.brand,
  },
  retryText: { fontFamily: fonts.jakartaBold, fontSize: 13, color: colors.white },
});
