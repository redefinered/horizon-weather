import { ActivityIndicator, StyleSheet, SafeAreaView, View } from 'react-native';

import {
  FORECAST_DAY_OPTIONS,
  type ForecastDayCount,
} from '../../domain/entities/Weather';
import { FALLBACK_LOCATION_LABEL } from '../../domain/location/LocationProvider';
import { formatDateLabel } from '../../shared/utils/formatting';
import { AppText, LoadingSpinner } from '../components/atoms';
import { DayRangeSelector, UnitToggle } from '../components/molecules';
import {
  CurrentConditions,
  ErrorBanner,
  ForecastSection,
  LocationBanner,
} from '../components/organisms';
import {
  WeatherHeader,
  WeatherScreenTemplate,
} from '../components/templates/WeatherScreenTemplate';
import { useUnitPreference } from '../hooks/useUnitPreference';
import { useWeather } from '../hooks/useWeather';
import { colors, spacing } from '../theme';

export function WeatherScreen() {
  const { unit, isReady, toggleUnit } = useUnitPreference();
  const {
    data,
    status,
    error,
    forecastDays,
    refresh,
    setForecastDays,
  } = useWeather();

  const showInitialLoading = status === 'loading' && !data;
  const showError = status === 'error' && !data;
  const isReloading = status === 'loading' && data !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {isReloading ? (
        <View pointerEvents="none" style={styles.reloadIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : null}
      <WeatherScreenTemplate
        header={<WeatherHeader />}
        controls={
          <View style={styles.controlsRow}>
            <UnitToggle unit={unit} onToggle={() => void toggleUnit()} />
            <DayRangeSelector
              selectedDays={forecastDays}
              options={FORECAST_DAY_OPTIONS}
              onSelect={(days) => setForecastDays(days as ForecastDayCount)}
            />
          </View>
        }
        banner={
          <>
            {data?.usedFallbackLocation ? (
              <LocationBanner
                message={`Location permission denied or unavailable. Showing weather for ${FALLBACK_LOCATION_LABEL}.`}
              />
            ) : null}
            {error && data ? (
              <ErrorBanner
                message={error.message}
                retryable={error.retryable}
                onRetry={() => void refresh()}
              />
            ) : null}
          </>
        }
        content={
          showInitialLoading || !isReady ? (
            <View style={styles.centered}>
              <LoadingSpinner />
              <AppText muted>Loading weather…</AppText>
            </View>
          ) : showError && error ? (
            <ErrorBanner
              message={error.message}
              retryable={error.retryable}
              onRetry={() => void refresh()}
            />
          ) : data ? (
            <View style={[styles.contentStack, isReloading && styles.contentDimmed]}>
              <CurrentConditions
                current={data.current}
                locationLabel={data.locationLabel}
                unit={unit}
              />
              <ForecastSection
                forecast={data.forecast}
                unit={unit}
                formatDate={formatDateLabel}
              />
            </View>
          ) : null
        }
        onRefresh={() => void refresh()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  reloadIndicator: {
    position: 'absolute',
    top: spacing.sm,
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlsRow: {
    gap: spacing.md,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  contentStack: {
    gap: spacing.md,
  },
  contentDimmed: {
    opacity: 0.72,
  },
});
