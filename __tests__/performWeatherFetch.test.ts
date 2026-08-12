import type { WeatherBundle } from '../src/domain/entities/Weather';
import type { LocationResult } from '../src/domain/location/LocationProvider';
import { performWeatherFetch } from '../src/presentation/hooks/performWeatherFetch';
import { createRequestGuard } from '../src/presentation/hooks/requestGuard';

const sampleBundle: WeatherBundle = {
  current: {
    temperatureCelsius: 28,
    apparentTemperatureCelsius: 30,
    humidityPercent: 70,
    windSpeedKmh: 12,
    conditionLabel: 'Partly cloudy',
    weatherCode: 2,
  },
  forecast: [
    {
      date: '2026-08-12',
      minTemperatureCelsius: 24,
      maxTemperatureCelsius: 30,
      conditionLabel: 'Partly cloudy',
      weatherCode: 2,
    },
  ],
  locationLabel: 'Manila, Philippines',
  usedFallbackLocation: true,
};

const location: LocationResult = {
  coordinates: { latitude: 14.5995, longitude: 120.9842 },
  label: 'Manila, Philippines',
  usedFallback: true,
};

function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}

describe('performWeatherFetch (useWeather integration)', () => {
  it('returns stale when a newer request supersedes an in-flight fetch', async () => {
    const guard = createRequestGuard();
    let resolveSlow!: (value: WeatherBundle) => void;
    const slowFetch = new Promise<WeatherBundle>((resolve) => {
      resolveSlow = resolve;
    });

    let fetchCallCount = 0;
    const getWeather = jest.fn(() => {
      fetchCallCount += 1;
      if (fetchCallCount === 1) return slowFetch;
      return Promise.resolve({
        ...sampleBundle,
        locationLabel: 'Fast response',
      });
    });

    const dependencies = {
      locationProvider: {
        getCurrentLocation: async () => location,
      },
      weatherRepository: { getWeather },
    };

    const slowId = guard.nextId();
    const slowResultPromise = performWeatherFetch(
      slowId,
      guard,
      5,
      dependencies,
    );

    await flushMicrotasks();

    const fastId = guard.nextId();
    const fastResultPromise = performWeatherFetch(
      fastId,
      guard,
      5,
      dependencies,
    );

    const fastOutcome = await fastResultPromise;
    expect(fastOutcome.type).toBe('success');
    if (fastOutcome.type === 'success') {
      expect(fastOutcome.data.locationLabel).toBe('Fast response');
    }

    resolveSlow({
      ...sampleBundle,
      locationLabel: 'Stale response',
    });

    const slowOutcome = await slowResultPromise;
    expect(slowOutcome.type).toBe('stale');
  });
});
