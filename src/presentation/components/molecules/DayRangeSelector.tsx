import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme';
import { AppText } from '../atoms';

interface DayRangeSelectorProps {
  selectedDays: number;
  options: readonly number[];
  onSelect: (days: number) => void;
}

export function DayRangeSelector({
  selectedDays,
  options,
  onSelect,
}: DayRangeSelectorProps) {
  return (
    <View style={styles.daySelector}>
      <AppText variant="caption" muted>
        Forecast days
      </AppText>
      <View style={styles.dayOptions}>
        {options.map((days) => (
          <AppText
            key={days}
            accessibilityRole="button"
            onPress={() => onSelect(days)}
            style={[
              styles.dayOption,
              selectedDays === days && styles.dayOptionActive,
            ]}
          >
            {days}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  daySelector: {
    gap: spacing.xs,
  },
  dayOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dayOption: {
    minWidth: 36,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dayOptionActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
