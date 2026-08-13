import { StyleSheet, View } from 'react-native';

import type { TemperatureUnit } from '../../../domain/entities/Weather';
import { colors, spacing } from '../../theme';
import { AppText } from '../atoms';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <View style={styles.unitToggle}>
      <AppText variant="caption" muted>
        Units
      </AppText>
      <View style={styles.unitButtons}>
        <AppText
          accessibilityRole="button"
          onPress={unit === 'celsius' ? undefined : onToggle}
          style={[styles.unitButton, unit === 'celsius' && styles.unitButtonActive]}
        >
          °C
        </AppText>
        <AppText
          accessibilityRole="button"
          onPress={unit === 'fahrenheit' ? undefined : onToggle}
          style={[styles.unitButton, unit === 'fahrenheit' && styles.unitButtonActive]}
        >
          °F
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unitToggle: {
    gap: spacing.xs,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
