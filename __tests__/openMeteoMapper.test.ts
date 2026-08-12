import { mapOpenMeteoResponse } from '../src/data/openMeteo/openMeteoMapper';
import {
  weatherCodeToLabel,
  type OpenMeteoResponse,
} from '../src/data/openMeteo/OpenMeteoClient';
import type { ForecastDayCount } from '../src/domain/entities/Weather';

describe('weatherCodeToLabel', () => {
  it('maps known WMO codes to readable labels', () => {
    expect(weatherCodeToLabel(0)).toBe('Clear sky');
    expect(weatherCodeToLabel(3)).toBe('Overcast');
    expect(weatherCodeToLabel(61)).toBe('Rain');
    expect(weatherCodeToLabel(95)).toBe('Thunderstorm');
  });

  it('returns Unknown for unmapped codes', () => {
    expect(weatherCodeToLabel(999)).toBe('Unknown');
  });
});

describe('mapOpenMeteoResponse', () => {
  const sampleResponse: OpenMeteoResponse = {
    current: {
      time: '2026-08-12T10:00',
      temperature_2m: 28.4,
      relative_humidity_2m: 72,
      apparent_temperature: 31.1,
      weather_code: 2,
      wind_speed_10m: 12.5,
    },
    daily: {
      time: ['2026-08-12', '2026-08-13', '2026-08-14'],
      weather_code: [2, 61, 0],
      temperature_2m_max: [30, 29, 31],
      temperature_2m_min: [24, 23, 25],
    },
  };

  it('maps current conditions and daily forecast rows', () => {
    const bundle = mapOpenMeteoResponse(
      sampleResponse,
      'Manila, Philippines',
      true,
      3,
    );

    expect(bundle.locationLabel).toBe('Manila, Philippines');
    expect(bundle.usedFallbackLocation).toBe(true);
    expect(bundle.current.temperatureCelsius).toBe(28.4);
    expect(bundle.current.conditionLabel).toBe(weatherCodeToLabel(2));
    expect(bundle.forecast).toHaveLength(3);
    expect(bundle.forecast[1].conditionLabel).toBe('Rain');
    expect(bundle.forecast[1].maxTemperatureCelsius).toBe(29);
  });

  it('respects the requested forecast day count', () => {
    const bundle = mapOpenMeteoResponse(
      sampleResponse,
      'Test',
      false,
      2 as ForecastDayCount,
    );

    expect(bundle.forecast).toHaveLength(2);
  });
});
