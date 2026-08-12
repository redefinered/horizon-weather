import { FlatList, StyleSheet, View } from 'react-native';

import type { CurrentWeather, ForecastDay, TemperatureUnit } from '../../../domain/entities/Weather';
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
