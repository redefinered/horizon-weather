import { StyleSheet, View } from 'react-native';

import type { TemperatureUnit } from '../../../domain/entities/Weather';
import { formatTemperature, formatWindSpeed } from '../../../shared/utils/formatting';
import { spacing } from '../../theme';
import { MetricItem } from './MetricItem';

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

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
