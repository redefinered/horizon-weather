import type { ForecastDayCount, WeatherBundle } from '../../domain/entities/Weather';
import type { LocationProvider } from '../../domain/location/LocationProvider';
import type { WeatherRepository } from '../../domain/repositories/WeatherRepository';
import type { AppError } from '../../shared/errors/AppError';
import { mapToAppError } from '../../shared/errors/AppError';
import type { RequestGuard } from './requestGuard';

export type WeatherFetchResult =
  | { type: 'success'; data: WeatherBundle }
  | { type: 'error'; error: AppError }
  | { type: 'stale' };

interface WeatherFetchDependencies {
  locationProvider: LocationProvider;
  weatherRepository: WeatherRepository;
}

export async function performWeatherFetch(
  id: number,
  guard: RequestGuard,
  forecastDays: ForecastDayCount,
  dependencies: WeatherFetchDependencies,
): Promise<WeatherFetchResult> {
  try {
    const location = await dependencies.locationProvider.getCurrentLocation();
    if (!guard.isLatest(id)) return { type: 'stale' };

    const data = await dependencies.weatherRepository.getWeather({
      coordinates: location.coordinates,
      forecastDays,
      locationLabel: location.label,
      usedFallbackLocation: location.usedFallback,
    });

    if (!guard.isLatest(id)) return { type: 'stale' };

    return { type: 'success', data };
  } catch (caught) {
    if (!guard.isLatest(id)) return { type: 'stale' };
    return { type: 'error', error: mapToAppError(caught) };
  }
}
