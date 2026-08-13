import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../../theme';
import { AppText } from '../atoms';

interface LocationBannerProps {
  message: string;
}

export function LocationBanner({ message }: LocationBannerProps) {
  return (
    <View style={styles.locationBanner}>
      <AppText style={styles.locationText}>{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  locationBanner: {
    backgroundColor: colors.warningSurface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#F6E05E',
  },
  locationText: {
    color: colors.warning,
  },
});
