import { WeatherServiceError } from '../../shared/errors/AppError';

export function weatherCodeToLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code === 51 || code === 53 || code === 55) return 'Drizzle';
  if (code === 56 || code === 57) return 'Freezing drizzle';
  if (code === 61 || code === 63 || code === 65) return 'Rain';
  if (code === 66 || code === 67) return 'Freezing rain';
  if (code === 71 || code === 73 || code === 75) return 'Snow';
  if (code === 77) return 'Snow grains';
  if (code === 80 || code === 81 || code === 82) return 'Rain showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Thunderstorm with hail';
  return 'Unknown';
}

export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface OpenMeteoParams {
  latitude: number;
  longitude: number;
  forecastDays: number;
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchOpenMeteoForecast(
  params: OpenMeteoParams,
): Promise<OpenMeteoResponse> {
  const url = new URL(BASE_URL);
  url.searchParams.set('latitude', String(params.latitude));
  url.searchParams.set('longitude', String(params.longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min',
  );
  url.searchParams.set('forecast_days', String(params.forecastDays));
  url.searchParams.set('timezone', 'auto');

  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch {
    throw new WeatherServiceError(
      'Network request failed',
      'network',
    );
  }

  if (response.status === 429) {
    throw new WeatherServiceError(
      'Rate limited by weather service',
      'rate_limited',
    );
  }

  if (response.status >= 500) {
    throw new WeatherServiceError(
      `Weather service unavailable (${response.status})`,
      'service_unavailable',
    );
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      `Weather API request failed (${response.status})`,
      'network',
    );
  }

  return response.json() as Promise<OpenMeteoResponse>;
}
