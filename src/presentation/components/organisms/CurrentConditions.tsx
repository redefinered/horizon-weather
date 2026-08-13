import { StyleSheet, View } from 'react-native';

import type { CurrentWeather, TemperatureUnit } from '../../../domain/entities/Weather';
import { formatTemperature } from '../../../shared/utils/formatting';
import { colors, radii, spacing } from '../../theme';
import { AppText, TemperatureText } from '../atoms';
import { MetricRow } from '../molecules';

interface CurrentConditionsProps {
  current: CurrentWeather;
  locationLabel: string;
  unit: TemperatureUnit;
}

export function CurrentConditions({
  current,
  locationLabel,
  unit,
}: CurrentConditionsProps) {
  return (
    <View style={styles.card}>
      <AppText variant="caption" muted>
        {locationLabel}
      </AppText>
      <TemperatureText value={formatTemperature(current.temperatureCelsius, unit)} />
      <AppText variant="heading">{current.conditionLabel}</AppText>
      <MetricRow
        humidityPercent={current.humidityPercent}
        windSpeedKmh={current.windSpeedKmh}
        apparentTemperatureCelsius={current.apparentTemperatureCelsius}
        unit={unit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
