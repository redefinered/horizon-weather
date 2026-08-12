import { StyleSheet, View } from 'react-native';

import type { TemperatureUnit } from '../../../domain/entities/Weather';
import { formatTemperature, formatWindSpeed } from '../../../shared/utils/formatting';
import { colors, spacing } from '../../theme';
import { AppText } from '../atoms';

interface MetricItemProps {
  label: string;
  value: string;
}

export function MetricItem({ label, value }: MetricItemProps) {
  return (
    <View style={styles.metricItem}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="metric">{value}</AppText>
    </View>
  );
}

interface MetricRowProps {
  humidityPercent: number;
  windSpeedKmh: number;
  apparentTemperatureCelsius: number;
  unit: TemperatureUnit;
}

export function MetricRow({
  humidityPercent,
  windSpeedKmh,
  apparentTemperatureCelsius,
  unit,
}: MetricRowProps) {
  return (
    <View style={styles.metricRow}>
      <MetricItem label="Feels like" value={formatTemperature(apparentTemperatureCelsius, unit)} />
      <MetricItem label="Humidity" value={`${Math.round(humidityPercent)}%`} />
      <MetricItem label="Wind" value={formatWindSpeed(windSpeedKmh, unit)} />
    </View>
  );
}

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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metricItem: {
    flex: 1,
    gap: spacing.xs,
  },
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
