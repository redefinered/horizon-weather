import { FlatList, StyleSheet, View } from 'react-native';

import type { ForecastDay, TemperatureUnit } from '../../../domain/entities/Weather';
import { formatTemperature } from '../../../shared/utils/formatting';
import { colors, radii, spacing } from '../../theme';
import { AppText } from '../atoms';

interface ForecastSectionProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
  formatDate: (isoDate: string) => string;
}

export function ForecastSection({
  forecast,
  unit,
  formatDate,
}: ForecastSectionProps) {
  return (
    <View style={styles.card}>
      <AppText variant="heading">Daily forecast</AppText>
      <FlatList
        data={forecast}
        keyExtractor={(item) => item.date}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <View style={styles.forecastMeta}>
              <AppText variant="metric">{formatDate(item.date)}</AppText>
              <AppText variant="caption" muted>
                {item.conditionLabel}
              </AppText>
            </View>
            <AppText variant="metric">
              {formatTemperature(item.minTemperatureCelsius, unit)} /{' '}
              {formatTemperature(item.maxTemperatureCelsius, unit)}
            </AppText>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  forecastMeta: {
    flex: 1,
    gap: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
