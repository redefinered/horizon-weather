import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../theme';
import { AppText } from '../atoms';

interface ErrorBannerProps {
  message: string;
  retryable?: boolean;
  onRetry: () => void;
}

export function ErrorBanner({
  message,
  retryable = true,
  onRetry,
}: ErrorBannerProps) {
  return (
    <View style={styles.errorBanner}>
      <AppText style={styles.errorText}>{message}</AppText>
      {retryable ? (
        <AppText accessibilityRole="button" onPress={onRetry} style={styles.retry}>
          Retry
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: colors.errorSurface,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#F5B7B1',
  },
  errorText: {
    color: colors.error,
  },
  retry: {
    color: colors.primary,
    fontWeight: '600',
  },
});
